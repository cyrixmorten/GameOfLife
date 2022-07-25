import { Cell } from './Cell';
import { Coordinate } from './Coordinate';
import { addCell, cellAt, CellRecord, createCellRecordFromArray } from './CellUtils';
import * as _ from 'lodash';
import { mergeCoordinates } from './CoordinateUtils';

const BOARD_PADDING = 1;

export interface BoardRenderOptions {
    check: (cell: Cell) => boolean;
    whenTrue: any;
    whenFalse: any;
    whenNone: any;
    write: (cell: Cell) => string;
}

const findLowestCoordinates = (cells: CellRecord): Coordinate => {
    let lowestX = Number.MAX_VALUE;
    let lowestY = Number.MAX_VALUE;

    for (const cell of Object.values(cells)) {
        const {x, y} = cell.coordinate;
        if (x < lowestX) {
            lowestX = x;
        }
        if (y < lowestY) {
            lowestY = y;
        }
    }

    return {
        x: lowestX,
        y: lowestY
    }
}

const findLargestCoordinates = (cells: CellRecord): Coordinate => {
    let largestX = -Number.MAX_VALUE;
    let largestY = -Number.MAX_VALUE;

    for (const cell of Object.values(cells)) {
        const {x, y} = cell.coordinate;
        if (x > largestX) {
            largestX = x;
        }
        if (y > largestY) {
            largestY = y;
        }
    }

    return {
        x: largestX,
        y: largestY
    }
}

const transposeIntoView = (cells: CellRecord) => {
    const {x: lowestX, y: lowestY} = findLowestCoordinates(cells);

    const diffCoordinate = {
        x: lowestX < 0 ? Math.abs(lowestX) : lowestX === 0 ? BOARD_PADDING : 0,
        y: lowestY < 0 ? Math.abs(lowestY) : lowestY === 0 ? BOARD_PADDING: 0
    }

    console.log('diffCoordinate', diffCoordinate);

    return Object.values(cells).map((cell) => {
        cell.coordinate = mergeCoordinates(cell.coordinate, diffCoordinate);
        return cell;
    });
}

const createEmptyBoard = (largestCoordinate: Coordinate, writeToCells: string = 'X'): any[][] => {
    const {x: largestX, y: largestY} = largestCoordinate;

    const largestXWithPadding = largestX + BOARD_PADDING;
    const largestYWithPadding = largestY + BOARD_PADDING;

    const board = new Array(largestYWithPadding + 1).fill(new Array(largestXWithPadding + 1));

    for (let y = 0; y <= largestYWithPadding; y++) {
        for (let x = 0; x <= largestXWithPadding; x++) {
            board[y][x] = writeToCells
        }
    }
    return board;
}

export const createBoardFromCellRecord = (cells: CellRecord, renderOptions: Partial<BoardRenderOptions>): any[][] => {

    cells = _.cloneDeep(cells);

    const transposed = transposeIntoView(cells);
    console.log('transposed', transposed);

    const transposedCells = createCellRecordFromArray(transposed);
    console.log('transposedCells', transposedCells);

    const largestCoordinate = findLargestCoordinates(transposedCells);
    console.log('largestCoordinate', largestCoordinate);

    const board: any[][] = createEmptyBoard(largestCoordinate)

    console.log('empty board', board);

    for (let y = 0; y <= largestCoordinate.y; y++) {
        for (let x = 0; x <= largestCoordinate.x; x++) {
            const cell = cellAt({x, y}, transposedCells);

            if (cell) {
                if (typeof renderOptions.check === 'function') {
                    board[y][x] = renderOptions.check(cell) ? renderOptions.whenTrue : renderOptions.whenFalse;
                }

                if (typeof renderOptions.write === 'function') {
                    board[y][x] = renderOptions.write(cell);
                }
            }
        }
    }

    console.log('board', board);

    return board;
};

export const createCellRecordFromBoard = (board: number[][]) => {
    const cells: CellRecord = {};
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                addCell(new Cell({
                    x: x,
                    y: y
                }), cells);
            }
        }
    }

    return cells;
};