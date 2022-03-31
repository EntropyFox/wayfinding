import { GetConstraint, VideoElement } from '../element-factories/video.factory';
import { isMobile } from '../webcam.manager';

export const VideoHandler = async () => {
    const videoConstraint: MediaTrackConstraints = isMobile() ? {
        width: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
        height: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        facingMode: 'environment',
    } : GetConstraint('vga');
    console.log('videoConstraint: ', videoConstraint);

    const video = await VideoElement(videoConstraint);
    console.log('video: ', video);

    /// Video canvas where we draw the video stream
    const videoCanvas = document.getElementById('videoCanvas') as HTMLCanvasElement;

    // Start the video
    const startVideo = async () => {
        await video.load();
        await video.play();

        // console.log('videoHeight', videoElement.videoHeight);
        const size = video.size();

        // Center the video acording to the size of the video stream
        let root = document.documentElement;
        root.style.setProperty('--video-width', `${size.width}px`);
        root.style.setProperty('--video-height', `${size.height}px`);
        return {
            width: size.width,
            height: size.height
        }
    }

    const setVideoCanvas = (scale: number) => {
        videoCanvas.width = video.size().width;
        videoCanvas.height = video.size().height;
        const videoCanvasCtx = videoCanvas.getContext('2d', {
            alpha: false
        });
        if (scale !== 1) {
            videoCanvasCtx.scale(scale, scale);
        }
    }
    /// Create canvas with a uniformscale 1 do not scale
    setVideoCanvas(1);

    const videoCanvasCtx = videoCanvas.getContext('2d', {
        alpha: false
    });


    /// Debugging with single image instead of video stream
    /// Debug with only an image
    // if (mode === 'image') {

    // }

    //'https://assets.hololink.io/test/magic_maze01_480x630.jpg'

    const imageMode = (src: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            // const IMAGE_DEBUG = true;
            const img = document.createElement('img');
            img.crossOrigin = "Anonymous";
            img.src = src;
            img.onload = () => {
                console.log('image ready');
                resolve(img);
            }
        });
    }
    let img: HTMLImageElement;
    const mode = process.env.MODE || 'video';
    if (mode === 'image') {
        const fish = 'https://assets.hololink.io/test/fish.jpg';
        const magicMaze = 'https://assets.hololink.io/test/magic_maze01_480x630.jpg';
        img = await imageMode(magicMaze);
    }

    const element = (mode === 'video') ? video.element() : img;

    return {
        startVideo,
        element,
        // videoElement: () => video.element(),
        size: () => video.size(),
        videoCanvasCtx
    }
}