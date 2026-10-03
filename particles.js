import { checkBounds, moveParticle, getParticle, setParticle } from "./canvas.js";
import { getRandomInt } from "./util.js";

/**
 * Base particle class
 */
class Particle {
    constructor() {
        this.color = "";
        this.type = "";
    }

    /**
     * Returns true if the particle should swap with other when trying
     * to move onto the same grid location as {@link other}.
     * 
     * EX: Let sand sink below water
     * 
     * @param {Particle} other 
     * @returns {boolean} Should the particle swap
     */
    swap(other) {
        return false;
    }

    /**
     * Update the particle at location (row, col)
     * 
     * @param {number} row 
     * @param {number} col 
     */
    update(row, col) {

    }
}

/**
 * Sand particle
 */
export class Sand extends Particle {
    constructor() {
        super();
        this.color = "orange";
        this.type = "sand";
    }

    swap(other) {
        return other.type == "water";
    }

    update(row, col) {
        const newRow = row + 1;
        if(!moveParticle(row, col, newRow, col, this.swap)) {
            if(!moveParticle(row, col, newRow, col-1, this.swap)) {
                moveParticle(row, col, newRow, col+1, this.swap);
            }
        }
    }
}

/**
 * Water particle
 */
export class Water extends Particle {
    constructor() {
        super();
        this.color = "blue";
        this.type = "water";
    }

    update(row, col) {
        if (getRandomInt(0, 2) && !getParticle(row+1, col)) {
            moveParticle(row, col, row+1, col, super.swap);
        }
        
        if (getRandomInt(0, 1) && !getParticle(row, col+1)) {
            moveParticle(row, col, row, col+1, super.swap);
        }
        else if (!getParticle(row, col-1)) {
            moveParticle(row, col, row, col-1, super.swap);
        }
    }
}

/**
 * Stone particle
 */
export class Stone extends Particle {
    constructor() {
        super();
        this.color = "grey";
        this.type = "stone";
    }
}

/**
 * Dirt particle
 */
export class Dirt extends Sand {
    constructor() {
        super();
        this.color = "brown";
        this.type = "dirt";
    }
}

/**
 * Acid particle
 */
export class Acid extends Water {
    constructor() {
        super();
        this.color = "lime";
        this.type = "acid";
    }

    update(row, col) {
        if(getParticle(row, col+1) && getParticle(row, col+1).type !== this.type) {
            setParticle(row, col+1, null);
        }

        if(getParticle(row, col-1) && getParticle(row, col-1).type !== this.type) {
            setParticle(row, col-1, null);
        }
        
        if(getParticle(row+1, col) && getParticle(row+1, col).type !== this.type) {
            setParticle(row, col-1, null);
        }

        if(getParticle(row-1, col) && getParticle(row-1, col).type !== this.type) {
            setParticle(row, col-1, null);
        }

        super.update(row, col);
    }
}

/**
 * Create particle based on dropdown name
 * 
 * @param {string} value 
 * @returns 
 */
export function createParticleByType(value) {
    if (value == "Sand") {
        return new Sand();
    } 
    else if (value == "Water") {
        return new Water();
    }
    else if (value == "Stone") {
        return new Stone();
    }
    else if (value == "Dirt") {
        return new Dirt();
    }
    else if(value == "Acid") {
        return new Acid();
    }
}