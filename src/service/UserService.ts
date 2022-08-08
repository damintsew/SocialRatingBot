import {dataSource} from "../db/data-source";
import {User} from "../entity/User";

export class UserService {

    constructor(){
        dataSource.initialize();
    }

    async getUser(userId: number, chatId: number) {
        return await dataSource.manager.findOneBy(User, {userId: userId, chatId: chatId});
    }

    async addUser(from: any) {

        const newUser = new User();

        newUser.userId = from.id;
        // @ts-ignore
        newUser.chatId = ctx.message.chat.id;
        newUser.username = from.username;
        newUser.firstName = from.first_name;
        newUser.lastName = from.last_name;

        newUser.isAdmin = from.id === 152984728;
        newUser.isBlocked = false;

        await dataSource.manager.save(newUser);

        return newUser;

    }

}
