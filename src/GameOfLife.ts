import { Cell } from './Cell';
import { Coordinate } from './Coordinate';
import { cellAt, CellRecord, createBoardFromCells, createCellRecordFromArray } from './Utils';
import * as _ from 'lodash';

export class GameOfLife {

    constructor(public readonly cells: CellRecord = {}) {}

    tick(showVerdict: boolean) : Cell[] {
        const cellsWithNeighbours = Object.values(this.cells).map((cell) => this.cellWithNeighbours(cell.coordinate)).flat(2);

        const uniqueCellsWithNeighbours = _.uniqWith(cellsWithNeighbours, (cellA, cellB) => {
            return _.isEqual(cellA.coordinate, cellB.coordinate);
        });

        // TODO fix cell count increase per tick
        console.log('cellsWithNeighbours.length', cellsWithNeighbours.length);
        console.log('uniqueCellsWithNeighbours.length', uniqueCellsWithNeighbours.length);

        const shouldSurvive: Cell[] = uniqueCellsWithNeighbours.filter((cell) => this.shouldSurvive(cell.coordinate)).map((cell: Cell) => {
            cell.setVerdict('survive', () => {
                // do nothing
            })
            return cell;
        });

        const shouldDie: Cell[] = uniqueCellsWithNeighbours.filter((cell) => this.shouldDie(cell.coordinate)).map((cell: Cell) => {
            cell.setVerdict('kill', () => {
                cell.kill();
            })
            return cell;
        });

        const shouldReproduce: Cell[] = uniqueCellsWithNeighbours.filter((cell) => this.shouldReproduce(cell.coordinate)).map((cell: Cell) => {
            cell.setVerdict('revive', () => {
                cell.revive();
            })
            return cell;
        });

        if (showVerdict) {
            const surviveBoard = createBoardFromCells(createCellRecordFromArray(shouldSurvive), {
                check: (c) => c.verdictName === 'survive',
                whenTrue: true,
                whenFalse: false
            });

            const dieBoard = createBoardFromCells(createCellRecordFromArray(shouldDie), {
                check: (c) => c.verdictName === 'kill',
                whenTrue: true,
                whenFalse: false
            });

            const reproduceBoard = createBoardFromCells(createCellRecordFromArray(shouldReproduce), {
                check: (c) => c.verdictName === 'revive',
                whenTrue: true,
                whenFalse: false
            });

            const verdictsBoard = surviveBoard.map((surviveRow: boolean[], y: number) => {
                return surviveRow.map((survive: boolean, x) => {
                    return survive ? 'S' : dieBoard[y][x] ? 'K' : reproduceBoard[y][x] ? 'L' : 'O'
                })
            });

            console.log('verdicts', verdictsBoard);
        }


        return [...shouldSurvive, ...shouldDie, ...shouldReproduce].map((cell) => cell.applyVerdict());
    }

    isCellAlive(coordinate: Coordinate) {
        return this.cells[`${coordinate.x},${coordinate.y}`]?.isAlive();
    }

    cellWithNeighbours(coordinate: Coordinate) {
        const neighbours: Cell[] = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const neighbourCoordinate = {
                    x: coordinate.x + x,
                    y: coordinate.y + y
                }
                neighbours.push(cellAt(neighbourCoordinate, this.cells))
            }
        }
        return neighbours;
    }


    neighbourCount(coordinate: Coordinate) {
        const {x: centerX, y: centerY} = coordinate;
        return this.cellWithNeighbours(coordinate).map((c) => {
            const {x: cellX, y: cellY} = c.coordinate;
            const isCenterCell = centerX === cellX && centerY === cellY;
            return c.isAlive() && !isCenterCell;
        }).filter(v => !!v).length;
    }

    lookUpCell(coordinate: Coordinate) {
        return cellAt(coordinate, this.cells)
    }

    // Any live cell with two or three live neighbours survives.
    shouldSurvive(coordinate: Coordinate) {
        const alive = this.lookUpCell(coordinate).isAlive();
        const count = this.neighbourCount(coordinate);
        return  alive && (count === 2 || count === 3);
    }

    // Any dead cell with three live neighbours becomes a live cell.
    shouldReproduce(coordinate: Coordinate) {
        const notAlive = !this.lookUpCell(coordinate).isAlive();
        const count = this.neighbourCount(coordinate);
        return  notAlive && count === 3;
    }

    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    shouldDie(coordinate: Coordinate) {
        const alive = this.lookUpCell(coordinate).isAlive();
        const count = this.neighbourCount(coordinate);
        return alive && (count < 2 || count > 3);
    }
}