import {RatingService} from "./RatingService";
import {AllahProcessor} from "./text-processors/AllahProcessor";
import {TextProcessor} from "../api/TextProcessor";
import {PutinProcessor} from "./text-processors/PutinProcessor";

export class TextProcessingService {

    private ratingService: RatingService;
    private textProcessors: TextProcessor[] = [
        new AllahProcessor(), new PutinProcessor()]

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
        }

        const text = ctx.message.text.toLowerCase()

        for (let processor of this.textProcessors) {
            const phrases = processor.fitsProcessing()

            let match = this.matchesTest(phrases, text);

            if (match) {
                processor.processRequest(ctx)

                if (!processor.shouldContinue()) {
                    break;
                }
            }
        }
    }

    private matchesTest(phrases: string[], text: string) {
        let match = false;

        for (let keyPhrase of phrases) {
            if (text.includes(keyPhrase)) {
                match = true;
                break
            }
        }
        return match;
    }
}
