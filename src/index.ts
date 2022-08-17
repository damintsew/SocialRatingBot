import {env} from "node:process";
import {Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./domain/Domain";
import {RatingService} from "./service/RatingService";
import {UserDao} from "./dao/UserDao";
import {RatingDao} from "./dao/RatingDao";
import {TextProcessingService} from "./service/TextProcessingService";
import {CronJobService} from "./service/CronJobService";

const ratingDao = new RatingDao()
const userService = new UserDao()


const token = env.TG_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}
const bot = new Telegraf<MyContext>(token)

const ratingService = new RatingService(bot, ratingDao, userService)
const textProcessingService = new TextProcessingService(ratingService)
const cronJobService = new CronJobService(ratingService)

const stage = new Scenes.Stage<MyContext>()

bot.telegram.deleteMyCommands()
    .then(() => bot.telegram.setMyCommands([
        {command: 'rating', description: 'Показать личный рейтинг'},
        {command: 'rating_all', description: 'Показать лучший друг Си'}
        // {command: 'unsubscribe', description: 'Отписаться от уведомлений'},
        // {command: 'help', description: 'Список моих возможностей'}
    ]));

bot.use(session())
bot.use(stage.middleware())
bot.use(async (ctx, next) => {

    if (!ctx?.session?.isUserSaved) {
        if (ctx.message == null || ctx.message.from == null || ctx.message.from.id == null) {
            return next();
        }
        const user = ctx?.message?.from;
        const userFromDB = await userService.getUser(user.id, ctx.message.chat.id);
        if (userFromDB == null) {
            ctx.session.user = await userService.addUser(user, ctx.message.chat.id);
        } else {
            ctx.session.user = userFromDB;
        }
        ctx.session.isUserSaved = true;
        // const allUsers = await userService.getUsers();
        // console.log(allUsers)
    }

    return next()
})

bot.command('rating', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id
    const user = await userService.getUser(userId, chatId);
    const userRating = await ratingService.getRating(userId, chatId);
    if (userRating != null) {
        ctx.reply(`${user?.firstName} твой рейтинг ${userRating.socialRating}`)
    } else {
        await ratingService.addUserSocialRating(userId, chatId);
        ctx.reply(`${user?.firstName} твой рейтинг 100`)
    }
});

bot.command('rating_all', async (ctx) => {
    await ratingService.printRatingAll(ctx)
});


bot.on('text', async (ctx) => {
    await textProcessingService.processText(ctx)
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
