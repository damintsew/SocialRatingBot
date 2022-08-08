import {dataSource} from "../db/data-source";
import {UserSocialRating} from "../entity/User";

export class RatingService {

    constructor(){
        dataSource.initialize();
    }

    async getUser(userId: number, chatId: number) {
        return await dataSource.manager.findOneBy(UserSocialRating, {userId: userId, chatId: chatId});
    }

    async addUser(userId: number, chatId: number) {
        const newUser = new UserSocialRating();

        newUser.userId = userId;
        newUser.chatId = chatId;
        newUser.socialRating = 100;

        await dataSource.manager.save(newUser);
    }

    async changeUserRating(userId: number, chatId: number, userRating: number) {
        let userWithRating = await this.getUser(userId, chatId);
        userWithRating.socialRating += userRating;

        await dataSource.manager.save(userWithRating)
    }

    async getUserRating(userId: number, chatId: number) {
        const userWithRating = await this.getUser(userId, chatId);
        return userWithRating.socialRating;
    }

    async removeUser(userId: number, chatId: number) {
    }


}
