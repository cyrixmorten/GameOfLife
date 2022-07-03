import { createBoardFromCells, createCellRecordFromBoard } from './Utils';
import { GameOfLife } from './GameOfLife';


const startGame = () => {

    let blinker = new GameOfLife(createCellRecordFromBoard([
        [0,0,0,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,0,0,0]
    ]));


    console.log('start', createBoardFromCells(blinker.cells, {
        check: (c) => c && c.isAlive(),
        whenTrue: 'X',
        whenFalse: 'O'
    }));

    let tickCount = 0;
    const run = () => {
        blinker.tick(true);
        tickCount++


        console.log('tick', tickCount,  createBoardFromCells(blinker.cells, {
            check: (c) => c && c.isAlive(),
            whenTrue: 1,
            whenFalse: 0
        }));

        setTimeout(() => {
            run();
        }, 1000);
    }

    run();
}

startGame();