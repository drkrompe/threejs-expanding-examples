import DilSprite from "../../6-selection-movement-attack/DilSprite";

export default class Unit {

    constructor(
        unitTexture,
        unitTextureColumns = 1,
        unitTextureRows = 1,
        unitName = 'unit',
        selectable = false,
        selectionIndicatorYOffset = -0.25
    ) {
        this.dilsprite = new DilSprite(
            unitTexture,
            unitTextureColumns,
            unitTextureRows,
            unitName,
            selectable,
            selectionIndicatorYOffset
        );
        this.selectable = selectable;
        this.dilsprite.sprite3dObject.self = this;
    }

    onTick = (timeDelta) => {
        window.debug && console.log("UNIT onTick");
    }

}