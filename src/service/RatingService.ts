import {dataSource} from "../db/data-source";
import {UserSocialRating} from "../entity/User";

export class RatingService {

    constructor(){
        dataSource.initialize();
    }

    async getUser(userId: number, chatId: number) {
        return await dataSource.createQueryBuilder()
            .select("user")
            .from(UserSocialRating, "user")
            .where("user.userId = :userId", { userId: userId.toString() })
            .andWhere("user.chatId = :chatId", { chatId: chatId.toString() })
            .getOne();
    }

    async getUsers() {
        return await dataSource.createQueryBuilder()
        .select("user")
        .from(UserSocialRating, "user")
        .getMany();
    }

    async addUserSocialRating(userId: number, chatId: number) {
        await dataSource
            .createQueryBuilder()
            .insert()
            .into(UserSocialRating)
            .values([
                { userId: userId.toString(), chatId: chatId.toString(),  socialRating: 100}
            ])
            .execute();
    }

    async changeUserRating(userId: number, chatId: number, userRating: number) {
        let userSocialRating = await this.getUser(userId, chatId);

        await dataSource
            .createQueryBuilder()
            .update(UserSocialRating)
            .set({ socialRating: userSocialRating.socialRating += userRating})
            .where("userId = :userId", { userId: userId.toString() })
            .andWhere("chatId = :chatId", { chatId: chatId.toString() })
            .execute();
    }
}
