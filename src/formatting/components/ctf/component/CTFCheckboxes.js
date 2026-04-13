import {CheckboxBuilder, LabelBuilder} from "discord.js";
import BetterCheckboxGroupBuilder from "../../BetterCheckboxGroupBuilder.js";
import config from "../../../../bot/Config.js";

export default class CTFCheckboxes extends LabelBuilder {
    static GLOBAL_ID = "global";
    static GLOBAL_TITLE= "Global";
    static GLOBAL_DESCRIPTION = "Make this option apply to all channels";

    static IMAGE_DETECTION_ID = "image-detection";
    static IMAGE_DETECTION_TITLE = "Image Detection";
    static IMAGE_DETECTION_DESCRIPTION = "Also detect images containing text that matches the trigger";

    static OPTIONS_ID = "options";

    /**
     * @param {string} type
     */
    constructor(type) {
        super();

        if (config.data.googleCloud.vision.enabled) {
            this.setLabel('Options')
                .setDescription('Options for the ' + type)
                .setCheckboxGroupComponent(new BetterCheckboxGroupBuilder()
                    .setCustomId(CTFCheckboxes.OPTIONS_ID)
                    .addOption({
                        value: CTFCheckboxes.GLOBAL_ID,
                        label: CTFCheckboxes.GLOBAL_TITLE,
                        description: CTFCheckboxes.GLOBAL_DESCRIPTION,
                    })
                    .addOption({
                        value: CTFCheckboxes.IMAGE_DETECTION_ID,
                        label: CTFCheckboxes.IMAGE_DETECTION_TITLE,
                        description: CTFCheckboxes.IMAGE_DETECTION_DESCRIPTION,
                    }));
        } else {

            this.setLabel(CTFCheckboxes.GLOBAL_TITLE)
                .setDescription(CTFCheckboxes.GLOBAL_DESCRIPTION)
                .setCheckboxComponent(new CheckboxBuilder()
                    .setCustomId(CTFCheckboxes.GLOBAL_ID)
                );
        }
    }
}
