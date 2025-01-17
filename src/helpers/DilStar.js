import DistanceHelper from "./DistanceHelper"
import Vec from "./Vec";

const worldUnitVecToGridUnitVec = (worldUnitDirection = { x: 0, y: 0 }) => {
    // Step 1.1: Normalize direction to grid direction
    // UnitY range from 0 to 1 = (UnitY + 1) / 2
    // 0 0.25 0.5 0.75 1
    //                 0.75
    //                 0.5
    //                 0.25
    //                 0
    const normedUnit = {
        x: (worldUnitDirection.x + 1) / 2,
        y: (worldUnitDirection.y + 1) / 2
    }

    // Step 1.2: Invert the Ys to match grid indicies
    // 0 0.25 0.5 0.75 1
    // 0.25
    // 0.5
    // 0.75
    // 1
    const invertedYNormedUnit = {
        x: normedUnit.x,
        y: 1 - normedUnit.y
    }

    return invertedYNormedUnit;
}

const worldUnitVecToGridLocation = (worldUnitDirection = { x: 0, y: 0 }, gridShape = 5) => {
    // Step 1.1: Normalize direction to grid direction
    // UnitY range from 0 to 1 = (UnitY + 1) / 2
    // 0 0.25 0.5 0.75 1
    //                 0.75
    //                 0.5
    //                 0.25
    //                 0
    const normedUnit = {
        x: (worldUnitDirection.x + 1) / 2,
        y: (worldUnitDirection.y + 1) / 2
    }
    const invertedXNormedUnit = {
        x: 1 - normedUnit.x,
        y: normedUnit.y
    };
    const gridX = Math.floor(invertedXNormedUnit.x * gridShape);
    const gridY = Math.floor(invertedXNormedUnit.y * gridShape);
    return Vec(
        gridX === gridShape ? gridShape - 1 : gridX,
        gridY === gridShape ? gridShape - 1 : gridY
    );
};



/** 
 * @param {Vec} from - {x,y} world coordinate 
 * @param {Vec} to - {x,y} world coordinate
 * @param {number} gridShape - square edge length
 * 
 * Put From and To Points on a square grid of shape width / height. Valid on Grid creation
 * 
 * NOTE: the to Position may not be where the to point is, but its general location at the opposite
 * side of the grid.
 * 
 * NOTE: From can become a Reference Location at creation of grid, if it also has world coordinate.
 */
const worldPositionsToGridPositions = (from = { x: 0, y: 0 }, to = { x: 0, y: 0 }, gridShape = 5) => {
    const unitDirection = DistanceHelper.unitDirectionFromPointToPoint(from, to);
    const fromPositionOnGrid = worldUnitVecToGridLocation(unitDirection, gridShape);
    const toPositionOnGrid = worldUnitVecToGridLocation(
        Vec(
            unitDirection.x * -1,
            unitDirection.y * -1
        ),
        gridShape
    );
    return {
        from: fromPositionOnGrid,
        to: toPositionOnGrid
    };
};

/**
 * @param {Vec} gridPosition - {x,y} position to convert 
 * @param {Vec} referenceGridPosistion - {x,y} reference point in grid coord
 * @param {Vec} referenceWorldPosition - {x,y} reference point in world coord
 * @param {number} ratioGridToWorld - ratio of GridUnits in a WorldUnit
 */
const gridPositionToWorldPosition = (
    gridPosition = { x: 0, y: 0 },
    referenceGridPosistion = { x: 0, y: 0 },
    referenceWorldPosition = { x: 0, y: 0 },
    ratioGridToWorld = 1
) => {
    const gridDifference = DistanceHelper.differenceOfPoints(referenceGridPosistion, gridPosition);

    //       5 Grid Unit
    //     ------
    //       1 World Unit

    const worldDifference = Vec(
        gridDifference.x / ratioGridToWorld,
        -gridDifference.y / ratioGridToWorld
    );
    const worldPosition = Vec(
        referenceWorldPosition.x + worldDifference.x,
        referenceWorldPosition.y + worldDifference.y
    );
    return worldPosition;
};

const targetWorldIsWithinGrid = (
    targetWorldPosition = { x: 0, y: 0 },
    referenceGridPosition = { x: 0, y: 0 },
    referenceWorldPosition = { x: 0, y: 0 },
    ratioGridToWorld = 1,
    gridShape = 5
) => {
    // Convert
    const worldDifference = DistanceHelper.differenceOfPoints(referenceWorldPosition, targetWorldPosition);

    //       5 Grid Unit
    //     ------
    //       1 World Unit

    const gridDifference = Vec(
        worldDifference.x * ratioGridToWorld,
        worldDifference.y * ratioGridToWorld
    );
    const gridPosition = Vec(
        referenceGridPosition.x + Math.floor(gridDifference.x),
        referenceGridPosition.y - Math.floor(gridDifference.y)
    );
    // Check
    if (gridPosition.x < 0 || gridPosition.x > (gridShape - 1)) {
        return false;
    }
    if (gridPosition.y < 0 || gridPosition.y > (gridShape - 1)) {
        return false;
    }
    else return gridPosition;
};

/**
 * 
 * @param {Vec} fromPositionWorld 
 * @param {Vec} toPositionWorld 
 * @param {number} gridShape 
 * @param {number} ratioGridToWorld 
 */
const getStartAndEndGridPositions = (fromPositionWorld = { x: 0, y: 0 }, toPositionWorld = { x: 0, y: 0 }, gridShape = 1, ratioGridToWorld = 1) => {
    const gridPositions = worldPositionsToGridPositions(fromPositionWorld, toPositionWorld, gridShape);
    const inGrid = targetWorldIsWithinGrid(toPositionWorld, gridPositions.from, fromPositionWorld, ratioGridToWorld, gridShape);
    if (inGrid) {
        gridPositions.to = inGrid;
    }
    return gridPositions;
}

export default {
    worldPositionsToGridPositions,
    worldUnitVecToGridUnitVec,
    worldUnitVecToGridLocation,
    gridPositionToWorldPosition,
    targetWorldIsWithinGrid,
    getStartAndEndGridPositions
};