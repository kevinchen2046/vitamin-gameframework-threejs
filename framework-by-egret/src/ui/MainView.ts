
class MainView extends vitamin.ViewFairy {

    @vitamin.Model
    public user: ModelUser;

    public info: FairyGUI.GLabel;

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