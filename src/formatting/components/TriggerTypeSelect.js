import {LabelBuilder} from "discord.js";
import BetterStringSelectMenuBuilder from "./BetterStringSelectMenuBuilder.js";

export default class TriggerTypeSelect extends LabelBuilder {
    /**
     * @param {?import('../../database/AutoResponse.js').default} existing
     */
    constructor(existing) {
        super();

        /** @type {import('discord.js').APISelectMenuOption[]} */
        const options = [
            {
                label: 'Include',
                description: 'The message must include the trigger. Upper/lower-case is ignored.',
                value: 'include'
            },
            {
                label: 'Match',
                description: 'The full message must match the trigger. Upper/lower-case is ignored.',
                value: 'match'
            },
            {
                label: 'Regular expression',
                description: 'The message must match the provided regular expression (JS Syntax)',
                value: 'regex'
            },
            {
                label: 'Phishing domains (e.g. "discord.com(gg):0.8")',
                description: 'Match similar domains (e.g. "discord.com(gg):0.8")',
                value: 'phishing'
            }
        ];

        let description = "The kind of trigger";
        const select = new BetterStringSelectMenuBuilder()
            .setCustomId("trigger-type");

        for (const option of options) {
            select.addOption(option);
            if (option.value === existing?.trigger?.type) {
                description += ". The previous value was " + option.label + ".";
            }
        }

        this.setLabel('Trigger Type')
            .setDescription(description)
            .setStringSelectMenuComponent(select);
    }
}
