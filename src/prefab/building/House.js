import Building from "../../models/unit/buildings/Building";
import Dilsprite from "../../models/Dilsprite";
import HouseTexture from '../../textures/house/House.png';
import { DilActionAnimation } from "../../models/dilactionanimation/DilActionAnimation";
import Vec from "../../helpers/Vec";
import Actions from "../../models/actions/Actions";

export default class House extends Building {
    constructor(
        position2d = { x: 0, y: 0 },
        selectable = false,
        faction = 0,
    ) {
        const houseActionAnimation = new DilActionAnimation({ rows: 1, columns: 4 }, 0, 1, 1);
        const dilsprite = new Dilsprite(HouseTexture, 4, 1, houseActionAnimation);
        super(
            position2d,
            dilsprite,
            selectable,
            Vec(0.7, 0.5),
            Vec(0, -0.44),
            faction,
            100,
            Actions.WAITING
        );
    }
}