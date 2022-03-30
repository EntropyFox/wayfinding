export const FPSCounter = () => {
    let delta = 0;
    let lastUpdateTracking = performance.now();

    return {
        start: () => lastUpdateTracking = performance.now(),
        end: () => delta = performance.now() - lastUpdateTracking,
        delta: () => delta,
    }
}