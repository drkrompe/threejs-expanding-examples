import * as THREE from 'three';

export default class DilSprite {

    constructor(indexedTexture, textureColumns, textureRows, name = 'dilsprite') {
        this._textureRows = textureRows;
        this._textureColumns = textureColumns;
        const texture = new THREE.TextureLoader().load(indexedTexture);
        texture.repeat.x = 1 / textureColumns

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        });
        this.sprite3dObject = new THREE.Sprite(spriteMaterial);
        this.sprite3dObject.name = name;
    }

    showTextureIndex(column, row) {
        this.sprite3dObject.material.map.offset.x = column / this._textureColumns;
    }

    setTextureInverse = (inverse) => {
        const inversionValue = inverse ? -1 : 1;
        this.sprite3dObject.material.map.repeat.x = inversionValue / this._textureColumns;
    }

}