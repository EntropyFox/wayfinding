import { isMobile } from "../webcam.manager";

export const VideoElement = async(
    mediaConstraint: MediaTrackConstraints
) => {
    const video = document.getElementById('inputVideo') as HTMLVideoElement;
    video.style.display = 'none';

    let isplaying = false;

    const stream = await navigator.mediaDevices.getUserMedia({
        video: mediaConstraint,
        audio: false,
    });
    const track = stream.getVideoTracks()[0];

    const play = async () => {
        video.srcObject = stream;
        await video.play();
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        isplaying = true;
    };


    return {
        load: async () => play(),
        play: async () => video.play(),
        pause: () => video.pause(),
        setConstraint: async(constraint: MediaTrackConstraints): Promise<Size> => {
            await track.applyConstraints(constraint);

            return {
                width: (isMobile() ? track.getConstraints().height : track.getConstraints().width) as number,
                height: (isMobile() ? track.getConstraints().width : track.getConstraints().height) as number
            }

        },
        size: (): Size => {
            return {
                width: video.videoWidth,
                height: video.videoHeight
            }
        },
        isPlaying: () => isplaying,
        element: () => video,
    };
};

export const CameraConstraints: { [key: string]: MediaTrackConstraints } = {
    qvga: {
        width: { exact: 320 },
        height: { exact: 240 },
        facingMode: 'environment',
    },
    vga: {
        width: { exact: 480 },
        height: { exact: 630 },
        facingMode: 'environment',
        frameRate: 24
    },
    full: {
        width: window.screen.width,
        height: window.screen.height,
        facingMode: 'environment',
    },
    test: {
        width: 650,
        height: 350,
        facingMode: 'environment',
    },
    'mobile-portrait': {
        width: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
        height: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        facingMode: 'environment',
    },
    'mobile-landscape': {
        width: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight),
        facingMode: 'environment',
    },
}

export const GetConstraint = (resolution:
    | 'mobile-portrait'
    | 'qvga'
    | 'vga'
    | 'full'
    | 'test'
    | 'mobile-landscape' = 'mobile-portrait') => {
        return CameraConstraints[resolution];
    }