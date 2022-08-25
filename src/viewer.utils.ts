export const showElements = (selectors: string[]) => {
    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            (<HTMLElement>element).classList.remove('hidden');
        });
    });
};

export const hideElements = (selectors: string[]) => {
    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            (<HTMLElement>element).classList.add('hidden');
        });
    });
};

export const removeAllChildren = (elm: HTMLElement) => {
    [...elm.childNodes].map(removeAllChildren);
    elm.parentElement.removeChild(elm);
};
