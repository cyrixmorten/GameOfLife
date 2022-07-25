import { Coordinate } from './Coordinate';

export enum VERDICT {
    NONE = 'O',
    SURVIVE = 'S',
    REPRODUCE = 'L',
    KILL = 'K'
}

export class Cell {

    public verdict: VERDICT = VERDICT.NONE;
    private verdictFn: () => void = () => null;

    constructor(public coordinate : Coordinate, private alive: boolean = true) {}

    public isAlive() {
        return this.alive;
    }

    public kill() {
        this.alive = false;
    }

    public revive() {
        this.alive = true;
    }

    public setVerdict(verdict: VERDICT, verdictFn: () => void) {
        this.verdict = verdict;
        this.verdictFn = verdictFn;
    }

    public applyVerdict() {
        if (typeof this.verdictFn === 'function') {
            this.verdictFn();
        }

        this.verdict = VERDICT.NONE;
        this.verdictFn = () => null;

        return this;
    }
}