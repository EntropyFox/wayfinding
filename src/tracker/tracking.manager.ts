import { BehaviorSubject } from 'rxjs';
import { CanvasElement } from '../element-factories/canvas.factory';
import { getImageDataFromUrl } from '../function-helpers/image.functions';

import { FPSCounter } from './fps.counter';
import { VideoHandler } from './video.handler';
import { TrackingResult } from './tracking.model';
import { WorkerHandler } from '../workers/work.handler';
import Stats from 'stats-js';
import { DebugPanel } from '../debug-panel';

export const TrackingManager = async () => {

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    /// Setup webworker in a service worker
    // const planarHandler = PlanarHandler();
    // await planarHandler.load();
    // planarHandler.init();
    const workerHandler = await WorkerHandler();
    const videoHandler = await VideoHandler();

    const videoCanvas = document.getElementById('videoCanvas') as HTMLCanvasElement;

    /// Clousre states
    const trackingState$ = new BehaviorSubject<TrackingResult>({
        isTracked: false,
        modelMatrix: null
    });
    const trackingStateChanged$ = new BehaviorSubject<boolean>(false);

    // Start video. We need to starte video before we are certain of the size
    const screenSize = await videoHandler.startVideo();
    let srcCanvas = CanvasElement(screenSize);
    
    /// Encapsulating tracking loop
    let isProcessingFrame = false;
    let currentFrame;
    const startTracking = async () => {
        await workerHandler.initFilter(screenSize.height, screenSize.width);

        const videoCanvasCtx = videoCanvas.getContext('2d', {
            alpha: false
        });
        
        isProcessingFrame = false;

        let imgData: ImageData;

        const loopFps = FPSCounter();
        const trackingFps = FPSCounter();
               
        const trackingLoop = (totalMs) => {
            
            if (isProcessingFrame) {
                srcCanvas.draw(videoHandler.element);
                imgData = srcCanvas.getImageData();
                videoCanvasCtx.drawImage(srcCanvas.getElement(), 0, 0);
            }

            /// Process new frame if the last result is returned
            if (!isProcessingFrame) {
                trackingFps.start();
                isProcessingFrame = true;
                workerHandler.processFrame(srcCanvas.getImageData(), new Date().getTime()).then(() => {
                    stats.end();
                    stats.begin();
                    workerHandler.getPose().then(result => {
                        isProcessingFrame = false;
                        trackingState$.next(result);
                        if (trackingStateChanged$.value !== result.isTracked) trackingStateChanged$.next(result.isTracked);
                        /// FPS and debugging
                        trackingFps.end();
                        const delta = trackingFps.delta();
                        // fpsSampler.updateDeltaAvg(delta);
                        DebugPanel.out2(`delta:  ${delta.toFixed(2)}`);
                    });
                });
            }

            /// Calculate loop FPS
            loopFps.end();
            // deltaMs = deltaMs + loopFps.delta();
            // DebugPanel.out3(loopFps.delta().toFixed(2));
            loopFps.start();
            currentFrame = requestAnimationFrame(trackingLoop);
        };
        console.log('Start tracking');
        trackingLoop(0);
    }

    const stopTracking = () => {
        cancelAnimationFrame(currentFrame);
    }

    const setVideoCanvas = (scale: number) => {
        videoCanvas.width = screenSize.width;
        videoCanvas.height = screenSize.height;
        const videoCanvasCtx = videoCanvas.getContext('2d', {
            alpha: false
        });
        videoCanvasCtx.scale(scale, scale);
    }
    setVideoCanvas(1);

    let target: ImageData;

    return {
        setTarget: async (templateUrl: string) => {
            templateUrl = templateUrl;
            target = await getImageDataFromUrl(templateUrl);
            const rect = await workerHandler.setMarker(target);
            return rect;
        },
        start: async (): Promise<void> => {
            startTracking().then();
        },
        stop: () => {
            stopTracking();
            workerHandler.destroy();
        },
        size: videoHandler.size(),
        // scaleVideo,
        trackingStateChanged$: trackingStateChanged$.asObservable(),
        trackingState$: trackingState$.asObservable(),
    };
};

export type Tracker = ReturnType<typeof TrackingManager>;
export type TrackerInstance = UnboxPromise<Tracker>;

export type FrameSize = {
    width: number;
    height: number;
}
