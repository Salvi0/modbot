import {ChannelSelectMenuBuilder, ChannelType, LabelBuilder} from "discord.js";
import {SELECT_MENU_OPTIONS_LIMIT} from "../../../../util/apiLimits.js";

export default class ChannelsInput extends LabelBuilder {
    /**
     * @param {string} name
     */
    constructor(name) {
        super();
        this.setLabel("Channels")
            .setDescription("The channels this " + name + " applies to")
            .setChannelSelectMenuComponent(
                new ChannelSelectMenuBuilder()
                    // eslint-disable-next-line jsdoc/reject-any-type
                    .addChannelTypes(/** @type {*} */[
                        ChannelType.GuildText,
                        ChannelType.GuildForum,
                        ChannelType.GuildAnnouncement,
                        ChannelType.GuildStageVoice,
                    ])
                    .setMinValues(1)
                    .setMaxValues(SELECT_MENU_OPTIONS_LIMIT)
                    .setCustomId(`channels`)
            );
    }
}
