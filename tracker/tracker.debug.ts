import Stats from 'stats-js';

export const TrackerDebug = () => {
    /// Stats for debugging
    var stats = new Stats();
    stats.showPanel(0);
    stats.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
    document.body.appendChild(stats.domElement);

    return {
        drawLoopStart: () => {
            stats.end();
            stats.begin();
        }
    }
}