import DilStar from "./DilStar";
import Vec from "./Vec";
import DistanceHelper from "./DistanceHelper";

describe('dilstar', () => {

    describe('worldUnitToGridUnit', () => {
        it('Due East', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(0, 0), Vec(1, 0));
            const gridUnitDirection = DilStar.worldUnitVecToGridUnitVec(worldUnitDirection);
            expect(gridUnitDirection).toEqual(Vec(1, 0.5));
        });

        it('Due North East', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(0, 0), Vec(1, 1));
            const gridUnitDirection = DilStar.worldUnitVecToGridUnitVec(worldUnitDirection);
            expect(gridUnitDirection).toEqual({ x: 0.8535533905932737, y: 0.14644660940672627 });
        });
    });

    describe('worldUnitToGridLocation', () => {
        it('Due East', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(0, 0), Vec(1, 0));
            const gridLocation = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);
            expect(gridLocation).toEqual(Vec(0, 2));
        });

        it('Due West', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(1, 0), Vec(0, 0));
            const gridLocation = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);
            expect(gridLocation).toEqual(Vec(4, 2));
        });

        it('Due North', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(0, 0), Vec(0, 1));
            const gridLocation = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);
            expect(gridLocation).toEqual(Vec(2, 4));
        });

        it('Due South', () => {
            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(Vec(0, 1), Vec(0, 0));
            const gridLocation = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);
            expect(gridLocation).toEqual(Vec(2, 0));
        });
    });

    describe('positionConversion', () => {
        it('Due East 1 world unit', () => {
            const fromWorld = Vec(0, 0);
            const toWorld = Vec(1, 0);

            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(fromWorld, toWorld);
            const gridLocationReference = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);

            const targetOnGrid = DilStar.targetWorldIsWithinGrid(
                toWorld,
                gridLocationReference,
                fromWorld,
                5,
                6
            )

            expect(!!targetOnGrid).toBe(true)
            expect(targetOnGrid).toEqual(Vec(5, 2))

            const targetGridToWorld = DilStar.gridPositionToWorldPosition(
                targetOnGrid,
                gridLocationReference,
                fromWorld,
                5
            );
            expect(targetGridToWorld).toEqual(toWorld);
        });

        it('Due East 0.5 world unit', () => {
            const fromWorld = Vec(0, 0);
            const toWorld = Vec(0.5, 0);

            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(fromWorld, toWorld);
            const gridLocationReference = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);

            const targetOnGrid = DilStar.targetWorldIsWithinGrid(
                toWorld,
                gridLocationReference,
                fromWorld,
                5,
                6
            )

            expect(!!targetOnGrid).toBe(true)
            expect(targetOnGrid).toEqual(Vec(2, 2))

            const targetGridToWorld = DilStar.gridPositionToWorldPosition(
                targetOnGrid,
                gridLocationReference,
                fromWorld,
                5
            );
            expect(targetGridToWorld).toEqual(
                Vec(
                    0.4,
                    0
                )
            );
        });

        it('Due North 1 world unit', () => {
            const fromWorld = Vec(0, 0);
            const toWorld = Vec(0, 1);

            const worldUnitDirection = DistanceHelper.unitDirectionFromPointToPoint(fromWorld, toWorld);
            const gridLocationReference = DilStar.worldUnitVecToGridLocation(worldUnitDirection, 5);

            console.log(gridLocationReference)

            const targetOnGrid = DilStar.targetWorldIsWithinGrid(
                toWorld,
                gridLocationReference,
                fromWorld,
                5,
                5
            );

            expect(!!targetOnGrid).toBe(true);
            expect(targetOnGrid).toEqual(Vec(2, 0))

            const targetGridToWorld = DilStar.gridPositionToWorldPosition(
                targetOnGrid,
                gridLocationReference,
                fromWorld,
                5
            );
            expect(targetGridToWorld).toEqual(
                Vec(
                    0,
                    0.8
                )
            );
        })
    });


});