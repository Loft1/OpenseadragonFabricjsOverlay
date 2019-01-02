export declare class OSDFabricOverlay {
    private static counter;
    private fabric;
    private readonly scale;
    private width;
    private height;
    private viewer;
    private canvasDiv;
    private canvas;
    private fabricCanvas;
    constructor(osdViewer: any, fabric: any, scale: number);
    clear(): void;
    resize(): void;
    resizecanvas(): void;
}
export default function openSeaDragonFabricOverlay(OpenSeadragon: any, fabric: any): void;
