import IncomeTextMessage from "../domain/IncomeTextMessage";


export abstract class TextProcessor {

    public abstract keyPhrases(): string[]

    abstract shouldContinue(): boolean

    abstract processRequest(income: IncomeTextMessage, ctx)
}
