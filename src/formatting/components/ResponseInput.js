import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class ResponseInput extends LabelBuilder {
    /**
     * @param {boolean} required
     * @param {?import('../../database/AutoResponse.js').default} existing
     */
    constructor(required, existing = null) {
        super();
        this.setLabel('Response')
            .setDescription('The response message the bot will send')
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(required)
                .setCustomId('response')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder(existing?.response ?? 'Hi there :wave:')
                .setMinLength(1)
                .setMaxLength(4000)
            );
    }
}
