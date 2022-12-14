import {TextProcessor} from "../../api/TextProcessor";
import {StatePersistentProcessor} from "../processors/StatePersistentProcessor";
import {Action} from "../../api/Action";


export class AllahProcessor extends StatePersistentProcessor implements TextProcessor {

    keyPhrases(): string[] {
        return [
            "аллах",
            "аллах велик",
            "слава аллаху",
            "аллах акбар",
        ];
    }

    getActionType(): string {
        return "ALLAH_ALERT";
    }

    getActions(): Action[] {
        return [
            new Action("你是一头脏猪 уйгур!! Хотеть попадать концлагерь?"),
            new Action("Ты, 动物爱好者, продолжаешь?!!"),
            new Action("Последний предупреждать!"),
            new Action("Минус рейтинг, 猪!", -10),
        ];
    }
}
