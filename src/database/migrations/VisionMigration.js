import Migration from './Migration.js';

/**
 * @abstract
 */
export default class VisionMigration extends Migration {
    /**
     * @abstract
     */
    get table() {
        throw new Error('Not implemented');
    }

    /**
     * @abstract
     */
    get previousField() {
        throw new Error('Not implemented');
    }

    async check() {
        /**
         * @type {{Field: string, Type: string, Key: string, Default, Extra: string}[]}
         */
        const columns = await this.database.queryAll('DESCRIBE ' + await this.database.escapeId(this.table));
        return !columns.some(column => column.Field === 'enableVision');
    }

    async run() {
        await this.database.query(`ALTER TABLE ${await this.database.escapeId(this.table)}` +
            `ADD COLUMN \`enableVision\` BOOLEAN DEFAULT FALSE AFTER ${await this.database.escapeId(this.previousField)}`);
    }
}
