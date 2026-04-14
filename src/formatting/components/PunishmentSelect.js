import {LabelBuilder} from "discord.js";
import BetterStringSelectMenuBuilder from "./BetterStringSelectMenuBuilder.js";

export default class PunishmentSelect extends LabelBuilder {
    constructor() {
        super();
        this.setLabel('Punishment')
            .setDescription("Additional punishment for users that trigger this bad-word. The message is always deleted.")
            .setStringSelectMenuComponent(new BetterStringSelectMenuBuilder()
                .setCustomId("punishment")
                .addOption({
                    label: 'None',
                    description: 'No additional punishment.',
                    value: 'none'
                })
                .addOption({
                    label: 'Strike',
                    description: 'The user will receive a strike.',
                    value: 'strike'
                })
                .addOption({
                    label: 'Ban',
                    description: 'The user will be banned. An option duration can be specified in the next step.',
                    value: 'ban'
                })
                .addOption({
                    label: 'Mute',
                    description: 'The user will be muted. An option duration can be specified in the next step.',
                    value: 'mute'
                })
                .addOption({
                    label: 'Kick',
                    description: 'The user will be kicked from the server.',
                    value: 'kick'
                })
                .addOption({
                    label: 'Softban',
                    description: 'The user will be kicked and all their recent messages will be deleted.',
                    value: 'softban'
                })
            );
    }
}
