import {dataSource} from "../db/data-source";
import {User} from "../entity/User";
import {Message} from "../entity/Message";

export class MessageDao {

    constructor(){
        dataSource.initialize();
    }

    async saveMessage(msg: Message) {
        await dataSource.getRepository(Message).save(msg)
    }
}
