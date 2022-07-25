import { Cell } from './Cell';
import { Coordinate } from './Coordinate';

export type CellRecord = { [key: string]: Cell };

export const toCellKey = (coordinate: Coordinate): string => {
    return `${coordinate.x},${coordinate.y}`;
}

export const cellAt = (coordinate: Coordinate, cells: CellRecord) => {
    return cells[toCellKey(coordinate)];
};

export const addCell = (cell: Cell, cells: CellRecord) => {
    return cells[toCellKey(cell.coordinate)] = cell;
}

export const createCellRecordFromArray = (cellsArray: Cell[]) => {
    return cellsArray.reduce((cells, cell) => {
        addCell(cell, cells);
        return cells;
    }, {});
};