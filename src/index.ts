import { TrackingManager } from './tracker/tracking.manager';
// import "./styles/style.css";
import { ARSceneRendere } from './webgl/ar-scene.rendere';
import { DebugPanel } from './debug-panel';
import { WayFinding } from './wayfinding/wayfinding';
import { openModal } from './services/modal.service';

document.addEventListener('DOMContentLoaded', theDomHasLoaded, false);
document.addEventListener('DOMContentLoaded', theDomHasLoaded, false);

DebugPanel.setColor('#FF00FF');

const system = process.env.SYSTEM || 'tracking';
console.log('SYSTEM: ', system);

async function theDomHasLoaded(e) {
    let isBrowserCompatiple = true;

    /// Detect ios and browser
    if (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        navigator.userAgent.indexOf('Chrome') != -1
    ) {
        isBrowserCompatiple = false;

        console.log('Ios and chrome');
        const div = document.createElement('div') as HTMLDivElement;
        div.innerHTML = 'Oplevelsen virker desvære kun i Safari';
        div.classList.add('interact');

        const splashDiv = document.getElementById('splash');
        splashDiv.appendChild(div);

        const tapStart = document.getElementById('tap-start');
        tapStart.style.display = 'none';
    }

    if (!isBrowserCompatiple) {
        return;
    }

    document.querySelector('#splash').addEventListener('click', () => {
        document.getElementById('splash').remove();
        if (system === 'tracking') {
            const trackingManager = TrackingManager();
            const captureContent = document.getElementById('capture-content');
            captureContent.style.display = 'none';
            const canvas = <HTMLCanvasElement>(
                document.querySelector('#renderCanvas')
            );
            trackingManager.then(async (tracker) => {
                canvas.width = tracker.size.width;
                canvas.height = tracker.size.height;
                const renderer = await ARSceneRendere(canvas);

                await tracker.setTarget(
                    'https://storage.googleapis.com/hololink/image-tracking/magic-maze.jpg'
                );
                tracker.start();
                renderer.runTracker(tracker);
                DebugPanel.out1(
                    `size: ${tracker.size.width}, ${tracker.size.height}`
                );

                let t1,
                    t0 = performance.now();
                const resultElm = document.getElementById(
                    'result'
                ) as HTMLParagraphElement;
                tracker.trackingState$.subscribe((result) => {
                    // stats.begin();
                    t1 = performance.now();
                    DebugPanel.updateResult(`isTracked: ${result.isTracked}`);
                    t0 = performance.now();
                    // stats.end();
                });
            });
        }
        if (system === 'wayfinding') {
            const trackerContent = document.getElementById('tracker-content');
            trackerContent.style.display = 'none';
            const sensorContent = document.getElementById('sensor-content');
            WayFinding().then();
        }
    });
}
