import SubCommand from '../../SubCommand.js';
import Confirmation from '../../../database/Confirmation.js';
import AutoResponse from '../../../database/AutoResponse.js';
import ErrorEmbed from '../../../formatting/embeds/ErrorEmbed.js';
import colors from '../../../util/colors.js';
import BetterModalBuilder from "../../../formatting/components/BetterModalBuilder.js";
import TriggerTypeSelect from "../../../formatting/components/TriggerTypeSelect.js";
import CTFCheckboxes from "../../../formatting/components/CTFCheckboxes.js";
import NextStepMessage from "../../../formatting/messages/NextStepMessage.js";
import {timeAfter} from "../../../util/timeutils.js";
import TriggerInput from "../../../formatting/components/TriggerInput.js";
import ResponseInput from "../../../formatting/components/ResponseInput.js";
import ChannelsSelect from "../../../formatting/components/ChannelsSelect.js";

/**
 * @typedef {object} AutoResponseConfirmationData
 * @property {string} triggerType
 * @property {boolean} global
 * @property {boolean} imageDetection
 */

export default class AddAutoResponseCommand extends SubCommand {
    async execute(interaction) {
        const modal = new BetterModalBuilder()
            .setTitle("Add auto-response")
            .setCustomId("auto-response:add")
            .addLabelComponent(new TriggerTypeSelect())
            .addLabelComponent(new CTFCheckboxes("auto-response"));

        await interaction.showModal(modal);
    }

    async executeButton(interaction) {
        const confirmation = await this.getConfirmation(interaction);
        if (!confirmation) {
            return;
        }

        const modal = new BetterModalBuilder()
            .setTitle("Add auto-response")
            .setCustomId(interaction.customId)
            .addLabelComponent(new TriggerInput())
            .addLabelComponent(new ResponseInput(true));

        if (!confirmation.data.global) {
            modal.addLabelComponent(new ChannelsSelect("auto-response"));
        }

        return await interaction.showModal(modal);
    }

    async executeModal(interaction) {
        if (interaction.customId === "auto-response:add") {
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
        /** @type {AutoResponseConfirmationData} */
        const confirmationData = {};
        confirmationData.imageDetection = false;
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
            }
        }

        const confirmation = new Confirmation(confirmationData, timeAfter("1 hour"));
        const id = "auto-response:add:" + await confirmation.save();
        await interaction.reply(new NextStepMessage(1, 2, id));
    }

    /**
     * @param {import('discord.js').ModalSubmitInteraction} interaction
     * @param {Confirmation<AutoResponseConfirmationData>} confirmation
     * @returns {Promise<unknown>}
     */
    async handleSecondStageModal(interaction, confirmation) {
        let trigger,
            response,
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
            }
        }

        await confirmation.delete();
        if (!trigger || !response ||
            (!confirmation.data.global && !channels.length)) {
            return await interaction.reply(ErrorEmbed.message("Failed to parse modal data!"));
        }

        const result = await AutoResponse.new(
            interaction.guild.id,
            confirmation.data.global,
            channels,
            confirmation.data.triggerType,
            trigger,
            response,
            confirmation.data.imageDetection,
        );
        if (!result.success) {
            await interaction.reply(ErrorEmbed.message(result.message));
            return;
        }

        await interaction.reply(result.response
            .embed('Added new auto-response', colors.GREEN)
            .toMessage()
        );
    }

    /**
     * Get a confirmation from the interactions custom id
     * @param {import('discord.js').ModalSubmitInteraction|import('discord.js').ButtonInteraction} interaction
     * @returns {Promise<?Confirmation<AutoResponseConfirmationData>>}
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
        return 'Add a new auto-response';
    }

    getName() {
        return 'add';
    }
}
