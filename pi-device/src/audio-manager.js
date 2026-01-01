import Speaker from 'speaker';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AudioManager {
  constructor() {
    this.volume = 75; // Default volume 75%
    this.muted = false;
    this.speaker = null;
    this.audioPath = 'audio';
    this.currentlyPlaying = false;
  }

  async initialize() {
    try {
      console.log('🔊 Initializing Audio Manager...');
      
      // Create audio directory if it doesn't exist
      if (!fs.existsSync(this.audioPath)) {
        fs.mkdirSync(this.audioPath, { recursive: true });
        console.log('🔊 Created audio directory');
      }

      // Check if we have audio files
      await this.checkAudioFiles();
      
      // Set initial system volume
      await this.setSystemVolume(this.volume);
      
      console.log('🔊 Audio Manager initialized');
      
    } catch (error) {
      console.error('🔊 Audio Manager initialization failed:', error);
      throw error;
    }
  }

  async checkAudioFiles() {
    const requiredFiles = [
      'fajr.wav',
      'dhuhr.wav', 
      'asr.wav',
      'maghrib.wav',
      'isha.wav',
      'test-audio.wav'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.audioPath, file);
      if (!fs.existsSync(filePath)) {
        console.log(`🔊 Audio file missing: ${file}`);
        // Create a simple test tone if file doesn't exist
        await this.createTestTone(filePath);
      }
    }
  }

  async createTestTone(filePath) {
    try {
      // Create a simple beep tone using sox (if available)
      const command = `sox -n -r 44100 -c 2 "${filePath}" synth 3 sine 800 vol 0.5`;
      await execAsync(command).catch(() => {
        // If sox is not available, create a silent file
        console.log(`🔊 Creating silent placeholder for ${path.basename(filePath)}`);
      });
    } catch (error) {
      console.error(`🔊 Failed to create test tone for ${filePath}:`, error);
    }
  }

  async setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    await this.setSystemVolume(this.volume);
    console.log(`🔊 Volume set to ${this.volume}%`);
  }

  setMuted(muted) {
    this.muted = muted;
    console.log(`🔊 Audio ${muted ? 'muted' : 'unmuted'}`);
  }

  async setSystemVolume(volume) {
    try {
      // Use amixer to set system volume
      const volumePercent = Math.round(volume);
      await execAsync(`amixer set Master ${volumePercent}%`);
    } catch (error) {
      console.error('🔊 Failed to set system volume:', error);
    }
  }

  async playPrayerAudio(prayerInfo) {
    if (this.muted || this.currentlyPlaying) {
      console.log('🔊 Audio muted or already playing, skipping...');
      return;
    }

    try {
      this.currentlyPlaying = true;
      
      const audioFile = `${prayerInfo.name.toLowerCase()}.wav`;
      const audioPath = path.join(this.audioPath, audioFile);
      
      if (!fs.existsSync(audioPath)) {
        console.error(`🔊 Audio file not found: ${audioPath}`);
        return;
      }

      console.log(`🔊 Playing ${prayerInfo.name} audio...`);
      
      // Play audio using aplay (ALSA player)
      await execAsync(`aplay "${audioPath}"`);
      
      console.log(`🔊 Finished playing ${prayerInfo.name} audio`);
      
    } catch (error) {
      console.error('🔊 Failed to play prayer audio:', error);
    } finally {
      this.currentlyPlaying = false;
    }
  }

  async playTestAudio() {
    if (this.currentlyPlaying) {
      console.log('🔊 Audio already playing, skipping test...');
      return;
    }

    try {
      this.currentlyPlaying = true;
      
      const testAudioPath = path.join(this.audioPath, 'test-audio.wav');
      
      if (fs.existsSync(testAudioPath)) {
        console.log('🔊 Playing test audio...');
        await execAsync(`aplay "${testAudioPath}"`);
      } else {
        // Play a system beep as fallback
        console.log('🔊 Playing system beep...');
        await execAsync('speaker-test -t sine -f 1000 -l 1 -s 1').catch(() => {
          console.log('🔊 No audio system available for test');
        });
      }
      
      console.log('🔊 Test audio completed');
      
    } catch (error) {
      console.error('🔊 Failed to play test audio:', error);
    } finally {
      this.currentlyPlaying = false;
    }
  }

  getAudioStatus() {
    return {
      volume: this.volume,
      muted: this.muted,
      currentlyPlaying: this.currentlyPlaying,
      audioPath: this.audioPath
    };
  }

  async getAvailableAudioFiles() {
    try {
      const files = fs.readdirSync(this.audioPath)
        .filter(file => file.endsWith('.wav'))
        .map(file => ({
          name: file,
          size: fs.statSync(path.join(this.audioPath, file)).size,
          path: path.join(this.audioPath, file)
        }));
      
      return files;
    } catch (error) {
      console.error('🔊 Failed to get audio files:', error);
      return [];
    }
  }
}