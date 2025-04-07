export interface VideoPlayerOptions {
  container: HTMLElement;
  videoUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  width?: number;
  height?: number;
}

export interface VideoPlayerControls {
  play(): void;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  toggleMute(): void;
  setPlaybackRate(rate: number): void;
} 