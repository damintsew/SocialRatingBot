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

async function changeRating(userId: number, chatId: number, ratingValue: number){
    const userWithRating = await ratingService.getUser(userId, chatId);
    const user = await userService.getUser(userId, chatId);
    if (userWithRating == null) {
        await ratingService.addUserSocialRating(userId, chatId);
    } 
    await ratingService.changeUserRating(userId, chatId, ratingValue);
    if(ratingValue < 0){
        return `Принято. Твоя ${user.firstName} постить баян - расстраивать партия. Минус порция рис`;
    }else{
        return `Твоя ${user.firstName} радовать Си. Плюс порция рис`;
    }
}

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

// bot.command('help', (ctx) => ctx.reply("/oleg"))
// bot.command('oleg', (ctx) => ctx.reply("Olegneochen"))

bot.command('rating', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id
    const user = await userService.getUser(userId, chatId);
    const userRating = await ratingService.getUser(userId, chatId);
    if (userRating != null){
        ctx.reply(`${user.firstName} твой рейтинг ${userRating.socialRating}`)
    }
    else {
        await ratingService.addUserSocialRating(userId, chatId);
        ctx.reply(`${user.firstName} твой рейтинг 100`)
    }
});


bot.on('text', async (ctx) => {
    console.log(ctx)
    if (ctx.message.text == "баян") {
        if (ctx.message.reply_to_message != null) {
            let userId = ctx.message.reply_to_message.from.id
            let chatId = ctx.message.reply_to_message.chat.id
            ctx.reply(await changeRating(userId, chatId, -20))
        } else {
            // ctx.reply("Для изменения рейтинга укажите какое сообщение 'баян'")
            let userId = ctx.message.from.id
            let chatId = ctx.message.chat.id
            ctx.reply(await changeRating(userId, chatId, -20))
        }
    }
    // const allUsers = await ratingService.getUsers();
    // console.log(allUsers)
})

bot.on('sticker', async (ctx) => {
    console.log(ctx);
    if(ctx.message.sticker != null){
        let userId = ctx.message.from.id
        let chatId = ctx.message.chat.id
        switch (ctx.message.sticker.emoji){
            case '👎': {
                ctx.reply(await changeRating(userId, chatId, -20))
            }
            default: {
                ctx.reply(await changeRating(userId, chatId, 20))
            }
        }
    }
});

bot.launch()


process.once('SIGINT', () => {
    bot.stop('SIGINT')
    // cron.stop()
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM')
    // cron.stop()
})
