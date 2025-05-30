import Interval from './Interval.js';
import database from '../database/Database.js';
import bot from '../bot/Bot.js';
import GuildWrapper from '../discord/GuildWrapper.js';
import MemberWrapper from '../discord/MemberWrapper.js';
import {RESTJSONErrorCodes} from 'discord.js';
import ErrorEmbed from '../formatting/embeds/ErrorEmbed.js';
import logger from '../bot/Logger.js';

export default class UnbanInterval extends Interval {
    getInterval() {
        return 30 * 1000;
    }

    async run() {
        for (const result of await database.queryAll('SELECT * FROM moderations WHERE action = \'ban\' AND active = TRUE AND expireTime IS NOT NULL AND expireTime <= ?',
            Math.floor(Date.now() / 1000))) {
            if (!bot.client.guilds.cache.has(result.guildid)) {
                continue;
            }

            try {
                const guild = await GuildWrapper.fetch(result.guildid);

                if (!guild) {
                    const wrapper = new GuildWrapper({id: result.guildid});
                    await wrapper.deleteData();
                    continue;
                }

                const user = await bot.client.users.fetch(result.userid);
                const member = new MemberWrapper(user, guild);
                try {
                    await member.unban('Temporary ban completed!', null, bot.client.user);
                } catch (e) {
                    if (e.code === RESTJSONErrorCodes.MissingPermissions) {
                        await database.query('UPDATE moderations SET active = FALSE WHERE active = TRUE AND guildid = ? AND userid = ? AND action = \'ban\'',
                            guild.guild.id, user.id);
                        await guild.log(new ErrorEmbed('Missing permissions to unban user!')
                            .setAuthor({name: user.displayName, iconURL: user.displayAvatarURL()})
                            .setFooter({text: user.id})
                            .toMessage(false));
                        await logger.warn(`Missing permissions to unban user ${result.userid} in guild ${result.guildid}`);
                    } else {
                        throw e;
                    }
                }
            } catch (e) {
                await logger.error(`Failed to unban user ${result.userid} in guild ${result.guildid}`, e);
            }
        }
    }
}
