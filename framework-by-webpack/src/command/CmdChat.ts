import { CommandBase } from "../vitamin/base/Base";
import { CmdClass } from "../vitamin/base/Injecter";

@CmdClass('chat.send')
export class CmdChatSend extends CommandBase {
    public async exec(content: String) {
        console.log('command exec!!');
        //this.net.notify({ routId: 101, data: { content: content } });
    }
}