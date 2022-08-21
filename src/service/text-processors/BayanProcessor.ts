import {TextProcessor} from "../../api/TextProcessor";
import {RetriableProcessor} from "../retry/RetriableProcessor";
import {Action} from "../../api/Action";


export class BayanProcessor extends RetriableProcessor implements TextProcessor {

    fitsProcessing(): string[] {
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
