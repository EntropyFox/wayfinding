export const CanvasElement = (size: Size) => {
    console.log('size: ', size);
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d', {
        alpha: false
    });

    return {
        getElement: (): HTMLCanvasElement => canvas,
        getConext: (): CanvasRenderingContext2D => context,
        draw: (element: HTMLVideoElement | HTMLImageElement) => {
            let width = (element instanceof HTMLVideoElement) ? element.videoWidth : element.width;
            let height = (element instanceof HTMLVideoElement) ? element.videoHeight : element.height;
            context.drawImage(element, 0, 0, width, height);
        },
        // drawVideo: (video: HTMLVideoElement) => context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight),
        // drawImage: (image: HTMLImageElement) => context.drawImage(image, 0, 0, image.width, image.height),
        getImageData: (whPx = 0): ImageData => context.getImageData(0, whPx, canvas.width, canvas.height - whPx),
        // getImageData: (): ImageData => context.imageDa
        destroy: () => canvas.parentElement.removeChild(canvas)
    };
}

export type CanvasElement = ReturnType<typeof CanvasElement>;