// OpenSeadragon canvas Overlay plugin 0.1.0 based on svg overlay plugin
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "openseadragon/openseadragon"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //@ts-ignore
    const OpenSeadragon = __importStar(require("openseadragon/openseadragon"));
    class OSDFabricOverlay {
        constructor(osdViewer, fabric, scale) {
            if (scale === 0) {
                throw new Error("Illegal argument: Scale cannot be 0");
            }
            this.fabric = fabric;
            this.scale = scale;
            this.viewer = osdViewer;
            this.width = "0";
            this.height = "0";
            this.canvasDiv = document.createElement('div');
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
            this.fabricCanvas.selection = false;
            // prevent OSD click elements on fabric objects
            this.fabricCanvas.on('mouse:down', (options) => {
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
            let x = Math.round(viewportWindowPoint.x);
            let y = Math.round(viewportWindowPoint.y);
            let canvasOffset = this.canvasDiv.getBoundingClientRect();
            let pageScroll = OpenSeadragon.getPageScroll();
            this.fabricCanvas.absolutePan(new this.fabric.Point(canvasOffset.left - x + pageScroll.x, canvasOffset.top - y + pageScroll.y));
        }
    }
    OSDFabricOverlay.counter = 0;
    exports.OSDFabricOverlay = OSDFabricOverlay;
    function openSeaDragonFabricOverlay(OpenSeadragon, fabric) {
        /**
         * @param {Object} options
         *      Allows configurable properties to be entirely specified by passing
         *      an options object to the constructor.
         * @param {Number} options.scale
         *      Fabric 'virtual' canvas size, for creating objects
         **/
        OpenSeadragon.Viewer.prototype.fabricjsOverlay = function (options) {
            this._fabricjsOverlayInfo = new OSDFabricOverlay(this, fabric, options.scale);
            return this._fabricjsOverlayInfo;
        };
    }
    exports.default = openSeaDragonFabricOverlay;
});
