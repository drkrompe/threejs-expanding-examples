import * as THREE from 'three';
import Unknown from '../textures/unknown/Unknown.png';
import { DilActionAnimation } from './dilactionanimation/DilActionAnimation';

export default class Dilsprite extends THREE.Sprite {
    constructor(
        indexedTexture = Unknown,
        indexedTextureColumns = 1,
        indexedTextureRows = 1,
        dilActionAnimation = new DilActionAnimation({ columns: 1, rows: 1 }, 0, 0, 50),
    ) {
        // Load Texture
        const texture = new THREE.TextureLoader().load(indexedTexture);
        texture.repeat.x = 1 / indexedTextureColumns; // set texture width to subset of loaded texture
        texture.repeat.y = 1 / indexedTextureRows; // set texture height to be subset of loaded texture
        // Apply texture to Material
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        });
        // Create THREE scene appendable object as this
        super(spriteMaterial);

        // Store dilsprite data
        this.dilspriteData = {
            indexedTextureColumns: indexedTextureColumns,
            indexedTextureRows: indexedTextureRows,
            textureColumn: 0,
            textureRow: 0,
            textureInversionSettings: {
                xInversed: false,
                yInversed: false
            }
        };

        // DilActionAnimation
        this.dilActionAnimation = dilActionAnimation;
    }

    animate = (timeDelta) => {
        // console.log("animate", timeDelta, this.dilspriteData.textureInversionSettings)
        this.dilActionAnimation.animate(timeDelta);
        const textureCoordinate = this.dilActionAnimation.currentIndexTextureCoordinate(this.dilspriteData.textureInversionSettings);
        this.setTextureIndex(textureCoordinate);
    }

    setTextureIndex = (textureIndex = { x: 0, y: 0 }) => {
        this.material.map.offset.x = textureIndex.x;
        this.material.map.offset.y = textureIndex.y;
    }

    invertTexture = (invertTexture = { x: 1, y: 1 }) => {
        // Check if Inversion needs to be changed
        if ((this.dilspriteData.textureInversionSettings.xInversed) === (invertTexture.x < 0) && this.dilspriteData.textureInversionSettings.yInversed === (invertTexture.y < 0)) {
            return;
        }

        this.material.map.repeat.x = invertTexture.x / this.dilspriteData.indexedTextureColumns;
        this.material.map.repeat.y = invertTexture.y / this.dilspriteData.indexedTextureRows;
        if (invertTexture.x < 0) {
            this.material.map.offset.x = -invertTexture.x / this.dilspriteData.indexedTextureColumns;
        }
        if (invertTexture.y < 0) {
            this.material.map.offset.y = -invertTexture.y / this.dilspriteData.indexedTextureRows;
        }
        this.dilspriteData.textureInversionSettings = {
            xInversed: invertTexture.x < 0,
            yInversed: invertTexture.y < 0
        }
    }

    setPosition = (position2d = { x: 0, y: 0 }) => {
        this.position.x = position2d.x;
        this.position.y = position2d.y;
        if (position2d.z) {
            this.position.z = position2d.z;
        }
    }
}