import { ViewFairy } from "../vitamin/manager/Fairy";

import * as fgui from "../../libs/fairygui/FairyGUI";
import { Model } from "../vitamin/base/Injecter";
import { ModelUser } from "../model/ModelUser";
import { CmdChatSend } from "../command/CmdChat";

export class MainView extends ViewFairy {

    @Model(ModelUser)
    public user: ModelUser;

    public info: fgui.GLabel;

    public enter() {
        console.log(this.info);
        console.log(this.user);
        console.log(this.user.name);
        this.execClazz(CmdChatSend);
        this.info.text = "data.desc";
    }

    public resize(w: number, h: number) {
        this.skin.makeFullScreen();
    }
}