import {dataSource} from "../db/data-source";
import {User} from "../entity/User";

export class UserDao {

    constructor(){
        dataSource.initialize();
    }

    async getUser(userId: number, chatId: number) {
        return await dataSource.createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.userId = :userId", { userId: userId })
            // .andWhere("user.chatId = :chatId", { chatId: chatId.toString() })
            .getOne();
    }

    async getUsersInChat(chatId: number) {
        return await dataSource.createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.chatId = :chatId", { chatId: chatId.toString() })
            .getMany();
    }

    async addUser(user: any, chatId: number) {
        let newUser = await dataSource
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {   userId: user.id.toString(),
                    chatId: chatId.toString(),
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    isAdmin: user.id === 152984728,
                    isBlocked: false
                }
            ])
            .returning("*")
            .execute();
        return newUser.raw
    }

}
