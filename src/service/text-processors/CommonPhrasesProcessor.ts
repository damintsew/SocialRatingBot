import {StatePersistentProcessor} from "../processors/StatePersistentProcessor";
import {Action} from "../../api/Action";


export class CommonPhrasesProcessor extends StatePersistentProcessor {

    getActionType(): string {
        return "COMMON_PHRASES";
    }

    getActions(): Action[] {
        return [new Action(["Радовать Партия! Плюс рейтинг",
            "👍", "❤️"], 5)];
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
            "Ничтожество! Минус рис!", "Твоя прекращать!"], -10)];
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

export class MinusRiseProcessor extends StatePersistentProcessor {

    getActionType(): string {
        return "MINUS_RISE";
    }

    getActions(): Action[] {
        return [new Action([
            "Кому ?",
            "Кому ? Кому ?"])];
    }

    keyPhrases(): string[] {
        return [
            "минус рис",
        ];
    }

    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return false;
    }

    useReplyToMessage(): boolean {
        return true;
    }
}

export class TaiwanProcessor extends StatePersistentProcessor {

    getActionType(): string {
        return "TAIWAN";
    }

    getActions(): Action[] {
        return [
            new Action(["Твоя поддерживать тайвань !?"]),
            new Action(["Тайвань есть Китай! Китай есть Тайвань! Минус рис!"], -10),
        ];
    }

    keyPhrases(): string[] {
        return [
            "свободный тайвань",
            "тайвань не китай",
            "тайвань не принадлежит китаю",
        ];
    }

    protected shouldNotifyWhenReplyMessageNull(): boolean {
        return false;
    }

    useReplyToMessage(): boolean {
        return true;
    }
}
