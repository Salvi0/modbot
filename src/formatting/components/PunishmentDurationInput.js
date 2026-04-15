import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {formatTime} from "../../util/timeutils.js";

export default class PunishmentDurationInput extends LabelBuilder {
    /**
     * @param {string} punishment
     * @param {?import('../../database/BadWord.js').default} existing
     */
    constructor(punishment, existing = null) {
        super();

        const input = new TextInputBuilder()
            .setRequired(false)
            .setCustomId('duration')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Punishment duration')
            .setMinLength(2)
            .setMaxLength(4000);

        if (existing?.punishment?.duration) {
            input.setValue(formatTime(existing.punishment.duration));
        }

        this.setLabel("Punishment Duration")
            .setDescription("Duration of the " + punishment)
            .setTextInputComponent(input);
    }
}
