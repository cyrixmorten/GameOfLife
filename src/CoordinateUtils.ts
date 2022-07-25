import { Coordinate } from './Coordinate';

export const equalCoordinates = (c1: Coordinate, c2: Coordinate) => {
    return c1.x === c2.x && c1.y === c2.y;
}

export const mergeCoordinates = (c1: Coordinate, c2: Coordinate): Coordinate => {
    return {
        x: c1.x + c2.x,
        y: c1.y + c2.y
    }
}