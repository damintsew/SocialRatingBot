import {env} from "node:process";
import {Scenes, session, Telegraf} from "telegraf";
import {MyContext} from "./domain/Domain";
import {RatingService} from "./service/RatingService";
import {UserService} from "./service/UserService";


const ratingService = new RatingService()
const userService = new UserService()

const token = env.TG_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf<MyContext>(token)

const stage = new Scenes.Stage<MyContext>()

bot.use(session())
bot.use(stage.middleware())
bot.use(async (ctx, next) => {

    if (!ctx?.session?.isUserSaved) {
        if (ctx.message == null || ctx.message.from == null || ctx.message.from.id == null) {
            return next();
        }
        const from = ctx?.message?.from;

        const userFromDB = await userService.getUser(from.id, ctx.message.chat.id);
        if (userFromDB == null) {
            ctx.session.user = await userService.addUser(from);
        } else {
            ctx.session.user = userFromDB;
        }
        ctx.session.isUserSaved = true;
    }

    return next()
})

// bot.command('help', (ctx) => ctx.reply("/oleg"))
// bot.command('oleg', (ctx) => ctx.reply("Olegneochen"))

bot.command('raiting', async (ctx) => {
    let userId = ctx.message.from.id;
    let username = ctx.message.from.username
    let chatId = ctx.message.chat.id
    let rating = await ratingService.getUser(userId, chatId);
    ctx.reply(`@${username} твой рейтинг ${rating}`)
});


bot.on('text', async (ctx) => {
    console.log(ctx)
    if (ctx.message.text == "баян") {
        if (ctx.message.reply_to_message != null) {
            let userId = ctx.message.reply_to_message.from.id
            let username = ctx.message.reply_to_message.from.username
            let chatId = ctx.message.reply_to_message.chat.id
            const userWithRating = await ratingService.getUser(userId, chatId);
            if (userWithRating == null) {
                await ratingService.addUser(userId, chatId)
            } 
            await ratingService.changeUserRating(userId, chatId, -20)
            ctx.reply(`Принято. Твоя @${username} постить баян - расстраивать партия. Минус порция рис`)
        } else {
            ctx.reply("Для изменения рейтинга укажите какое сообщение 'баян'")
        }
    }
})

// bot.on('message_update', (ctx) => {
//     console.log(ctx)
// })

// bot.on()

bot.launch()


process.once('SIGINT', () => {
    bot.stop('SIGINT')
    // cron.stop()
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    // cron.stop()
})
