import DilSprite from "../../6-selection-movement/DilSprite";

export default class Unit {

    constructor(unitTexture, unitTextureColumns = 1, unitTextureRows = 1, unitName = 'unit', selectable = false) {
        this.dilsprite = new DilSprite(
            unitTexture,
            unitTextureColumns,
            unitTextureRows,
            unitName,
            selectable
        );
        this.selectable = selectable;
        this.dilsprite.sprite3dObject.self = this;
    }

    onTick = (timeDelta) => {
        window.debug && console.log("UNIT onTick");
    }

}