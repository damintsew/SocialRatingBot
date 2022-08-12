import {dataSource} from "../db/data-source";
import {UserSocialRating} from "../entity/User";

export class RatingDao {

    constructor() {
        dataSource.initialize();
    }

    async getRating(userId: number, chatId: number) {
        return await dataSource.createQueryBuilder()
            .select("user")
            .from(UserSocialRating, "user")
            .where("user.userId = :userId", {userId: userId.toString()})
            .andWhere("user.chatId = :chatId", {chatId: chatId.toString()})
            .getOne();
    }

    async getRatingForAllUsers(chatId: number): Promise<UserSocialRating[]> {
        return await dataSource.createQueryBuilder()
            .select("user")
            .from(UserSocialRating, "user")
            .where("user.chatId = :chatId", {chatId: chatId.toString()})
            .orderBy("user.socialRating", "DESC")
            .getMany();
    }

    async addUserSocialRating(userId: number, chatId: number) {
        await dataSource
            .createQueryBuilder()
            .insert()
            .into(UserSocialRating)
            .values([
                {userId: userId.toString(), chatId: chatId.toString(), socialRating: 100}
            ])
            .execute();
    }

    async changeUserRating(userId: number, chatId: number, userRating: number) {
        let userSocialRating = await this.getRating(userId, chatId);

        await dataSource
            .createQueryBuilder()
            .update(UserSocialRating)
            .set({socialRating: userSocialRating.socialRating += userRating})
            .where("userId = :userId", {userId: userId.toString()})
            .andWhere("chatId = :chatId", {chatId: chatId.toString()})
            .execute();
    }
}
