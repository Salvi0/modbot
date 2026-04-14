import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class PriorityInput extends LabelBuilder {
    constructor() {
        super();
        this.setLabel('Priority')
            .setDescription('Priority of the bad-word. Higher priority bad-words will be checked first')
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(false)
                .setCustomId('priority')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('0')
                .setMinLength(1)
                .setMaxLength(10)
            );
    }
}
