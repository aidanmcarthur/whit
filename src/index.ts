import { VideoPlayer } from './video-player';

const container = document.getElementById('player-container');

if (container) {
    try {
        const player = new VideoPlayer({
            container,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            autoplay: false,
            controls: true,
            width: 1920,
            height: 1080
        });
    } catch (error) {
        console.error('Error creating player:', error);
    }
} else {
    console.error('Container element not found');
}