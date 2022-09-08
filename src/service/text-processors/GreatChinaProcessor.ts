import {TextProcessor} from "../../api/TextProcessor";
import {StatePersistentProcessor} from "../processors/StatePersistentProcessor";
import {Action} from "../../api/Action";


export class GreatChinaProcessor extends StatePersistentProcessor implements TextProcessor {

    keyPhrases(): string[] {
        return [
            "великий китай",
            "великий си",
            "слава си",
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
