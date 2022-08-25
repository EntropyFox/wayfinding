import { showElements, hideElements } from '../viewer.utils';

export const openModal = (function () {
    return {
        show: (message: string) => {
            const modalText = <HTMLElement>(
                document.querySelector('#modal-text')
            );
            modalText.innerHTML = message;
            showElements(['#modal']);
        },
        hide: () => {
            hideElements(['#modal']);
        },
    };
})();

export const screenshotModal = (function () {
    return {
        show: (screenshotUrl: string) => {
            const screenshot = <HTMLImageElement>(
                document.querySelector('#screenshot')
            );
            screenshot.src = screenshotUrl;
            showElements(['#screenshot-modal', '#screenshot-text-container']);
        },
        hide: () => {
            hideElements(['#screenshot-modal', '#screenshot-text-container']);
        },
    };
})();
