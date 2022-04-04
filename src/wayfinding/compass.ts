import { BehaviorSubject, filter } from 'rxjs';

export const Compass = async () => {
    const isIOS =
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/);

    const isMobile =
        navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod/i) !== null;

    const heading$ = new BehaviorSubject<number>(null);

    const handler = (e) => {
        /// On desktop we set heading to 0 (North)
        let heading = 45;
        if (isMobile) {
            heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        }
        heading$.next(heading);
    };

    if (isIOS) {
        try {
            const response = await (
                DeviceOrientationEvent as any
            ).requestPermission();
            if (response === 'granted') {
                window.addEventListener('deviceorientation', handler, true);
            } else {
            }
        } catch (error) {
            console.log('Not suppoerted');
        }
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
    }

    return {
        heading$: heading$.asObservable().pipe(filter((h) => h != null)),
    };
};
