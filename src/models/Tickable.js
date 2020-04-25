import Renderable from './Renderable';
import Selectable from './Selectable';
import Dilsprite from './Dilsprite';

export default class Tickable extends Selectable {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 1, y: 1 },
        selectedIndicatorOffset = { x: 0, y: 0 }
    ) {
        super(
            position2d,
            dilsprite,
            selectable,
            selectedIndicatorScale,
            selectedIndicatorOffset
        );
        this.onTickFuncs = [];
    }

    onTick(timeDelta) {
        this.dilsprite.animate(timeDelta);
        window.debug.debugOnTickFuncs && console.log(this.onTickFuncs);
        this.onTickFuncs.forEach(func => {
            func(timeDelta);
        });
    }
}