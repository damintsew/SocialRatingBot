import {RatingService} from "./RatingService";
import {AllahProcessor} from "./text-processors/AllahProcessor";
import {TextProcessor} from "../api/TextProcessor";
import {PutinProcessor} from "./text-processors/PutinProcessor";
import {RetryStorage} from "./processors/RetryStorage";
import {GreatChinaProcessor} from "./text-processors/GreatChinaProcessor";
import {BayanProcessor} from "./text-processors/BayanProcessor";
import {
    CommonPhrasesProcessor,
    MinusRiseProcessor,
    OffensivePhrasesProcessor,
    TaiwanProcessor
} from "./text-processors/CommonPhrasesProcessor";
import IncomeTextMessage from "../domain/IncomeTextMessage";

export class TextProcessingService {

    private readonly retryStorage = new RetryStorage();
    private ratingService: RatingService;
    private textProcessors: TextProcessor[] = []

    constructor(ratingService: RatingService) {
        this.ratingService = ratingService;

        this.textProcessors.push(new PutinProcessor());
        this.textProcessors.push(new GreatChinaProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new AllahProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new BayanProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new CommonPhrasesProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new OffensivePhrasesProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new MinusRiseProcessor(this.retryStorage, ratingService));
        this.textProcessors.push(new TaiwanProcessor(this.retryStorage, ratingService));
    }

    async processText(income: IncomeTextMessage, ctx) {
        console.log(`from = ${income.from.userId} chatId = ${income.from.chatId} message = ${income.text} `)

        const text = income.text.toLowerCase()
        try {
            for (let processor of this.textProcessors) {
                const phrases = processor.keyPhrases()

                let match = this.matchesText(phrases, text);
                if (match) {
                    processor.processRequest(income, ctx)
                    if (!processor.shouldContinue()) {
                        break;
                    }
                }
            }
        } catch (e) {
            console.error(`Error during processing text = ${text}`, e)
        }
    }

    private matchesText(phrases: string[], text: string) {
        let match = false;

        for (let keyPhrase of phrases) {
            if (text.includes(keyPhrase)) {
                match = true;
                break
            }
        }
        return match;
    }

    /*private matchesText(phrases: string[], text: string) {
        let match = true;
        let incomingWords = text.split(" ");

        for (let keyPhrase of phrases) {
            let localMatch = false;
            for (let inputWord of incomingWords) {
                if (inputWord == keyPhrase) {
                    localMatch = true;
                    break
                }
            }
            match = match && localMatch;
        }
        return match;
    }*/
}
