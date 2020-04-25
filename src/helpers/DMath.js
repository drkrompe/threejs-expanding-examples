const square = (value) => {
    return value * value;
};

const magnitude = (x, y) => {
    return Math.sqrt(square(x) + square(y));
};

const unitVector = (vector2d = { x: 0, y: 0 }) => {
    const mag = magnitude(vector2d.x, vector2d.y);
    if (mag === 0) {
        return {
            x: 0,
            y: 0
        };
    }
    return {
        x: vector2d.x / mag,
        y: vector2d.y / mag
    };
};

export default {
    square,
    magnitude,
    unitVector
};