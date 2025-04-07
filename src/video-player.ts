import { VideoPlayerOptions, VideoPlayerControls } from './types/video-player';

export class VideoPlayer implements VideoPlayerControls {
  private videoElement: HTMLVideoElement;
  private container: HTMLElement;
  private controlsContainer: HTMLElement;
  private isPlaying: boolean = false;

  constructor(options: VideoPlayerOptions) {
    console.log('Creating VideoPlayer instance with options:', options);
    this.container = options.container;
    this.videoElement = document.createElement('video');
    this.controlsContainer = document.createElement('div');
    
    try {
      this.initializePlayer(options);
      this.setupControls();
      console.log('VideoPlayer initialized successfully');
    } catch (error) {
      console.error('Error initializing VideoPlayer:', error);
      throw error;
    }
  }

  private initializePlayer(options: VideoPlayerOptions): void {
    console.log('Initializing player with URL:', options.videoUrl);
    this.videoElement.src = options.videoUrl;
    this.videoElement.autoplay = options.autoplay || false;
    this.videoElement.controls = false; // We'll implement our own controls

    if (options.width) this.videoElement.width = options.width;
    if (options.height) this.videoElement.height = options.height;

    // Add error handling for the video element
    this.videoElement.addEventListener('error', (e) => {
      console.error('Video error:', e);
      const videoError = this.videoElement.error;
      if (videoError) {
        console.error('Video error details:', {
          code: videoError.code,
          message: videoError.message
        });
      }
    });

    this.videoElement.addEventListener('loadeddata', () => {
      console.log('Video data loaded');
    });

    this.container.appendChild(this.videoElement);
    this.container.appendChild(this.controlsContainer);
  }

  private setupControls(): void {
    console.log('Setting up controls');
    this.controlsContainer.className = 'video-controls';
    this.controlsContainer.innerHTML = `
      <button class="play-pause">Play</button>
      <input type="range" class="progress" min="0" max="100" value="0">
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

    this.videoElement.addEventListener('timeupdate', () => {
      if (progressBar) {
        progressBar.value = (this.videoElement.currentTime / this.videoElement.duration * 100).toString();
      }
    });

    progressBar.addEventListener('input', (e) => {
      const time = (Number((e.target as HTMLInputElement).value) / 100) * this.videoElement.duration;
      this.seek(time);
    });
  }

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