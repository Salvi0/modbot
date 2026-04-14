import {LabelBuilder, TextInputBuilder, TextInputStyle} from "discord.js";

export default class DirectMessageInput extends LabelBuilder {
    constructor() {
        super();
        this.setLabel("Direct Message")
            .setDescription("An optional direct message sent to the user when their message was deleted.")
            .setTextInputComponent(new TextInputBuilder()
                .setRequired(false)
                .setCustomId('dm')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Please don't send messages like that!")
                .setMinLength(1)
                .setMaxLength(3000)
            );
    }
}
