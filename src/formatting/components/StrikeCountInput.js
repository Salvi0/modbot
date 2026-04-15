import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class StrikeCountInput extends LabelBuilder {
    /**
     * @param {?import('../../database/BadWord.js').default} existing
     */
    constructor(existing = null) {
        super();

        const input = new TextInputBuilder()
            .setCustomId('strike-count')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("1")
            .setMinLength(1)
            .setMaxLength(2);

        if (existing?.punishment?.count) {
            input.setValue(existing.punishment.count.toString());
        }

        this.setLabel("Strike Count")
            .setDescription("Number of strikes the user should receive when triggering this bad word.")
            .setTextInputComponent(input);
    }
}
