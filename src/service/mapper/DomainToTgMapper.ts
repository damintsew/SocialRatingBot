import {AnswerType, ImageTextReply, Reply, TextReply} from "../../api/Reply";
import {Telegraf} from "telegraf";

export class DomainToTgMapper {

    // todo extract to separate place
    async map(ctx, responses: Reply[]) {
        for (const reply of responses) {
            if (reply.getType() == AnswerType.TEXT && reply instanceof TextReply) {
                await ctx.reply(reply.text)
            } else if (reply.getType() == AnswerType.IMAGE_TEXT && reply instanceof ImageTextReply) {
                if (reply.sendSeparately) {
                    await ctx.reply(reply.text)
                    await ctx.replyWithPhoto({
                        source: "images/" + reply.imagePath,
                    })
                } else {
                    await ctx.replyWithPhoto({
                        source: "images/" + reply.imagePath,
                    }, {caption: reply.text})
                }
            }
        }
    }

    // todo extract to separate place
    async map2(bot: Telegraf, chatId: number, responses: Reply[]) {
        for (const reply of responses) {
            if (reply.getType() == AnswerType.TEXT && reply instanceof TextReply) {
                await bot.telegram.sendMessage(chatId, reply.text)
            } else if (reply.getType() == AnswerType.IMAGE_TEXT && reply instanceof ImageTextReply) {
                await bot.telegram.sendPhoto(chatId, {
                    source: "images/image_sexy_man.jpeg",
                })
                if (reply.sendSeparately) {
                    await bot.telegram.sendMessage(chatId, reply.text)
                    await bot.telegram.sendPhoto(chatId, {
                        source: "images/" + reply.imagePath,
                    })
                } else {
                    await bot.telegram.sendPhoto(chatId, {
                        source: "images/" + reply.imagePath,
                    }, {caption: reply.text})
                }
            }
        }
    }
}
