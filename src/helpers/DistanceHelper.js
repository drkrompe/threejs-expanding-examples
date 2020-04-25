import DMath from "./DMath";

const differenceOfPoints = (fromPoint, toPoint) => {
    return {
        x: toPoint.x - fromPoint.x,
        y: toPoint.y - fromPoint.y
    };
};

const distanceBetweenDils = (dil1, dil2) => {
    const diff = differenceOfPoints(dil1.position, dil2.position);
    const distance = Math.sqrt(DMath.square(diff.x) + DMath.square(diff.y));
    return distance;
};

const distanceBetweenPoints = (point1, point2) => {
    const diff = differenceOfPoints(point1, point2);
    const distance = Math.sqrt(DMath.square(diff.x) + DMath.square(diff.y));
    return distance;
};

const unitDirectionFromDilToDil = (fromDil, toDil) => {
    const diff = differenceOfPoints(fromDil.position, toDil.position);
    return DMath.unitVector({ x: diff.x, y: diff.y });
};

const unitDirectionFromPointToPoint = (fromPoint, toPoint) => {
    const diff = differenceOfPoints(fromPoint, toPoint);
    return DMath.unitVector({ x: diff.x, y: diff.y });
};

export default {
    differenceOfPoints,
    distanceBetweenDils,
    distanceBetweenPoints,
    unitDirectionFromDilToDil,
    unitDirectionFromPointToPoint,
};