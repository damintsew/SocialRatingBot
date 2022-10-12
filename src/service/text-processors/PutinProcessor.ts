import {TextProcessor} from "../../api/TextProcessor";
import IncomeTextMessage from "../../domain/IncomeTextMessage";


export class PutinProcessor implements TextProcessor {

    keyPhrases(): string[] {
        return [
            "аве путин",
            "аве путину",
            "слава путину",
            "великий путин",
            "путин - россия",
            "путин - россия",
            "путин это россия",
        ];
    }

    processRequest(_income: IncomeTextMessage, ctx) {
        let replyText = "Ты че 搞砸了 ??"
        ctx.reply(replyText)
    }

    shouldContinue(): boolean {
        return false;
    }
}
