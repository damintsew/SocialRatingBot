import {TextProcessor} from "../../api/TextProcessor";


export class GreatChinaProcessor implements TextProcessor {

    fitsProcessing(): string[] {
        return [
            "великий китай",
            "великий си",
            "китай великий",
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
