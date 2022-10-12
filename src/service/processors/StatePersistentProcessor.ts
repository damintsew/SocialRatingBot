import {Alert, RetryStorage} from "./RetryStorage";
import {Action, ProbabilityAction} from "../../api/Action";
import {TextProcessor} from "../../api/TextProcessor";
import {RatingService} from "../RatingService";
import moment, {Duration} from "moment/moment";
import IncomeTextMessage, {MessageProps} from "../../domain/IncomeTextMessage";


export abstract class StatePersistentProcessor implements TextProcessor {

    private retryStorage: RetryStorage
    private ratingService: RatingService

    constructor(retryStorage: RetryStorage, ratingService: RatingService) {
        this.retryStorage = retryStorage;
        this.ratingService = ratingService;
    }

    async processRequest(income: IncomeTextMessage, ctx) {
        let messageProps = this.extractUserId(income, ctx)
        if (messageProps == null) {
            return;
        }

        let alert = this.retryStorage.getBy(messageProps)
            .get(this.getActionType());

        if (alert == null) {
            alert = new Alert(messageProps, this.getActionType(), this.getAlertDuration())
        }

        let answer = this.findAnswer(alert)
        await this.processAnswer(ctx, messageProps, answer)

        alert.occasions += 1
        this.retryStorage.save(alert)
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

    // todo move to util
    private probability(value: number): boolean {
        return Math.random() < value;
    }

    abstract getActionType(): string

    abstract getActions(): Action[]

    abstract keyPhrases(): string[];

    shouldContinue(): boolean {
        return false;
    }

    protected useReplyToMessage(): boolean {
        return false;
    }

    protected getAlertDuration(): Duration {
        return moment.duration(1, 'day');
    }

    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return true;
    }

    private async processAnswer(ctx, messageProps: MessageProps, answer: Action) {
        //todo move this to better place
        if (answer instanceof ProbabilityAction) {
            if (!this.probability(answer.probability)) {
                return null;
            }
        }

        await this.ratingService.changeRating(messageProps.userId, messageProps.chatId, answer.ratingChange)
        ctx.reply(answer.text)
    }

    private extractUserId(income: IncomeTextMessage, ctx): MessageProps {
        let messageProps

        if (this.useReplyToMessage()) {
            if (income.replyTo == null) {
                if (this.shouldNotifyWhenReplyMessageNull()) {
                    ctx.reply("Указать какой сообщений! Кому давать или забирать рис!");
                }
                return null
            }
            messageProps = income.replyTo

            if (income.from.equals(income.replyTo)) {
                return ctx.reply("Хотеть набить себя рейтинг?")
            }
        } else {
            messageProps = income.from
        }

        return messageProps
    }
}
