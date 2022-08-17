

export abstract class TextProcessor {

    public abstract fitsProcessing(): string[]

    abstract shouldContinue(): boolean

    abstract processRequest(ctx)
}
