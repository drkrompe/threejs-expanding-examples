import DilSprite from "./DilSprite";
import Zerglite from "./Zerglite.png";
import MovementHelper from '../../helpers/MovementHelper';

export default class Zerg {
    constructor(size = 0.25) {
        this.sprite = new DilSprite(
            Zerglite,
            10,
            1
        );
        this.changeFrameTime = 0.18;
        this.timeToNextTextureFrame = this.changeFrameTime;
        this.offset = 0;

        this.zergSpeed = 1

        this.sprite.sprite3dObject.scale.x = size - 0.05
        this.sprite.sprite3dObject.scale.y = size
    }

    onTick = (timeDelta) => {
        if (this.targetLocation) {
            this.movementData = MovementHelper.moveToward(
                this.sprite.sprite3dObject.position,
                this.targetLocation,
                timeDelta,
                this.zergSpeed
            );
        }
        this._updateTexture(timeDelta);
    };

    _updateTexture = (timeDelta) => {
        this.timeToNextTextureFrame -= timeDelta;
        if (this.timeToNextTextureFrame <= 0) {
            if (this.movementData && this.movementData.moving === 'left') {
                this.sprite.setTextureInverse(true);
                this.sprite.showTextureIndex(4 - (this.offset++ % 4), 0)
            } else {
                this.sprite.setTextureInverse(false);
                this.sprite.showTextureIndex((this.offset++ % 4), 0)
            }
            this.timeToNextTextureFrame = this.changeFrameTime;
        }
    }
}