import {dataSource} from "../db/data-source";
import {UserSocialRating} from "../entity/User";
import {RatingDao} from "../dao/RatingDao";
import {UserDao} from "../dao/UserDao";
import {RatingCatalog} from "./RatingCatalog";

export class RatingService {
    private dao: RatingDao;
    private userDao: UserDao;

    constructor(dao: RatingDao, userDao: UserDao) {
        this.dao = dao;
        this.userDao = userDao;
        dataSource.initialize();
    }

    async changeRating(userId: number, chatId: number, ratingValue: number) {
        const userWithRating = await this.dao.getRating(userId, chatId);
        const user = await this.userDao.getUser(userId, chatId);
        if (userWithRating == null) {
            await this.dao.addUserSocialRating(userId, chatId);
        }
        await this.dao.changeUserRating(userId, chatId, ratingValue);
        if (ratingValue < 0) {
            return `Принято. Твоя ${user?.firstName} постить баян - расстраивать партия. Минус порция рис`;
        } else {
            return `Твоя ${user?.firstName} радовать Си. Плюс порция рис`;
        }
    }

    async processSticker(ctx) {
        let userIdToProcess = ctx.message.reply_to_message.from.id
        let chatIdToProcess = ctx.message.reply_to_message.chat.id

        let ratingChange = 0
        if (ctx.message.sticker.set_name != null) {
            try {
                ratingChange = this.processStickerPack(ctx.message.sticker.set_name, ctx.message.sticker.file_unique_id)
            } catch (e) {
                ctx.reply(e.message)
            }
        } else
            switch (ctx.message.sticker.emoji) {
                case '👎': {
                    ratingChange = -20
                    break
                }
                case '👍': {
                    ratingChange = +20
                    break
                }
                default: {
                    ratingChange = 0
                }
            }

        if (ratingChange != 0) {
            ctx.reply(await this.changeRating(userIdToProcess, chatIdToProcess, ratingChange))
        }
    }

    async printRatingAll(ctx) {
        let chatId = ctx.message.chat.id
        const usersById = (await this.userDao.getUsersInChat(chatId))
            .reduce((obj, item) => ({...obj, [item.userId]: item}), {})

        const usersRating = await this.getRatingForAllUsers(chatId);

        let message = "🇨🇳 Партия гордится вам!\n";
        for (let rating of usersRating) {
            const user = usersById[rating.userId]
            let line = `⭐ ${user?.firstName ?? user?.username} твой рейтинг ${rating.socialRating}\n`
            message += line
        }
        ctx.reply(message)
    }

    async getRating(userId: number, chatId: number) {
        return this.dao.getRating(userId, chatId);
    }

    async getRatingForAllUsers(chatId: number): Promise<UserSocialRating[]> {
        return this.dao.getRatingForAllUsers(chatId)
    }

    async addUserSocialRating(userId: number, chatId: number) {
        await this.dao.addUserSocialRating(userId, chatId)
    }

    private processStickerPack(setName: string, file_unique_id: string): number {
        const stickerPackCatalog = RatingCatalog.catalog[setName]
        if (stickerPackCatalog == null) {
            return 0
        }

        const stickerDesc = stickerPackCatalog[file_unique_id]
        if (stickerDesc != null) {
            return stickerDesc.ratingValue;
        } else {
            throw new Error(`Unknown sticker file_id = ${file_unique_id} `)
        }
    }
}
