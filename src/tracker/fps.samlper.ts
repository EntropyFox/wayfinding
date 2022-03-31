import { DebugPanel } from "../debug-panel";

/**
 * Finds the avarge FPS from a sample of N tracking callbacks
 */
export const FPSSampler = () => {
    
    const totalSamles = 4;
    let skipFrames = 2;
    
    
    let sampleCount = 1;
    let deltaAvg = 0;
    let totalDelta = 0;
    const updateDeltaAvg = (delta: number) => {
        if (skipFrames > 0) {
            skipFrames = skipFrames - 1;
        }
        if (sampleCount > totalSamles) {
            // return DebugPanel.out3(deltaAvg.toFixed(2));
        };
        totalDelta = totalDelta + delta;
        deltaAvg = totalDelta / sampleCount;
        sampleCount = sampleCount + 1;
    }

    return {
        updateDeltaAvg,
        done: () => sampleCount > totalSamles,
        avargeMs: () => deltaAvg
    }
}