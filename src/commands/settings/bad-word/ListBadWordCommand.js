import SubCommand from '../../SubCommand.js';
import BadWord from '../../../database/BadWord.js';
import {MessageFlags} from 'discord.js';

export default class ListBadWordCommand extends SubCommand {

    async execute(interaction) {
        const embeds = await BadWord.getGuildOverview(interaction.guild, 'Bad-word');

        for (const [index, embed] of embeds.entries()) {
            const options = { flags: MessageFlags.Ephemeral, embeds: [embed] };
            if (index === 0) {
                await interaction.reply(options);
            }
            else {
                await interaction.followUp(options);
            }
        }
    }

    getDescription() {
        return 'List all bad-words in this guild';
    }

    getName() {
        return 'list';
    }
}
