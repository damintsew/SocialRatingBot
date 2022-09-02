import {TextProcessor} from "../../api/TextProcessor";
import {StatePersistandProcessor} from "../retry/StatePersistandProcessor";
import {Action} from "../../api/Action";


export class BayanProcessor extends StatePersistandProcessor implements TextProcessor {

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
            new Action("Постить баян - рсатраивать Партия"),
            new Action("Минус рис", -5),
        ];
    }


    useReplyToMessage(): boolean {
        return true;
    }
}
