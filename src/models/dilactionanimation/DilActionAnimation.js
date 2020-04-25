export class DilActionAnimation {

    // Given: IndexedTexture has properties
    /**      0   1
     *  0  | 0 | 1 | 
     *  1  | 2 | 3 |
     */
    // Track a time
    constructor(
        textureShape = { rows: 1, columns: 1 },
        startIndex = 0,
        endIndex = 0,
        animationTime = 50,
    ) {
        this._textureShape = textureShape;
        this._startIndex = startIndex;
        this._endIndex = endIndex;
        this._currentAnimationIndex = this._startIndex;

        this._animationTime = animationTime;

        const numberOfFrames = (endIndex - startIndex) + 1
        const frameTimeMax = animationTime / numberOfFrames;

        this._animationData = {
            frameTimeMax,
            frameTime: frameTimeMax
        };
    }

    _indexToCoordinate = (index = 0) => {
        const x = (index % this._textureShape.columns) / this._textureShape.columns; // Which column
        const y = Math.floor(index / this._textureShape.columns) / this._textureShape.rows; // Which row
        return { x, y };
    }

    currentIndexTextureCoordinate = (textureInversionSettings = { xInversed: false, yInversed: false }) => {
        const textureCoodinates = this._indexToCoordinate(this._currentAnimationIndex);
        if (textureInversionSettings.xInversed) {
            textureCoodinates.x += (1 / this._textureShape.columns);
        }
        if (textureInversionSettings.yInversed) {
            textureCoodinates.y += (1 / this._textureShape.rows);
        }
        return textureCoodinates;
    }

    animate = (timeDelta) => {
        this._animationData.frameTime -= timeDelta;
        if (this._animationData.frameTime <= 0) {
            this._calcAndIncrementNextFrame();
            this._animationData.frameTime = this._animationData.frameTimeMax
        }
    }

    _calcAndIncrementNextFrame = () => {
        this._currentAnimationIndex++;
        if (this._currentAnimationIndex > this._endIndex) {
            this._currentAnimationIndex = this._startIndex;
        }
    }

    resetAnimation = () => {
        this._animationData.frameTime = this._animationData.frameTimeMax;
        this._currentAnimationIndex = this._startIndex;
    }
}