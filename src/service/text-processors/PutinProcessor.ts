import {TextProcessor} from "../../api/TextProcessor";


export class PutinProcessor implements TextProcessor {

    keyPhrases(): string[] {
        return [
            "слава путину",
            "великий путин",
        ];
    }

    processRequest(ctx) {
        let replyText = "Ты че 搞砸了 ??"
        ctx.reply(replyText)
    }

    shouldContinue(): boolean {
        return false;
    }
}
