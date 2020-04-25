import Dilsprite from "../../Dilsprite";
import Unit from "../Unit";

export default class Building extends Unit {
    constructor(
        position2d = { x: 0, y: 0 },
        dilsprite = new Dilsprite(),
        faction = 0,
        health = 100
    ) {
        super(position2d, dilsprite, faction, health);
    }

}