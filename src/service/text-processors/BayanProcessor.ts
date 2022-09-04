import {TextProcessor} from "../../api/TextProcessor";
import {StatePersistentProcessor} from "../retry/StatePersistentProcessor";
import {Action} from "../../api/Action";


export class BayanProcessor extends StatePersistentProcessor implements TextProcessor {

    keyPhrases(): string[] {
        return [
            "баян",
        ];
    }

    getActionType(): string {
        return "BAYAN_ALERT";
    }

    getActions(): Action[] {
        return [
            new Action([
                "Постить баян - рсатраивать Партия",
                "Твоя деятельность расстраивает Партия!"
            ]),
            new Action("Минус рис", -5),
        ];
    }

    useReplyToMessage(): boolean {
        return true;
    }
}
