
@vitamin.CmdClass('chat.send')
class CmdChatSend extends vitamin.CommandBase {
    public async exec(content: String) {
        console.log('command exec!!');
        //this.net.notify({ routId: 101, data: { content: content } });
    }
}