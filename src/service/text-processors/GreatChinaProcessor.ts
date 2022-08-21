import {TextProcessor} from "../../api/TextProcessor";
import {RetriableProcessor} from "../retry/RetriableProcessor";
import {Action} from "../../api/Action";


export class GreatChinaProcessor extends RetriableProcessor implements TextProcessor {

    fitsProcessing(): string[] {
        return [
            "великий китай",
            "великий си",
            "китай великий",
            "китай велик",
            "слава партии",
        ];
    }

    getActionType(): string {
        return "GREAT_CHINA";
    }

    getActions(): Action[] {
        return [
            new Action("Твоя славить великий Китай! Твоя получать одобрение партия!", 5),
            new Action("Ты пользовать партия благоделель? Твоя прекращать! Партия будет наказать тебя!"),
            new Action("Ты гневать партия! Партия давать рейтинг - Партия забирать! (с) Великий Си", -5),
        ];
    }
}