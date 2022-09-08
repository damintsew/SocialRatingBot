import {env} from "node:process";
import {Middleware, Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./domain/Domain";
import {RatingService} from "./service/RatingService";
import {UserDao} from "./dao/UserDao";
import {RatingDao} from "./dao/RatingDao";
import {TextProcessingService} from "./service/TextProcessingService";
import {CronJobService} from "./service/CronJobService";
import {RatingTgAdapter} from "./adapter/RatingTgAdapter";
import MessageStatisticService from "./service/MessageStatisticService";
import {MessageDao} from "./dao/MessageDao";

const ratingDao = new RatingDao()
const userDao = new UserDao()
const messageDao = new MessageDao()


const token = env.TG_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}
const bot = new Telegraf<MyContext>(token)

const messageStatisticService = new MessageStatisticService(messageDao, userDao)
const ratingService = new RatingService(ratingDao, userDao)
const textProcessingService = new TextProcessingService(ratingService)
const ratingAdapter = new RatingTgAdapter(ratingService, bot);

const cronJobService = new CronJobService(ratingAdapter)

const stage = new Scenes.Stage<MyContext>()

bot.telegram.deleteMyCommands()
    .then(() => bot.telegram.setMyCommands([
        {command: 'rating', description: 'Показать личный рейтинг'},
        {command: 'rating_all', description: 'Показать лучший друг Си'}
    ]));

bot.use(session())
bot.use(stage.middleware())
bot.use(async (ctx: MyContext, next) => {

    if (!ctx?.session?.isUserSaved) {
        if (ctx.message == null || ctx.message.from == null || ctx.message.from.id == null) {
            return next();
        }
        const user = ctx?.message?.from;
        const userFromDB = await userDao.getUser(user.id);
        if (userFromDB == null) {
            ctx.session.user = await userDao.addUser(user, ctx.message.chat.id);
        } else {
            ctx.session.user = userFromDB;
        }
        ctx.session.isUserSaved = true;
    }

    const userId = Number.parseInt(ctx.session.user.userId, 10)
    const userRating = await ratingService.getRating(userId, ctx.chat.id);
    if (userRating == null) {
        await ratingService.addUserSocialRating(userId, ctx.chat.id);
    }

    return next()
})

bot.command('rating', async (ctx: MyContext) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id
    const user = await userDao.getUser(userId);
    const userRating = await ratingService.getRating(userId, chatId);
    if (userRating != null) {
        ctx.reply(`${user?.firstName} твой рейтинг ${userRating.socialRating}`)
    } else {
        await ratingService.addUserSocialRating(userId, chatId);
        ctx.reply(`${user?.firstName} твой рейтинг 100`)
    }
});

bot.command('rating_all', async (ctx) => {
    await ratingAdapter.prepareRatingMessage(ctx)
});

bot.on('text', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id

    await textProcessingService.processText(ctx)
    await messageStatisticService.saveMessage(userId, chatId, ctx.message.text, ctx.message.message_id)
})

bot.on('sticker', async (ctx) => {
    console.log(ctx);
    if (ctx.message.sticker != null && ctx.message.reply_to_message != null) {
        await ratingService.processSticker(ctx)
    }
});

bot.launch()
cronJobService.start()

process.once('SIGINT', () => {
    bot.stop('SIGINT')
    cronJobService.stop();
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    cronJobService.stop();
})
