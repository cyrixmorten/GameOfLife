import { Cell } from './Cell';
import { Coordinate } from './Coordinate';
import { add } from 'lodash';

export type CellRecord = { [key: string]: Cell };

const keyOf = (coordinate: Coordinate) => {
    return `${coordinate.x},${coordinate.y}`;
}

export const addCell = (cell: Cell, cells: CellRecord) => {
    return cells[keyOf(cell.coordinate)] = cell;
};

export const cellAt = (coordinate: Coordinate, cells: CellRecord) => {
    return cells[keyOf(coordinate)] ?? addCell(new Cell(coordinate, false), cells);
};

export const createCellRecordFromBoard = (board: number[][]) => {
    const cells: CellRecord = {};
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                const coordinate = {
                    x: x,
                    y: y
                };
                cells[keyOf(coordinate)] = new Cell(coordinate);
            }
        }
    }

    return cells;
};


export const createCellRecordFromArray = (cellsArray: Cell[]) => {
    const cells: CellRecord = {};

    // TODO hardcoded board size
    for (let y = 0; y <= 4; y++) {
        for (let x = 0; x <= 4; x++) {
            addCell(new Cell({
                x: x,
                y: y
            }, false), cells)
        }
    }

    cellsArray.forEach((cell) => {
        cells[keyOf(cell.coordinate)] = cell;
    })

    return cells;
};

export interface BoardRenderOptions {
    check: (cell: Cell) => boolean;
    whenTrue: any;
    whenFalse: any;
}

export const createBoardFromCells = (cells: CellRecord, renderOptions: BoardRenderOptions): any[][] => {
    let lowestCoordinate: Coordinate = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
    let largestCoordinate: Coordinate = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};

    for (const cell of Object.values(cells)) {
        const {x, y} = cell.coordinate;
        const {x: lowestX, y: lowestY} = lowestCoordinate;
        const {x: largestX, y: largestY} = largestCoordinate;

        if (x < lowestX || y < lowestY) {
            lowestCoordinate = cell.coordinate
        }

        if (x > largestX || y > largestY) {
            largestCoordinate = cell.coordinate
        }
    }

    //const {x: lowestX, y: lowestY} = lowestCoordinate;
    //const {x: largestX, y: largestY} = largestCoordinate;

    //console.log('lowestCoordinate', lowestCoordinate);
    //console.log('largestCoordinate', largestCoordinate);

    const board: number[][] = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];

    const largestX = 4;
    const largestY = 4;

    // TODO hardcoded board size
    for (let y = 0; y <= largestY; y++) {
        for (let x = 0; x <= largestX; x++) {
            board[y][x] = renderOptions.check(cellAt({x, y}, cells)) ? renderOptions.whenTrue : renderOptions.whenFalse;
        }
    }

    return board;
};