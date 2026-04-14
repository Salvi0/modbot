import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class PunishmentDurationInput extends LabelBuilder {
    /**
     * @param {string} punishment
     */
    constructor(punishment) {
        super();
        this.setLabel("Punishment Duration")
            .setDescription("Duration of the " + punishment)
            .setTextInputComponent(
                new TextInputBuilder()
                    .setRequired(false)
                    .setCustomId('duration')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Punishment duration')
                    .setMinLength(2)
                    .setMaxLength(4000)
            );
    }
}
