import * as THREE from "three";

import { GameView } from "./game/game";
import { GameTank } from "./game/gametank";
import { GameBalls } from "./game/gameballs";
import { GameSkyBox } from "./game/gameskybox";
import * as fgui from "../libs/fairygui/FairyGUI";
import { vitamin } from "./vitamin/vitamin";
import { MainView } from "./ui/MainView";
import { ModelUser } from "./model/ModelUser";

export class Main {

    constructor() {
        this.init();
    }

    private async init() {

        vitamin.initialize({
            div:"app",
            designWidth: 640,
            designHeight: 1136
        });
        vitamin.enterGame(GameBalls);
        
        //new ModelUser();
        
        await vitamin.ui.load("assets/UI/Package1");
        vitamin.ui.register(MainView, "Main");
        vitamin.ui.open(MainView);
    }
}

new Main();