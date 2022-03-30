/**
 * This function creates another function that samples an image source
 */
const createReader = (input: Input) => {
    const { height, width, source } = input;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = height;
    canvas.width = width;
    return () => {
        context.drawImage(source, 0, 0);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    };
};

const loadImage = async (src: string): Promise<Input> => {
    const response = await fetch(src);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);

    return {
        height: image.height,
        width: image.width,
        source: image,
    };
};

export const ImageHandler = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = height;
    canvas.width = width;

    return {
        loadDataFromImage: async (src: string) =>
            createReader(await loadImage(src))(),
        getImageData: (source: CanvasImageSource) => {
            context.drawImage(source, 0, 0);
            return context.getImageData(0, 0, canvas.width, canvas.height);
        }
    };
};

export interface Input {
    height: number;
    width: number;
    source: CanvasImageSource;
}
