class Main {

    constructor() {
        this.init();
    }

    private async init() {

        vitamin.context.initialize({
            div: document.querySelector('div'),
            designWidth: 640,
            designHeight: 1136
        });
        vitamin.context.enterGame(GameBalls);

        //new ModelUser();

        await vitamin.context.ui.load("resource/UI/Package1");
        vitamin.context.ui.register(MainView, "Main");
        vitamin.context.ui.open(MainView);
    }
}
