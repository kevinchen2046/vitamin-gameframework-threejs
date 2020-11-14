import { ViewFairy } from "../vitamin/manager/Fairy";

import * as fgui from "../../libs/fairygui/FairyGUI";
import { Model } from "../vitamin/base/Injecter";
import { ModelUser } from "../model/ModelUser";

export class MainView extends ViewFairy {

    @Model
    public user: ModelUser;

    public info: fgui.GLabel;

    public enter() {
        console.log(this.info);
        console.log(this.user.name);
        this.exec("chat.send");
        this.info.text = "data.desc";
    }

    public resize(w: number, h: number) {
        this.skin.makeFullScreen();
    }
}