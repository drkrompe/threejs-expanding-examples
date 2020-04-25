import Dilsprite from "./Dilsprite";

export default class Renderable {
    // Has Position
    // Has Renderable dilsprite

    constructor(position2d = { x: 0, y: 0 }, dilsprite = new Dilsprite()) {
        this.dilsprite = dilsprite;
        this.dilsprite.self = this;
        this.dilsprite.setPosition(position2d);
    }
}