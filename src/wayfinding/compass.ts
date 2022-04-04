import { BehaviorSubject } from 'rxjs';

export const Compass = () => {
    const isIOS =
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/);

    const heading$ = new BehaviorSubject<number>(0);

    const handler = (e) => {
        // Der foregår noget underligt her!? Jeg får skiftene værdier på "heading"
        // Den fyrer hver gang én af akserne ændrer sig?
        const heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        document.getElementById('debug2').innerHTML = `heading is ${heading}`;
        heading$.next(heading);
    };

    if (isIOS) {
        (DeviceOrientationEvent as any)
            .requestPermission()
            .then((response) => {
                if (response === 'granted') {
                    alert("it's iOS");
                    window.addEventListener('deviceorientation', handler, true);
                } else {
                    alert('has to be allowed!');
                }
            })
            .catch(() => alert('not supported'));
    } else {
        window.addEventListener('deviceorientationabsolute', handler, true);
    }

    return {
        heading$: heading$.asObservable(),
    };
};
