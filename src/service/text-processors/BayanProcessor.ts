import {TextProcessor} from "../../api/TextProcessor";
import {StatePersistentProcessor} from "../processors/StatePersistentProcessor";
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
            new Action(["Минус рис", "Искать годный контент!"], -5),
        ];
    }

    useReplyToMessage(): boolean {
        return true;
    }
}
