import { createCellRecordFromBoard } from './Utils';
import { GameOfLife } from './GameOfLife';

describe(GameOfLife.name, () => {
    describe('isCellAlive', () => {
        it('should be alive', () => {
            expect(new GameOfLife(
                createCellRecordFromBoard([
                    [1,0,0],
                    [0,0,0],
                    [0,0,0]
                ])
            ).isCellAlive({
                x: 0,
                y: 0
            })).toBeTruthy();
        });

        it('should not be alive', () => {
            expect(new GameOfLife(
                createCellRecordFromBoard([
                    [1,0,0],
                    [0,0,0],
                    [0,0,0]
                ])
            ).isCellAlive({
                x: 1,
                y: 0
            })).toBeFalsy();
        });
    });

    describe('neighbourCount', () => {
        it('should have 3 neighbours', () => {
            expect(new GameOfLife(
                createCellRecordFromBoard([
                    [0,1,0],
                    [1,1,0],
                    [0,0,0]
                ])
            ).neighbourCount({
                x: 0,
                y: 0
            })).toEqual(3)
        });

        it('should have 2 neighbours', () => {
            expect(new GameOfLife(
                createCellRecordFromBoard([
                    [0,1,0],
                    [1,1,0],
                    [0,0,0]
                ])
            ).neighbourCount({
                x: 1,
                y: 1
            })).toEqual(2)
        });

        it('should have 1 neighbours', () => {
            expect(new GameOfLife(
                createCellRecordFromBoard([
                    [0,1,0],
                    [1,1,0],
                    [0,0,0]
                ])
            ).neighbourCount({
                x: 2,
                y: 2
            })).toEqual(1)
        });
    });
});