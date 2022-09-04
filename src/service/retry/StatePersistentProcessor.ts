import {Alert, RetryStorage} from "./RetryStorage";
import {Action} from "../../api/Action";
import {TextProcessor} from "../../api/TextProcessor";
import {RatingService} from "../RatingService";

export abstract class StatePersistentProcessor implements TextProcessor {

    private retryStorage: RetryStorage
    private ratingService: RatingService

    constructor(retryStorage: RetryStorage, ratingService: RatingService) {
        this.retryStorage = retryStorage;
        this.ratingService = ratingService;
    }

    async processRequest(ctx) {
        let [userId, chatId] = this.extractUserId(ctx)

        let alert = this.retryStorage.get(userId, chatId)
            .get(this.getActionType());

        if (alert == null) {
            alert = new Alert(userId, chatId, this.getActionType())
        }

        let answer = this.findAnswer(alert)
        await this.processAnswer(ctx, userId, chatId, answer)

        alert.occasions += 1
        this.retryStorage.save(alert)
    }

    private async processAnswer(ctx, userId: number, chatId: number, answer: Action) {
        if (answer.text) {
            await this.ratingService.changeRating(userId, chatId, answer.ratingChange)
            ctx.reply(answer.text)
        }
    }

    abstract getActionType(): string

    abstract getActions(): Action[]

    abstract keyPhrases(): string[];

    shouldContinue(): boolean {
        return false;
    }

    useReplyToMessage(): boolean {
        return false;
    }

    private findAnswer(alert): Action {
        let availableActions = this.getActions()

        if (availableActions.length == 1) {
            return availableActions[0]
        }
        if (availableActions.length <= alert.occasions) {
            return availableActions[availableActions.length - 1]
        }
        return availableActions[alert.occasions - 1]
    }

    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return true;
    }

    private extractUserId(ctx) {
        let userId: string;
        let chatId: string;

        if (this.useReplyToMessage()) {
            if (ctx.message.reply_to_message == null) {
                if (this.shouldNotifyWhenReplyMessageNull()) {
                    return ctx.reply("Указать какой сообщений! Кому давать или забирать рис!");
                } else {
                    return
                }
            }
            userId = ctx.message.reply_to_message.from.id
            chatId = ctx.message.reply_to_message.chat.id

            if (userId === ctx.message.from.id && chatId === ctx.message.chat.id) {
                return ctx.reply("Хотеть набить себя рейтинг?")
            }
        } else {
            userId = ctx.message.from.id
            chatId = ctx.message.chat.id
        }

        return [userId, chatId]
    }
}
