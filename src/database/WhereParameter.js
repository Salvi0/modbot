import database from './Database.js';

export default class WhereParameter {
    /**
     * comparison operator
     * @type {string}
     */
    #comparator;

    /**
     * @param {string} field
     * @param {string|number|Array<string|number>} value
     * @param {string} [comparator]
     */
    constructor(field, value, comparator = '=') {
        this.field = field;
        this.value = value;
        this.#comparator = comparator;
    }

    /**
     * @returns {Promise<string>}
     */
    get escapedField() {
        return database.escapeId(this.field);
    }

    get comparator() {
        return this.#comparator ?? '=';
    }

    get placeholder() {
        if (this.comparator.toUpperCase() === 'IN') {
            return '(?)';
        } else {
            return '?';
        }
    }

    /**
     * Format the where parameter for use in a query
     * @returns {Promise<string>}
     */
    async format() {
        return `${await this.escapedField} ${this.comparator} ${this.placeholder}`;
    }
}
