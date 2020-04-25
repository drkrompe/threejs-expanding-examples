import DistanceHelper from "./DistanceHelper";
import Dilsprite from "../models/Dilsprite";

const moveDilTowardPoint = (dil = new Dilsprite(), toPoint = { x: 0, y: 0 }, deltaTime = 0, speed = 0) => {
    if (!dil || !toPoint || deltaTime === undefined || deltaTime === null || speed === undefined || speed === null) {
        console.error("Error: Unexpected Param is undefined or null", dil, toPoint, deltaTime, speed);
        return;
    }
    const distance = DistanceHelper.distanceBetweenPoints(dil.position, toPoint);
    if (distance <= speed * deltaTime) {
        dil.position.x = toPoint.x;
        dil.position.y = toPoint.y;
        return;
    }
    const unitDiff = DistanceHelper.unitDirectionFromPointToPoint(dil.position, toPoint);
    dil.position.x += unitDiff.x * speed * deltaTime;
    dil.position.y += unitDiff.y * speed * deltaTime;
};

export default {
    moveDilTowardPoint
};