import { EqualizerSettings, Song } from '../types/music';

type AudioEventCallback = () => void;
type TimeUpdateCallback = (currentTime: number, duration: number) => void;

export class AudioEngine {
  private static instance: AudioEngine;

  private audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;

  // 5-band EQ filters
  private bassFilter: BiquadFilterNode | null = null;
  private lowMidFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private highMidFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;

  // Fallback synthesizer oscillator nodes when external URL fails
  private synthInterval: number | null = null;
  private isSynthActive = false;

  private onTimeUpdateCb: TimeUpdateCallback | null = null;
  private onEndedCb: AudioEventCallback | null = null;
  private onPlayCb: AudioEventCallback | null = null;
  private onPauseCb: AudioEventCallback | null = null;
  private onErrorCb: ((err: any) => void) | null = null;

  private currentSong: Song | null = null;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.crossOrigin = 'anonymous';

    this.setupAudioListeners();
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private initAudioContext() {
    if (this.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.compressor = this.audioCtx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, this.audioCtx.currentTime);
      this.compressor.knee.setValueAtTime(30, this.audioCtx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.audioCtx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

      this.masterGain = this.audioCtx.createGain();

      // Filters
      this.bassFilter = this.audioCtx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.setValueAtTime(60, this.audioCtx.currentTime);

      this.lowMidFilter = this.audioCtx.createBiquadFilter();
      this.lowMidFilter.type = 'peaking';
      this.lowMidFilter.frequency.setValueAtTime(230, this.audioCtx.currentTime);
      this.lowMidFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.midFilter = this.audioCtx.createBiquadFilter();
      this.midFilter.type = 'peaking';
      this.midFilter.frequency.setValueAtTime(910, this.audioCtx.currentTime);
      this.midFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.highMidFilter = this.audioCtx.createBiquadFilter();
      this.highMidFilter.type = 'peaking';
      this.highMidFilter.frequency.setValueAtTime(3600, this.audioCtx.currentTime);
      this.highMidFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.trebleFilter = this.audioCtx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.setValueAtTime(14000, this.audioCtx.currentTime);

      // Connect HTML Audio -> Filters -> Compressor -> Analyser -> MasterGain -> Destination
      try {
        this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.sourceNode
          .connect(this.bassFilter)
          .connect(this.lowMidFilter)
          .connect(this.midFilter)
          .connect(this.highMidFilter)
          .connect(this.trebleFilter)
          .connect(this.compressor)
          .connect(this.analyser)
          .connect(this.masterGain)
          .connect(this.audioCtx.destination);
      } catch {
        // Fallback if mediaElementSource fails
      }
    } catch {
      // AudioContext unavailable
    }
  }

  private setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCb) {
        this.onTimeUpdateCb(this.audio.currentTime, this.audio.duration || this.currentSong?.duration || 0);
      }
    });

    this.audio.addEventListener('play', () => {
      this.stopSynthesizer();
      if (this.onPlayCb) this.onPlayCb();
    });

    this.audio.addEventListener('pause', () => {
      if (this.onPauseCb) this.onPauseCb();
    });

    this.audio.addEventListener('ended', () => {
      if (this.onEndedCb) this.onEndedCb();
    });

    this.audio.addEventListener('error', (err) => {
      // If error loading remote file, trigger synthesizer fallback so audio still plays!
      this.startSynthesizerFallback();
      if (this.onErrorCb) this.onErrorCb(err);
    });
  }

  public async playSong(song: Song) {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.stopSynthesizer();
    this.currentSong = song;

    if (this.audio.src !== song.audioUrl) {
      this.audio.src = song.audioUrl;
      this.audio.currentTime = 0;
    }

    try {
      await this.audio.play();
    } catch {
      // If browser blocked or CORS error, run synth fallback
      this.startSynthesizerFallback();
      if (this.onPlayCb) this.onPlayCb();
    }
  }

  public pause() {
    this.audio.pause();
    this.stopSynthesizer();
  }

  public async resume() {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (this.isSynthActive) {
      this.startSynthesizerFallback();
      if (this.onPlayCb) this.onPlayCb();
      return;
    }

    try {
      await this.audio.play();
    } catch {
      this.startSynthesizerFallback();
      if (this.onPlayCb) this.onPlayCb();
    }
  }

  public seek(seconds: number) {
    if (!isNaN(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || this.currentSong?.duration || 0));
    }
  }

  public setVolume(volume: number) {
    // 0 to 1
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
  }

  public setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }

  public applyEqualizer(eq: EqualizerSettings) {
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    if (this.bassFilter) this.bassFilter.gain.setValueAtTime(eq.bass + (eq.bassBoost * 0.1), now);
    if (this.lowMidFilter) this.lowMidFilter.gain.setValueAtTime(eq.lowMid, now);
    if (this.midFilter) this.midFilter.gain.setValueAtTime(eq.mid, now);
    if (this.highMidFilter) this.highMidFilter.gain.setValueAtTime(eq.highMid, now);
    if (this.trebleFilter) this.trebleFilter.gain.setValueAtTime(eq.treble, now);

    if (this.compressor) {
      // Loudness normalization on/off
      this.compressor.threshold.setValueAtTime(eq.normalization ? -24 : 0, now);
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      // Return simulated bouncy wave if audio context is not ready
      const dummy = new Uint8Array(32);
      if (!this.audio.paused || this.isSynthActive) {
        const time = Date.now() / 200;
        for (let i = 0; i < dummy.length; i++) {
          dummy[i] = Math.floor(100 + Math.sin(time + i * 0.4) * 80 + Math.random() * 20);
        }
      }
      return dummy;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray.slice(0, 32); // 32 spectrum bands
  }

  // --- Real synthesized ambient music fallback for offline/blocked streams ---
  private startSynthesizerFallback() {
    this.isSynthActive = true;
    if (this.synthInterval) clearInterval(this.synthInterval);

    let step = 0;
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 293.66, 392.00]; // C, E, G, C5, A, F, D, G
    let fakeTime = this.audio.currentTime || 0;

    this.synthInterval = window.setInterval(() => {
      fakeTime += 0.5;
      if (this.currentSong && fakeTime >= this.currentSong.duration) {
        fakeTime = 0;
        if (this.onEndedCb) this.onEndedCb();
      }

      if (this.onTimeUpdateCb) {
        this.onTimeUpdateCb(fakeTime, this.currentSong?.duration || 180);
      }

      // Generate soft piano / synth bell note
      if (this.audioCtx && this.audioCtx.state === 'running') {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = step % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(notes[step % notes.length], this.audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.04 * (this.audio.volume || 0.8), this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.4);

          osc.connect(gain);
          if (this.analyser) {
            gain.connect(this.analyser);
          } else {
            gain.connect(this.audioCtx.destination);
          }

          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.45);
        } catch {
          // ignore synth node errors
        }
      }
      step++;
    }, 500);
  }

  private stopSynthesizer() {
    this.isSynthActive = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public setCallbacks(callbacks: {
    onTimeUpdate?: TimeUpdateCallback;
    onEnded?: AudioEventCallback;
    onPlay?: AudioEventCallback;
    onPause?: AudioEventCallback;
    onError?: (err: any) => void;
  }) {
    if (callbacks.onTimeUpdate) this.onTimeUpdateCb = callbacks.onTimeUpdate;
    if (callbacks.onEnded) this.onEndedCb = callbacks.onEnded;
    if (callbacks.onPlay) this.onPlayCb = callbacks.onPlay;
    if (callbacks.onPause) this.onPauseCb = callbacks.onPause;
    if (callbacks.onError) this.onErrorCb = callbacks.onError;
  }
}
