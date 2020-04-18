const moveToward = (currentPosition, targetPosition, delta, speed) => {
    const xDiff = targetPosition.x - currentPosition.x;
    const yDiff = targetPosition.y - currentPosition.y;

    const distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))

    const denom = (Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)));
    const unitX = Math.abs(xDiff / denom)
    const unitY = Math.abs(yDiff / denom)

    const willRet = {
        moving: 'right'
    }

    if (distance <= speed * delta) {
        currentPosition.x = targetPosition.x;
        currentPosition.y = targetPosition.y;
        return willRet;
    }

    if (xDiff > 0) {
        currentPosition.x += (unitX * speed * delta)
    } else {
        willRet.moving = 'left'
        currentPosition.x -= (unitX * speed * delta)
    }

    if (yDiff > 0) {
        currentPosition.y += (unitY * speed * delta)
    } else {
        currentPosition.y -= (unitY * speed * delta)
    }

    return willRet;
}

export default {
    moveToward
};