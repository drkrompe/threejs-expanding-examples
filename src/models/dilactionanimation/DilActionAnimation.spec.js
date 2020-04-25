import { DilActionAnimation } from "./DilActionAnimation";

describe('AnimationAction', () => {

    describe('_indexToCoordinate', () => {
        let dilActionAnimation;
        const setup = (rows, columns) => {
            dilActionAnimation = new DilActionAnimation(
                { rows, columns },
                0, 3,
                50
            );
        };

        it('when passed index, then will map to texture coordinate', () => {
            setup(3, 3);
            const expected = { x: 2/3, y: 2/3 };
            expect(dilActionAnimation._indexToCoordinate(8)).toEqual(expected);
        });

        it('when passed middle index, then will map to correct texture coordinate', () => {
            setup(3, 3);
            const expected = { x: 1/3, y: 1/3 };
            expect(dilActionAnimation._indexToCoordinate(4)).toEqual(expected);
        });

        it('when passed non-square shape, then will map to correct texture coordinate', () => {
            setup(4, 3);
            const expected = { x: 0/4, y: 3/4 };
            expect(dilActionAnimation._indexToCoordinate(9)).toEqual(expected);
        });

    });

    describe('animate', () => {
        let dilActionAnimation;
        const setup = (animationTime) => {
            dilActionAnimation = new DilActionAnimation(
                { rows: 2, columns: 2 },
                0, 3,
                animationTime
            );
        };

        it('when called with time less than frame time, then currentIndexTextureCoordinate will not change', () => {
            setup(200);
            expect(dilActionAnimation.currentIndexTextureCoordinate()).toEqual({ x: 0, y: 0 });
            dilActionAnimation.animate(25);
            expect(dilActionAnimation.currentIndexTextureCoordinate()).toEqual({ x: 0, y: 0 });
        });

        it('when called with time greater than frame time, then currentIndexTextureCoordinate will increment', () => {
            setup(200);
            expect(dilActionAnimation.currentIndexTextureCoordinate()).toEqual({ x: 0, y: 0 });
            dilActionAnimation.animate(50);
            expect(dilActionAnimation.currentIndexTextureCoordinate()).toEqual({ x: 1/2, y: 0 });
        });
    });

})