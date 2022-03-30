export const getImageFromUrl = async (src: string): Promise<HTMLImageElement> => {
    const response = await fetch(src);
    const blob = await response.blob();
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    await new Promise(resolve =>
        image.addEventListener("load", resolve)
    );
    return image;
}

export const getImageDataFromImageElement = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
        alpha: false
    });

    /// Square tracking image

    
    if (image.height > image.width) {
        console.log('image height');
        canvas.width = image.height;
        canvas.height = image.height;
    }
    else if (image.height < image.width) {
        canvas.width = image.width;
        canvas.height = image.width;
    }
    else {
        // Already squared
        canvas.width = image.width;
        canvas.height = image.height;
    }

    // canvas.width = image.width;
    // canvas.height = image.height;
    // Make background white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw image in center
    context.drawImage(image, (canvas.width / 2) - (image.width / 2) , (canvas.height / 2) - (image.height / 2));

    // const testImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // const tt = document.getElementById('marker-image') as HTMLImageElement;
    // tt.src = testImage;
    // window.location.href=testImage; // it will save locally


    return context.getImageData(0, 0, canvas.width, canvas.height);
}

export const getImageDataFromUrl = async (src: string) => {
    const image = await getImageFromUrl(src);
    return getImageDataFromImageElement(image);
}
