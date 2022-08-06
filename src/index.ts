import {env} from "node:process";
import {Scenes, session, Telegraf} from "telegraf";
import {ds} from "./db/data-source";
import {User} from "./entity/User";
import {MyContext} from "./domain/Domain";
import {RatingService} from "./service/RatingService";

(async function () {
    await ds.initialize(); //todo get rid of this
})()

const ratingService = new RatingService()

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

        const userFromDB = await ds.manager.findOneBy(User, {userId: from.id});
        if (userFromDB == null) {
            //todo move to user service
            const newUser = new User();

            newUser.userId = from.id
            // @ts-ignore
            newUser.chatId = ctx.message.chat.id
            newUser.username = from.username
            newUser.firstName = from.first_name
            newUser.lastName = from.last_name

            newUser.isAdmin = from.id === 152984728;
            newUser.isBlocked = false

            await ds.manager.save(newUser)
            ctx.session.user = newUser;
        } else {
            ctx.session.user = userFromDB;
        }
        ctx.session.isUserSaved = true;
    }

    return next()
})

bot.command('help', (ctx) => ctx.reply("/oleg"))
bot.command('oleg', (ctx) => ctx.reply("Olegneochen"))

bot.on('text', async (ctx) => {
    console.log(ctx)
    if (ctx.message.text == "баян") {
        if (ctx.message.reply_to_message != null) {
            let userId = ctx.message.reply_to_message.from.id
            let username = ctx.message.reply_to_message.from.username
            let chatId = ctx.message.reply_to_message.chat.id

            await ratingService.remove(userId, chatId)
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
