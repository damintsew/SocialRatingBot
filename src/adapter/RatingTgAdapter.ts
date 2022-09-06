import {RatingService} from "../service/RatingService";
import {DomainToTgMapper} from "../service/mapper/DomainToTgMapper";
import {Telegraf} from "telegraf";

export class RatingTgAdapter {
    constructor(ratingService: RatingService, bot: Telegraf) {
        this.ratingService = ratingService;
        this.bot = bot;
    }

    private ratingService: RatingService;
    private readonly bot: Telegraf;
    private mapper: DomainToTgMapper = new DomainToTgMapper(); // todo maybe remove from here ?

    async prepareRatingMessage(ctx) {
        let replies = await this.ratingService.prepareRatingMessage(ctx.message.chat.id)
        await this.mapper.map(ctx, replies)
    }

    async prepareRatingMessageForChat() {
        // todo move to better place? RatingManager ?
        // let chatId = 152984728 // todo remove hardcode
        let chatId = -1001085907838 // todo remove hardcode
        let replyMessage = await this.ratingService.prepareRatingMessage(chatId)
        await this.mapper.map2(this.bot, chatId, replyMessage);
    }
}
