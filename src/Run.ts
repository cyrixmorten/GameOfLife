import { GameOfLife } from './GameOfLife';
import { createBoardFromCellRecord, createCellRecordFromBoard } from './BoardUtils';


const startGame = () => {

    let blinker = new GameOfLife(createCellRecordFromBoard([
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
    ]));

    console.log('start', createBoardFromCellRecord(blinker.cells, {
        check: (c) => c && c.isAlive(),
        whenTrue: 'X',
        whenFalse: 'O'
    }));

    let tickCount = 0;
    const run = () => {
        blinker.tick(true);
        tickCount++


        console.log('tick', tickCount,  createBoardFromCellRecord(blinker.cells, {
            check: (c) => c && c.isAlive(),
            whenTrue: 1,
            whenFalse: 0
        }));

        setTimeout(() => {
            run();
        }, 1000);
    }

    //run();
}

startGame();