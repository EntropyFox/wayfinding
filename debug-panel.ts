export const DebugPanel = (() => {
    const debugDiv = document.getElementById('debug') as HTMLDivElement;
    const pResult = document.getElementById('result') as HTMLParagraphElement;
    const out1 = document.getElementById('out-1') as HTMLSpanElement;
    const out2 = document.getElementById('out-2') as HTMLSpanElement;
    const out3 = document.getElementById('out-3') as HTMLSpanElement;

    const elements = [pResult, out1];

    return {
        clear: () => elements.map(e => e.innerHTML = ''),
        setColor: (color: string) => debugDiv.style.color = color,
        out1: (output: string) => out1.innerText = output,
        out2: (output: string) => out2.innerText = output,
        out3: (output: string) => out3.innerText = output,
        updateResult: (result: string) => pResult.innerHTML = result
    }
})();