import { VideoPlayerOptions, VideoPlayerControls } from './types/video-player';
import Hls from 'hls.js';
import './video-player.css';
export class VideoPlayer implements VideoPlayerControls {
  private videoElement: HTMLVideoElement;
  private container: HTMLElement;
  private controlsContainer: HTMLElement;
  private isPlaying: boolean = false;

  constructor(options: VideoPlayerOptions) {
    this.container = options.container;
    this.videoElement = document.createElement('video');
    this.controlsContainer = document.createElement('div');

    this.container.appendChild(this.videoElement);
    this.container.appendChild(this.controlsContainer);
    
    try {
      this.setupControls();
      this.initializePlayer(options);

    } catch (error) {
      console.error('Error initializing VideoPlayer:', error);
      throw error;
    }
  }

  private initializePlayer(options: VideoPlayerOptions): void {
    console.log('Initializing player with URL:', options.videoUrl);
    this.videoElement.autoplay = options.autoplay || false;
    this.videoElement.controls = false;

    if (options.width) this.videoElement.width = options.width;
    if (options.height) this.videoElement.height = options.height;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(options.videoUrl);
      hls.attachMedia(this.videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, this.play);
      hls.on(Hls.Events.BUFFER_APPENDED, () => {
        this.updateProgressBar();
      });
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('Using native HLS support');
      this.videoElement.src = options.videoUrl;
      this.videoElement.addEventListener('loadedmetadata', this.play);
    } else {
      alert('This browser does not support HLS.');
    }
  }

  private setupControls(): void {

    this.controlsContainer.className = 'video-controls';
    this.controlsContainer.innerHTML = `
      <button class="play-pause">Play</button>
      <div class="progress-wrapper">
        <input type="range" class="progress" min="0" max="100" value="0">
      </div>
      <button class="mute">Mute</button>
      <input type="range" class="volume" min="0" max="100" value="100">
    `;

    // Add event listeners
    const playPauseBtn = this.controlsContainer.querySelector('.play-pause');
    const progressBar = this.controlsContainer.querySelector('.progress') as HTMLInputElement;
    const muteBtn = this.controlsContainer.querySelector('.mute');
    const volumeBar = this.controlsContainer.querySelector('.volume') as HTMLInputElement;

    if (!playPauseBtn || !progressBar || !muteBtn || !volumeBar) {
      throw new Error('Failed to find control elements');
    }

    playPauseBtn.addEventListener('click', () => this.togglePlay());
    muteBtn.addEventListener('click', () => this.toggleMute());
    volumeBar.addEventListener('input', (e) => {
      this.setVolume(Number((e.target as HTMLInputElement).value) / 100);
    });

    this.videoElement.addEventListener('timeupdate', this.updateProgressBar);

    progressBar.addEventListener('input', (e) => {
      const time = (Number((e.target as HTMLInputElement).value) / 100) * this.videoElement.duration;
      this.seek(time);
    });
  }

  public updateProgressBar(): void {
    if (!this.controlsContainer) return;
    const progressBar = this.controlsContainer.querySelector('.progress') as HTMLInputElement;
    const video = this.videoElement;
  
    if (!progressBar || !video.duration) return;
  
    const played = (video.currentTime / video.duration) * 100;

    progressBar.value = played.toString();
  
    let buffered = 0;
    if (video.buffered.length) {
      buffered = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
    }
  
    progressBar.style.background = `linear-gradient(
      to right,
      #ff4d4d 0%,
      #ff4d4d ${played}%,
      #ccc ${played}%,
      #ccc ${buffered}%,
      #666 ${buffered}%,
      #666 100%
    )`;
  };
  

  public play(): void {
    console.log('Playing video');
    this.videoElement.play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayButton();
      })
      .catch(error => {
        console.error('Error playing video:', error);
      });
  }

  public pause(): void {
    console.log('Pausing video');
    this.videoElement.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }

  public togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(time: number): void {
    console.log('Seeking to:', time);
    this.videoElement.currentTime = time;
    this.updateProgressBar();
  }

  public setVolume(volume: number): void {
    console.log('Setting volume to:', volume);
    this.videoElement.volume = volume;
  }

  public toggleMute(): void {
    console.log('Toggling mute');
    this.videoElement.muted = !this.videoElement.muted;
    const muteBtn = this.controlsContainer.querySelector('.mute');
    if (muteBtn) {
      muteBtn.textContent = this.videoElement.muted ? 'Unmute' : 'Mute';
    }
  }

  public setPlaybackRate(rate: number): void {
    console.log('Setting playback rate to:', rate);
    this.videoElement.playbackRate = rate;
  }

  private updatePlayButton(): void {
    const playPauseBtn = this.controlsContainer.querySelector('.play-pause');
    if (playPauseBtn) {
      playPauseBtn.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
  }
} 