import { Cell, VERDICT } from './Cell';
import { Coordinate } from './Coordinate';
import { addCell, cellAt, CellRecord, equalCoordinates, toCellKey, verdictBoard } from './Utils';
import * as _ from 'lodash';

export class GameOfLife {

    constructor(public readonly cells: CellRecord = {}) {
    }

    tick(showVerdict: boolean) {

        const shouldSurvive: Cell[] = this.aliveCells().filter((cell) => this.shouldSurvive(cell)).map((cell: Cell) => {
            cell.setVerdict(VERDICT.SURVIVE, () => {
                // do nothing
            });
            return cell;
        });

        const shouldDie: Cell[] = this.aliveCells().filter((cell) => this.shouldDie(cell)).map((cell: Cell) => {
            cell.setVerdict(VERDICT.KILL, () => {
                cell.kill();
            })
            return cell;
        });


        const shouldReproduce: Cell[] = this.allDeadNeighbours().map(c => new Cell(c, false)).filter((cell) => this.shouldReproduce(cell)).map((cell: Cell) => {
            cell.setVerdict(VERDICT.REPRODUCE, () => {
                cell.revive();
            })
            return addCell(cell, this.cells);
        });

        if (showVerdict) {
            const surviveBoard = verdictBoard(VERDICT.SURVIVE, shouldSurvive);
            const dieBoard = verdictBoard(VERDICT.KILL, shouldDie);
            const reproduceBoard = verdictBoard(VERDICT.REPRODUCE, shouldDie);

            const verdictsBoard = surviveBoard.map((surviveRow: boolean[], y: number) => {
                return surviveRow.map((survive: boolean, x) => {
                    return survive ? 'S' : dieBoard[y][x] ? 'K' : reproduceBoard[y][x] ? 'L' : 'O'
                })
            });

            console.log('verdicts', verdictsBoard);
        }

        [...shouldSurvive, ...shouldDie, ...shouldReproduce].map((cell) => cell.applyVerdict());


        for (const key of shouldDie.map((cell) => cell.coordinate).map(toCellKey)) {
            delete this.cells[key];
        }
    }

    isCellAlive(coordinate: Coordinate) {
        return this.cells[`${coordinate.x},${coordinate.y}`]?.isAlive();
    }

    aliveCells() {
        return Object.values(this.cells);
    }

    allDeadNeighbours() {
        const neighbourCoordinates: Coordinate[] = this.aliveCells().map((cell) => this.surroundingCoordinates(cell.coordinate)).flat(2)
        const deadNeighbourCoordinates = neighbourCoordinates.filter((c) => !cellAt(c, this.cells));
        return _.uniqWith(deadNeighbourCoordinates, equalCoordinates);
    }

    surroundingCoordinates(coordinate: Coordinate): Coordinate[] {
        const neighbourCoordinates: Coordinate[] = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    // skip
                } else {
                    neighbourCoordinates.push({
                        x: coordinate.x + x,
                        y: coordinate.y + y
                    });
                }
            }
        }
        return neighbourCoordinates;
    }


    neighbourCount(cell: Cell) {
        return this.surroundingCoordinates(cell.coordinate).map((c) => {
            return cellAt(c, this.cells)
        }).filter(v => !!v).length;
    }

    // Any live cell with two or three live neighbours survives.
    shouldSurvive(cell: Cell) {
        const count = this.neighbourCount(cell);
        return cell.isAlive() && (count === 2 || count === 3);
    }

    // Any dead cell with three live neighbours becomes a live cell.
    shouldReproduce(cell: Cell) {
        const count = this.neighbourCount(cell);
        return !cell.isAlive() && count === 3;
    }

    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    shouldDie(cell: Cell) {
        const count = this.neighbourCount(cell);
        return cell.isAlive() && (count < 2 || count > 3);
    }
}