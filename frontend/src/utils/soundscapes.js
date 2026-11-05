// Browser Web Audio API Soundscape Generator
class SoundscapeEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrack = "rain"; // "rain" | "breeze" | "vinyl"
    this.nodes = [];
    this.gainNode = null;
    this.volume = 0.4;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  play(track = "rain") {
    this.stop();
    this.init();
    this.currentTrack = track;
    this.isPlaying = true;

    if (track === "rain") {
      this.playRainSoundscape();
    } else if (track === "breeze") {
      this.playForestBreezeSoundscape();
    } else if (track === "vinyl") {
      this.playWarmLoFiSoundscape();
    }
  }

  stop() {
    this.isPlaying = false;
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // already stopped
      }
    });
    this.nodes = [];
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  playRainSoundscape() {
    // Rain falling on the roof: pink noise combined with soft roof impact resonance
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      // Add delicate roof-patter raindrop transients
      if (Math.random() < 0.0008) {
        output[i] += (Math.random() * 0.22 - 0.11);
      }
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for cozy muffled indoor shelter sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    // Warm peaking filter simulating roof timbre and reverberance
    const roofResonance = this.ctx.createBiquadFilter();
    roofResonance.type = "peaking";
    roofResonance.frequency.setValueAtTime(320, this.ctx.currentTime);
    roofResonance.Q.setValueAtTime(2.0, this.ctx.currentTime);
    roofResonance.gain.setValueAtTime(4.0, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(110, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(roofResonance);
    roofResonance.connect(highpass);
    highpass.connect(this.gainNode);

    whiteNoise.start();
    this.nodes.push(whiteNoise, filter, roofResonance, highpass);
  }

  playForestBreezeSoundscape() {
    // Gentle modulated brown noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // LFO for swaying wind
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    brownNoise.connect(filter);
    filter.connect(this.gainNode);

    brownNoise.start();
    lfo.start();
    this.nodes.push(brownNoise, filter, lfo, lfoGain);
  }

  playWarmLoFiSoundscape() {
    // Soft Solfeggio 528Hz healing harmonic tone + warm crackle
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(528 / 2, this.ctx.currentTime); // 264Hz warm tone

    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz pure tone

    const toneGain = this.ctx.createGain();
    toneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc1.connect(toneGain);
    osc2.connect(toneGain);
    toneGain.connect(this.gainNode);

    osc1.start();
    osc2.start();
    this.nodes.push(osc1, osc2, toneGain);
  }
}

export const soundscape = new SoundscapeEngine();
