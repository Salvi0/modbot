import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class ResponseInput extends LabelBuilder {
    /**
     * @param {boolean} required
     */
    constructor(required) {
        super();
        this.setLabel('Response')
            .setDescription('The response message the bot will send')
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(required)
                .setCustomId('response')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Hi there :wave:')
                .setMinLength(1)
                .setMaxLength(4000)
            );
    }
}
