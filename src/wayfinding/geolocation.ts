import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

export type GeoPoint = {
    lat: number;
    lng: number;
}

export const GeoLocation = (geoPoint: GeoPoint) => {
    const geolocation$ = new BehaviorSubject<{
        distance: number,
        angle: number
    }>(null);

    const locationHandler = (position) => {
        const { latitude, longitude } = position.coords;
        let pointDegree = calcDegreeToPoint(latitude, longitude);

        if (pointDegree < 0) {
            pointDegree = pointDegree + 360;
        }

        const distance = distanceGeoPoints({
            lat: latitude,
            lng: longitude
        }, geoPoint);
        
        console.log('distance: ', distance);

        geolocation$.next({
            distance: distance,
            angle: pointDegree
        });
    };
    const calcDegreeToPoint = (latitude, longitude) => {
        const phiK = (geoPoint.lat * Math.PI) / 180.0;
        const lambdaK = (geoPoint.lng * Math.PI) / 180.0;
        const phi = (latitude * Math.PI) / 180.0;
        const lambda = (longitude * Math.PI) / 180.0;
        const psi =
            (180.0 / Math.PI) *
            Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
                Math.sin(phi) * Math.cos(lambdaK - lambda)
            );
        return Math.round(psi);
    };

    const distanceGeoPoints = (pointA: GeoPoint, pointB: GeoPoint) => {
        const p = 0.017453292519943295;    // Math.PI / 180
        const c = Math.cos;
        const a = 0.5 - c((pointB.lat - pointA.lat) * p)/2 + 
                c(pointA.lat * p) * c(pointB.lat * p) * 
                (1 - c((pointB.lng - pointA.lng) * p))/2;
      
        return 12742 * Math.asin(Math.sqrt(a));
      }

    navigator.geolocation.getCurrentPosition(locationHandler);

    return {
        geolocation$: geolocation$.asObservable().pipe(filter(g => g != null))
    }
};
