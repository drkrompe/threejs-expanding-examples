import * as THREE from 'three';

export default class Sprite {

    constructor(indexedTexture, textureColumns, textureRows) {
        this._textureRows = textureRows;
        this._textureColumns = textureColumns;
        const texture = new THREE.TextureLoader().load(indexedTexture);
        this._texture_repeat_x_value = 1 / textureColumns;
        texture.repeat.x = this._texture_repeat_x_value;
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        });
        this.sprite = new THREE.Sprite(spriteMaterial);
    }

    setTextureInverse = (inverse) => {
        const inversionValue = inverse ? -1 : 1;
        this.sprite.material.map.repeat.x = inversionValue / this._textureColumns;
    }

    showTextureIndex = (column, row) => {
        this.sprite.material.map.offset.x = column / this._textureColumns;
    }

}