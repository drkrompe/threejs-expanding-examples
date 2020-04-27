import Dilsprite from "../../Dilsprite";
import Unit from "../Unit";
import Actions from "../../actions/Actions";

export default class Building extends Unit {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        selectable = false,
        selectedIndicatorScale = { x: 0.5, y: 0.5 },
        selectedIndicatorOffset = { x: 0, y: 0 },
        faction = 0,
        health = 100,
        action = Actions.WAITING,
    ) {
        super(
            position2d,
            dilsprite,
            selectable,
            selectedIndicatorScale,
            selectedIndicatorOffset,
            faction,
            health,
            action
        );
    }

}