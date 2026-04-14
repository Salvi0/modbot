import Confirmation from '../../../database/Confirmation.js';
import {parseTime, timeAfter} from '../../../util/timeutils.js';
import ErrorEmbed from '../../../formatting/embeds/ErrorEmbed.js';
import colors from '../../../util/colors.js';
import BadWord from '../../../database/BadWord.js';
import BetterModalBuilder from "../../../formatting/components/BetterModalBuilder.js";
import TriggerTypeSelect from "../../../formatting/components/TriggerTypeSelect.js";
import CTFCheckboxes from "../../../formatting/components/CTFCheckboxes.js";
import PunishmentSelect from "../../../formatting/components/PunishmentSelect.js";
import PriorityInput from "../../../formatting/components/PriorityInput.js";
import SubCommand from "../../SubCommand.js";
import TriggerInput from "../../../formatting/components/TriggerInput.js";
import ResponseInput from "../../../formatting/components/ResponseInput.js";
import ChannelsSelect from "../../../formatting/components/ChannelsSelect.js";
import DirectMessageInput from "../../../formatting/components/DirectMessageInput.js";
import PunishmentDurationInput from "../../../formatting/components/PunishmentDurationInput.js";
import NextStepMessage from "../../../formatting/messages/NextStepMessage.js";

/**
 * @typedef {object} BadWordConfirmationData
 * @property {string} triggerType
 * @property {boolean} global
 * @property {boolean} imageDetection
 * @property {string} punishment
 * @property {number} priority
 */

export default class AddBadWordCommand extends SubCommand {
    async execute(interaction) {
        const modal = new BetterModalBuilder()
            .setTitle("Add bad-word")
            .setCustomId("bad-word:add")
            .addLabelComponent(new TriggerTypeSelect())
            .addLabelComponent(new CTFCheckboxes("bad-word"))
            .addLabelComponent(new PunishmentSelect())
            .addLabelComponent(new PriorityInput());

        await interaction.showModal(modal);
    }

    async executeButton(interaction) {
        const confirmation = await this.getConfirmation(interaction);
        if (!confirmation) {
            return;
        }

        const modal = new BetterModalBuilder()
            .setTitle("Add bad-word")
            .setCustomId(interaction.customId)
            .addLabelComponent(new TriggerInput(confirmation.data.triggerType))
            .addLabelComponent(new ResponseInput(false))
            .addLabelComponent(new DirectMessageInput());

        if (['ban', 'mute'].includes(confirmation.data.punishment)) {
            modal.addLabelComponent(new PunishmentDurationInput(confirmation.data.punishment));
        }

        if (!confirmation.data.global) {
            modal.addLabelComponent(new ChannelsSelect("bad-word"));
        }

        return await interaction.showModal(modal);
    }

    async executeModal(interaction) {
        if (interaction.customId === "bad-word:add") {
            return this.handleFirstStageModal(interaction);
        }

        const confirmation = await this.getConfirmation(interaction);
        if (!confirmation) {
            return;
        }

        return this.handleSecondStageModal(interaction, confirmation);
    }

    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @returns {Promise<unknown>}
     */
    async handleFirstStageModal(interaction) {
        /** @type {BadWordConfirmationData} */
        const confirmationData = {};
        confirmationData.imageDetection = false;
        confirmationData.priority = 0;
        confirmationData.punishment = 'none';
        for (let label of interaction.components) {
            switch (label.component.customId) {
                case 'trigger-type':
                    confirmationData.triggerType = (/** @type {import('discord.js').SelectMenuModalData} */ label.component).values[0];
                    break;
                case CTFCheckboxes.GLOBAL_ID:
                    confirmationData.global = (/** @type {import('discord.js').CheckboxModalData} */ label.component).value;
                    break;
                case CTFCheckboxes.OPTIONS_ID: {
                    const group = /** @type {import('discord.js').CheckboxGroupModalData} */ label.component;
                    confirmationData.global = group.values.includes(CTFCheckboxes.GLOBAL_ID);
                    confirmationData.imageDetection = group.values.includes(CTFCheckboxes.IMAGE_DETECTION_ID);
                    break;
                }
                case 'punishment':
                    confirmationData.punishment = (/** @type {import('discord.js').SelectMenuModalData} */ label.component).values[0];
                    break;
                case 'priority':
                    confirmationData.priority = parseInt((/** @type {import('discord.js').TextInputModalData} */ label.component).value);
                    break;
            }
        }

        const confirmation = new Confirmation(confirmationData, timeAfter("1 hour"));
        const id = "bad-word:add:" + await confirmation.save();
        await interaction.reply(new NextStepMessage(1, 2, id));
    }

    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @param {Confirmation<BadWordConfirmationData>} confirmation
     * @returns {Promise<unknown>}
     */
    async handleSecondStageModal(interaction, confirmation) {
        let trigger,
            response = null,
            directMessage = null,
            duration = null,
            channels = [];
        for (let label of interaction.components) {
            switch (label.component.customId) {
                case 'trigger':
                    trigger = (/** @type {import('discord.js').TextInputModalData} */ label.component).value;
                    break;
                case 'response':
                    response = (/** @type {import('discord.js').TextInputModalData} */ label.component).value;
                    break;
                case 'channels':
                    channels = (/** @type {import('discord.js').SelectMenuModalData} */ label.component).values;
                    break;
                case 'dm':
                    directMessage = (/** @type {import('discord.js').TextInputModalData} */ label.component).value;
                    break;
                case 'duration':
                    duration = parseTime((/** @type {import('discord.js').TextInputModalData} */ label.component).value);
                    break;
            }
        }

        await confirmation.delete();
        if (!trigger || (!confirmation.data.global && !channels.length)) {
            return await interaction.reply(ErrorEmbed.message("Failed to parse modal data!"));
        }

        const result = await BadWord.new(
            interaction.guild.id,
            confirmation.data.global,
            channels,
            confirmation.data.triggerType,
            trigger,
            response,
            confirmation.data.punishment,
            duration,
            confirmation.data.priority,
            directMessage,
            confirmation.data.imageDetection,
        );
        if (!result.success) {
            await interaction.reply(ErrorEmbed.message(result.message));
            return;
        }

        await interaction.reply(result.badWord
            .embed('Added new bad-word', colors.GREEN)
            .toMessage()
        );
    }

    /**
     * Get a confirmation from the interactions custom id
     * @param {import('discord.js').ModalSubmitInteraction|import('discord.js').ButtonInteraction} interaction
     * @returns {Promise<?Confirmation<BadWordConfirmationData>>}
     */
    async getConfirmation(interaction) {
        const confirmationId = interaction.customId.split(':')[2];
        const confirmation = await Confirmation.get(confirmationId);

        if (!confirmation) {
            await interaction.reply(ErrorEmbed.message('This confirmation has expired.'));
            return null;
        }
        return confirmation;
    }

    getDescription() {
        return 'Add a new bad-word';
    }

    getName() {
        return 'add';
    }
}
