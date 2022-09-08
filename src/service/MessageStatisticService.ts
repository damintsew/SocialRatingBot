import {MessageDao} from "../dao/MessageDao";
import {UserDao} from "../dao/UserDao";
import {Message} from "../entity/Message";

export default class MessageStatisticService {

    private messageDao: MessageDao;
    private userDao: UserDao;


    constructor(messageDao: MessageDao, userDao: UserDao) {
        this.messageDao = messageDao;
        this.userDao = userDao;
    }

    async saveMessage(userId: number, chatId: number, message: string, messageId: number) {
        const user = await this.userDao.getUser(userId)

        const msg = new Message()
        msg.user = user;
        msg.chatId = chatId.toString();
        msg.text = message
        msg.tgMessageId = messageId.toString()
        msg.date = new Date()

        await this.messageDao.saveMessage(msg);
    }
}
