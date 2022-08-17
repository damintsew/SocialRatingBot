import {TextProcessor} from "../../api/TextProcessor";


export class AllahProcessor implements TextProcessor {

    fitsProcessing(): string[] {
        return [
            "аллах велик",
            "слава аллаху",
            "аллах акбар",
        ];
    }

    processRequest(ctx) {
        let replyText = "你是一头脏猪 уйгур!! Хотеть попадать концлагерь?"
        ctx.reply(replyText)
    }

    shouldContinue(): boolean {
        return false;
    }
}
