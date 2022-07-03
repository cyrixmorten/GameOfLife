import { Coordinate } from './Coordinate';

export class Cell {

    public verdictName: string = '';
    private verdictFn: () => void = () => null;

    constructor(public readonly coordinate : Coordinate, private alive: boolean = true) {}

    public isAlive() {
        return this.alive;
    }

    public kill() {
        this.alive = false;
    }

    public revive() {
        this.alive = true;
    }

    public setVerdict(verdictName: string, verdictFn: () => void) {
        this.verdictName = verdictName;
        this.verdictFn = verdictFn;
    }

    public applyVerdict() {
        if (typeof this.verdictFn === 'function') {
            this.verdictFn();
        }

        this.verdictName = '';
        this.verdictFn = () => null;

        return this;
    }
}