import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import AutoResponse from "../../database/AutoResponse.js";

export default class TriggerInput extends LabelBuilder {
    /**
     * @param {string} type
     * @param {?import('../../database/AutoResponse.js').default} existing
     */
    constructor(type, existing = null) {
        super();
        this.setLabel('Trigger')
            .setDescription('Get value of the trigger')
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(true)
                .setCustomId('trigger')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder(existing?.trigger.asContentString() ?? AutoResponse.getTriggerPlaceholder(type))
                .setMinLength(1)
                .setMaxLength(4000)
            );
    }
}
