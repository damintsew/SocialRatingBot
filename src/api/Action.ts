

export class Action {

    private readonly _text: string[];
    private readonly _ratingChange: number;

    constructor(text: string | string[], ratingChange?: number) {
        if (text instanceof Array) {
            this._text = text
        } else {
            this._text = [text];
        }
        this._ratingChange = ratingChange ? ratingChange : 0;
    }

    get text(): string {
        const len = this._text.length
        if (len == 1) {
            return this._text[0];
        }
        return this._text[this.rand(len - 1)];
    }

    get ratingChange(): number {
        return this._ratingChange;
    }

    private rand(max: number): number {
        return Math.floor(Math.random() * max) + 1;
    }
}
