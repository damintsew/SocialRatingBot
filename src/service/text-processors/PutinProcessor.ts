import {TextProcessor} from "../../api/TextProcessor";


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

    processRequest(ctx) {
        let replyText = "Ты че 搞砸了 ??"
        ctx.reply(replyText)
    }

    shouldContinue(): boolean {
        return false;
    }
}
