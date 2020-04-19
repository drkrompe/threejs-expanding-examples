import * as THREE from 'three';

export default class DilSprite {

    constructor(indexedTexture, textureColumns, textureRows, name = 'dilsprite', hasIndicator = true) {
        this._textureRows = textureRows;
        this._textureColumns = textureColumns;
        const texture = new THREE.TextureLoader().load(indexedTexture);
        texture.repeat.x = 1 / textureColumns

        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        });
        this.sprite3dObject = new THREE.Sprite(spriteMaterial);
        this.sprite3dObject.name = name;

        if (hasIndicator) {
            const geom = new THREE.RingGeometry(1, 1.07, 10);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0
            })
            this.indicatorMesh = new THREE.Mesh(geom, material);
            this.indicatorMesh.scale.x = 0.5
            this.indicatorMesh.scale.y = 0.5
            this.indicatorMesh.rotation.x = Math.PI / 2.5
            this.indicatorMesh.position.y = -0.25
            this.indicatorMesh.position.z = -1
            this.indicatorMesh.parent = this.sprite3dObject
            this.sprite3dObject.add(this.indicatorMesh)
        }
    }

    showTextureIndex(column, row) {
        this.sprite3dObject.material.map.offset.x = column / this._textureColumns;
    }

    setTextureInverse = (inverse) => {
        const inversionValue = inverse ? -1 : 1;
        this.sprite3dObject.material.map.repeat.x = inversionValue / this._textureColumns;
    }

    toggleIndicatorOpacity = (on = true) => {
        const to = on ? 1 : 0
        this.indicatorMesh.material.opacity = to;
    }

}