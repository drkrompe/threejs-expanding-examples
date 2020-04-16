import * as THREE from 'three';

export default class Sprite {

    constructor(indexedTexture, textureColumns, textureRows) {
        this._textureRows = textureRows;
        this._textureColumns = textureColumns;
        const texture = new THREE.TextureLoader().load(indexedTexture);
        texture.repeat.x = 1 / textureColumns
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        });
        this.sprite = new THREE.Sprite(spriteMaterial);
    }

    showTextureIndex(column, row) {
        this.sprite.material.map.offset.x = column / this._textureColumns;
    }

}