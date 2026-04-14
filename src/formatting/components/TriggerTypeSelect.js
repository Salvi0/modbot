import {LabelBuilder} from "discord.js";
import BetterStringSelectMenuBuilder from "./BetterStringSelectMenuBuilder.js";

export default class TriggerTypeSelect extends LabelBuilder {
    constructor() {
        super();
        this.setLabel('Trigger Type')
            .setDescription("The kind of trigger")
            .setStringSelectMenuComponent(new BetterStringSelectMenuBuilder()
                .setCustomId("trigger-type")
                .addOption({
                    label: 'Include',
                    description: 'The message must include the trigger. Upper/lower-case is ignored.',
                    value: 'include'
                })
                .addOption({
                    label: 'Match',
                    description: 'The full message must match the trigger. Upper/lower-case is ignored.',
                    value: 'match'
                })
                .addOption({
                    label: 'Regular expression',
                    description: 'The message must match the provided regular expression (JS Syntax)',
                    value: 'regex'
                })
                .addOption({
                    label: 'Phishing domains (e.g. "discord.com(gg):0.8")',
                    description: 'Match similar domains (e.g. "discord.com(gg):0.8")',
                    value: 'phishing'
                })
            );
    }
}
