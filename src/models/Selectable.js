import * as THREE from 'three';
import Renderable from "./Renderable";
import Dilsprite from "./Dilsprite";

export default class Selectable extends Renderable {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 0.5, y: 0.5 },
        selectedIndicatorOffset = { x: 0, y: 0 }
    ) {
        super(position2d, dilsprite);

        this.selectable = selectable;
        this.selected = false;
        if (this.selectable) {
            const geom = new THREE.RingGeometry(1, 1.07, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            })
            this.selectedIndicator = new THREE.Mesh(geom, material);
            this.selectedIndicator.scale.x = selectedIndicatorScale.x;
            this.selectedIndicator.scale.y = selectedIndicatorScale.y;
            this.selectedIndicator.rotation.x = Math.PI / 2.5;
            this.selectedIndicator.position.x = selectedIndicatorOffset.x;
            this.selectedIndicator.position.y = selectedIndicatorOffset.y;
            this.selectedIndicator.position.z = -1;
            this.dilsprite.add(this.selectedIndicator);
        }
    }

    toggleUnitSelectedTo = (to = false) => {
        this.selected = to;
        this.selectedIndicator.material.opacity = to ? 1 : 0;
    }
}