// OpenSeadragon canvas Overlay plugin 0.1.0 based on svg overlay plugin

export class OSDFabricOverlay {

	private static counter = 0;
	public readonly fabricCanvas: any;

	private fabric: any;

	private readonly scale: number;
	private width: string;
	private height: string;
	private viewer: any;
	private canvasDiv: HTMLElement;
	private canvas: HTMLElement;
	private readonly openSeadragon: any;

	constructor(osd: any, osdViewer: any, fabric: any, scale: number) {

		if (scale === 0) {
			throw new Error("Illegal argument: Scale cannot be 0");
		}

		this.openSeadragon = osd;

		this.fabric = fabric;

		this.scale = scale;

		this.viewer = osdViewer;

		this.width = "0";
		this.height = "0";

		this.canvasDiv = document.createElement( "div");
		this.canvasDiv.style.position = "absolute";
		this.canvasDiv.style.left = "0";
		this.canvasDiv.style.top = "0";
		this.canvasDiv.style.width = "100%";
		this.canvasDiv.style.height = "100%";
		this.viewer.canvas.appendChild(this.canvasDiv);

		this.canvas = document.createElement("canvas");

		const id = "osd-overlaycanvas-" + OSDFabricOverlay.counter++;
		this.canvas.setAttribute("id", id);
		this.canvasDiv.appendChild(this.canvas);
		this.resize();
		this.fabricCanvas = new fabric.Canvas(this.canvas);
		// disable fabric selection because default click is tracked by OSD
		this.fabricCanvas.selection = false;
		// prevent OSD click elements on fabric objects
		this.fabricCanvas.on("mouse:down", (options: any) => {
			if (options.target) {

				options.e.preventDefaultAction = true;
				options.e.preventDefault();
				options.e.stopPropagation();
			}
		});

		this.viewer.addHandler("update-viewport", () => {
			this.resize();
			this.resizecanvas();
		});

		this.viewer.addHandler("open", () => {
			this.resize();
			this.resizecanvas();
		});
	}

	public clear() {
		this.fabricCanvas.clearAll();
	}

	public resize() {
		if (this.width !== this.viewer.container.clientWidth) {
			this.width = this.viewer.container.clientWidth;
			this.canvasDiv.setAttribute("width", this.width);
			this.canvas.setAttribute("width", this.width);
		}

		if (this.height !== this.viewer.container.clientHeight) {
			this.height = this.viewer.container.clientHeight;
			this.canvasDiv.setAttribute("height", this.height);
			this.canvas.setAttribute("height", this.height);
		}
	}

	public resizecanvas() {
		const origin = new this.openSeadragon.Point(0, 0);
		const viewportZoom = this.viewer.viewport.getZoom(true);
		if (this.width !== this.fabricCanvas.getWidth()) {
			this.fabricCanvas.setWidth(this.width);
		}
		if (this.height !== this.fabricCanvas.getHeight()) {
			this.fabricCanvas.setHeight(this.height);
		}
		const zoom = this.viewer.viewport._containerInnerSize.x
				* viewportZoom / this.scale;
		this.fabricCanvas.setZoom(zoom);
		const viewportWindowPoint = this.viewer.viewport
				.viewportToWindowCoordinates(origin);
		const x = Math.round(viewportWindowPoint.x);
		const y = Math.round(viewportWindowPoint.y);
		const canvasOffset = this.canvasDiv.getBoundingClientRect();
		const pageScroll = this.openSeadragon.getPageScroll();
		this.fabricCanvas.absolutePan(new this.fabric.Point(
				canvasOffset.left - x + pageScroll.x,
				canvasOffset.top - y + pageScroll.y));
	}
}

export default function openSeaDragonFabricOverlay( osd: any, fabric: any ) {

		/**
		 * @param {Object} options
		 * 		Allows configurable properties to be entirely specified by passing
		 * 		an options object to the constructor.
		 * @param {Number} options.scale
		 * 		Fabric 'virtual' canvas size, for creating objects
		 **/
		osd.Viewer.prototype.fabricjsOverlay = function(options: {scale: number}) {
				this._fabricjsOverlayInfo = new OSDFabricOverlay(
					osd,
					this,
					fabric,
					options.scale);

				return this._fabricjsOverlayInfo;
		};
}
