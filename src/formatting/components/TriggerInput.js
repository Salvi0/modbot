import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import AutoResponse from "../../database/AutoResponse.js";

export default class TriggerInput extends LabelBuilder {
    constructor(type) {
        super();
        this.setLabel('Trigger')
            .setDescription('Get value of the trigger')
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(true)
                .setCustomId('trigger')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(AutoResponse.getTriggerPlaceholder(type))
                .setMinLength(1)
                .setMaxLength(4000)
            );
    }
}
