

export abstract class TextProcessor {

    public abstract keyPhrases(): string[]

    abstract shouldContinue(): boolean

    abstract processRequest(ctx)
}
