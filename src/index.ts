import { VideoPlayer } from './video-player';

const container = document.getElementById('player-container');

if (container) {
    try {
        const player = new VideoPlayer({
            container,
            videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
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