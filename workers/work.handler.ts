import { FilterHandler } from "./filter/filter.handler";
import { PlanarHandler } from "./planar/planar.handler";


export const WorkerHandler = async () => {
    console.log('WorkerHandler: ');
    /// Initialize workers
    /// Setup webworker in a service worker
    const planarHandler = PlanarHandler();
    const filterHandler = FilterHandler();

    await planarHandler.load();
    await filterHandler.load();
    

    planarHandler.init();

    console.log('Workers ready');

    /// Internal states
    let rect: Module.Rect;
    let currentPose: Module.PoseContext;
    let currentHomography: any;

    return {
        // setFrameSrc: planarHandler.setFrameSrc,
        initFilter: async (height: number, width: number) => {
            console.log('initFilter');
            console.log('height: ', height);
            console.log('width: ', width);
            await planarHandler.setFrameSrc(height, width);
            return filterHandler.init(height, width, rect);
        },
        // setFrameSrc: planarHandler.setFrameSrc,
        processFrame: planarHandler.processFrame,
        // getPose: planarHandler.getPose,
        getPoseFromPlanarDetector: async() => {
            currentPose = await planarHandler.getPose();
            return currentPose;
        },
        updateFiler: async() => {
            // return filterHandler.updatePose(currentPose);
        },
        getPoseFilter: async() => {
            return filterHandler.getPose();
        },
        getPose: async () => {
            currentPose = await planarHandler.getPose();
            // console.log('currentPose: ', currentPose);
            currentHomography = await planarHandler.getHomography();
            // console.log('currentHomography: ', currentHomography);
            currentPose.homographyIndexed = currentHomography;
            
            await filterHandler.updatePose(currentPose);
            const result = await filterHandler.getPose();
            // return filterHandler.getPose();
            // console.log('homography: ', currentPose.homographyArray);
            return result;
        },
        setMarker: async(imageData: ImageData) => {
            rect = await planarHandler.setMarker(imageData);
            console.log('rect: ', rect);
        },
        destroy: () => {
            planarHandler.destroy();
        }
    }
}