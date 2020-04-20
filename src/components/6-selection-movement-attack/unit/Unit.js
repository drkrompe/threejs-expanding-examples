import DilSprite from "../../6-selection-movement-attack/DilSprite";

export default class Unit {

    constructor(
        unitTexture,
        unitTextureColumns = 1,
        unitTextureRows = 1,
        unitName = 'unit',
        selectable = false,
        selectionIndicatorYOffset = -0.25,
        team = 0
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
        this.className = 'Unit';
        this.team = team;
    }

    onTick = (timeDelta) => {
        window.debug && console.log("UNIT onTick");
    }

}