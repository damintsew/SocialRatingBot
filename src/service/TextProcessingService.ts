import {RatingService} from "./RatingService";

export class TextProcessingService {

    private ratingService: RatingService;

    constructor(ratingService: RatingService) {
        this.ratingService = ratingService;
    }

    async processText(ctx) {
        console.log(ctx)
        if (ctx.message.text.toLowerCase() == "баян") {
            if (ctx.message.reply_to_message != null) {
                let userId = ctx.message.reply_to_message.from.id
                let chatId = ctx.message.reply_to_message.chat.id
                ctx.reply(await this.ratingService.changeRating(userId, chatId, -20))
            } else {
                ctx.reply("Для изменения рейтинга укажите какое сообщение 'баян'")
            }
        } else if (ctx.message.text.toLowerCase().includes("аллах")) {
            let replyText = "你是一头脏猪 уйгур!! Хотеть попадать концлагерь?"
            ctx.reply(replyText)
        }
    }
}
