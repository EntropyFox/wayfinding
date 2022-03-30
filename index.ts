import { TrackingManager } from "./tracker/tracking.manager";
import "./styles/style.css";
import { DebugPanel } from "./debug-panel";
import { ARSceneRendere } from "./webgl/ar-scene.rendere";

document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);

DebugPanel.setColor("#FF00FF");

const mode = process.env.mode || "tracking";

async function theDomHasLoaded(e) {
	if (mode === "tracking") {
		const trackingManager = TrackingManager();
		const captureContent = document.getElementById("capture-content");
		captureContent.style.display = "none";
		const canvas = <HTMLCanvasElement>document.querySelector("#renderCanvas");
		trackingManager.then(async (tracker) => {
			canvas.width = tracker.size.width;
			canvas.height = tracker.size.height;
			const renderer = await ARSceneRendere(canvas);

			await tracker.setTarget(
				"https://storage.googleapis.com/hololink/image-tracking/magic-maze.jpg"
			);
			tracker.start();
			renderer.runTracker(tracker);
			DebugPanel.out1(`size: ${tracker.size.width}, ${tracker.size.height}`);

			let t1,
				t0 = performance.now();
			const resultElm = document.getElementById(
				"result"
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
}
