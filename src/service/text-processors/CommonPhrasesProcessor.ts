import {StatePersistandProcessor} from "../retry/StatePersistandProcessor";
import {Action} from "../../api/Action";


export default class CommonPhrasesProcessor extends StatePersistandProcessor {

    getActionType(): string {
        return "COMMON_PHRASES";
    }

    getActions(): Action[] {
        return [new Action("Радовать Партия! Плюс рейтинг", 5)];
    }

    keyPhrases(): string[] {
        return [
            "спасибо",
            "ахахаха",
            "ахаха",
            "ахах",
        ];
    }


    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return false;
    }


    useReplyToMessage(): boolean {
        return true;
    }
}
