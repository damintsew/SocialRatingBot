import {StatePersistentProcessor} from "../retry/StatePersistentProcessor";
import {Action} from "../../api/Action";


export class CommonPhrasesProcessor extends StatePersistentProcessor {

    getActionType(): string {
        return "COMMON_PHRASES";
    }

    getActions(): Action[] {
        return [new Action("Радовать Партия! Плюс рейтинг", 5)];
    }

    keyPhrases(): string[] {
        return [
            "спасибо",
            "спасиб",
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

export class OffensivePhrasesProcessor extends StatePersistentProcessor {

    getActionType(): string {
        return "OFFENSIVE_PHRASES";
    }

    getActions(): Action[] {
        return [new Action([
            "Ничтожество! Минус рис!",
            "Твоя прекращать!"], -10)];
    }

    keyPhrases(): string[] {
        return [
            "винни пух",
            "вини пух",
            "чертов китай",
            "грязные китайцы",
            "чертова партия",
        ];
    }

    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return false;
    }

    useReplyToMessage(): boolean {
        return true;
    }
}
