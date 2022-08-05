import {env} from "node:process";
import {session, Telegraf} from "telegraf";
import {ds} from "./db/data-source";
import {User} from "./entity/User";
import {MyContext} from "./domain/Domain";


const token = env.TG_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf<MyContext>(token)

bot.use(session())
// bot.use(stage.middleware())
bot.use(async (ctx, next) => {

    if (!ctx?.session.isUserSaved) {
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

            await ds.manager.save(newUser)
            ctx.session.user = newUser;
        } else {
            ctx.session.user = userFromDB;
        }
        ctx.session.isUserSaved = true;
    }

    return next()
})

bot.command('help', (ctx) => ctx.reply("/subscribe /list /unsubscribe"))
bot.on('message',
    (ctx) => ctx.reply("Для получения списка команд и моих возможностей введите /help."))

bot.launch()


process.once('SIGINT', () => {
    bot.stop('SIGINT')
    // cron.stop()
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    // cron.stop()
})
