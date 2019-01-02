// OpenSeadragon canvas Overlay plugin 0.1.0 based on svg overlay plugin

//@ts-ignore
import * as OpenSeadragon from "openseadragon/openseadragon";

export class OSDFabricOverlay {

	private static counter = 0;

	private fabric: any;

	private readonly scale: number;
	private width: string;
	private height: string;
	private viewer: any;
	private canvasDiv: HTMLElement;
	private canvas: HTMLElement;
	public readonly fabricCanvas : any;

	constructor(osdViewer: any, fabric: any, scale: number) {

		if (scale === 0) {
			throw new Error("Illegal argument: Scale cannot be 0");
		}

		this.fabric = fabric;

		this.scale = scale;

		this.viewer = osdViewer;

		this.width = "0";
		this.height = "0";

		this.canvasDiv = document.createElement( 'div');
		this.canvasDiv.style.position = 'absolute';
		this.canvasDiv.style.left = "0";
		this.canvasDiv.style.top = "0";
		this.canvasDiv.style.width = '100%';
		this.canvasDiv.style.height = '100%';
		this.viewer.canvas.appendChild(this.canvasDiv);

		this.canvas = document.createElement('canvas');

		const id = 'osd-overlaycanvas-' + OSDFabricOverlay.counter++;
		this.canvas.setAttribute('id', id);
		this.canvasDiv.appendChild(this.canvas);
		this.resize();
		this.fabricCanvas = new fabric.Canvas(this.canvas);
		// disable fabric selection because default click is tracked by OSD
		this.fabricCanvas.selection=false;
		// prevent OSD click elements on fabric objects
		this.fabricCanvas.on('mouse:down', (options: any) => {
			if (options.target) {

				options.e.preventDefaultAction = true;
				options.e.preventDefault();
				options.e.stopPropagation();
			}
		});

		this.viewer.addHandler('update-viewport', () => {
			this.resize();
			this.resizecanvas();
		});

		this.viewer.addHandler('open', () => {
			this.resize();
			this.resizecanvas();
		});
	}

	clear() {
		this.fabricCanvas.clearAll();
	}

	resize() {
		if (this.width !== this.viewer.container.clientWidth) {
			this.width = this.viewer.container.clientWidth;
			this.canvasDiv.setAttribute('width', this.width);
			this.canvas.setAttribute('width', this.width);
		}

		if (this.height !== this.viewer.container.clientHeight) {
			this.height = this.viewer.container.clientHeight;
			this.canvasDiv.setAttribute('height', this.height);
			this.canvas.setAttribute('height', this.height);
		}
	}

	resizecanvas() {
		let origin = new OpenSeadragon.Point(0, 0);
		let viewportZoom = this.viewer.viewport.getZoom(true);
		this.fabricCanvas.setWidth(this.width);
		this.fabricCanvas.setHeight(this.height);
		let zoom = this.viewer.viewport._containerInnerSize.x * viewportZoom / this.scale;
		this.fabricCanvas.setZoom(zoom);
		let viewportWindowPoint = this.viewer.viewport.viewportToWindowCoordinates(origin);
		let x=Math.round(viewportWindowPoint.x);
		let y=Math.round(viewportWindowPoint.y);
		let canvasOffset=this.canvasDiv.getBoundingClientRect();
		let pageScroll = OpenSeadragon.getPageScroll();
		this.fabricCanvas.absolutePan(new this.fabric.Point(canvasOffset.left - x + pageScroll.x, canvasOffset.top - y + pageScroll.y));
	}
}

export default function openSeaDragonFabricOverlay( OpenSeadragon: any, fabric: any ) {

    /**
     * @param {Object} options
     *      Allows configurable properties to be entirely specified by passing
     *      an options object to the constructor.
     * @param {Number} options.scale
     *      Fabric 'virtual' canvas size, for creating objects
     **/
    OpenSeadragon.Viewer.prototype.fabricjsOverlay = function(options: {scale: number}) {
        this._fabricjsOverlayInfo = new OSDFabricOverlay(this, fabric, options.scale);

        return this._fabricjsOverlayInfo;
    };
}
