

export class Action {

    private readonly _text: string;
    private readonly _ratingChange: number;

    constructor(text: string, ratingChange?: number) {
        this._text = text;
        this._ratingChange = ratingChange ? ratingChange : 0;
    }

    get text(): string {
        return this._text;
    }

    get ratingChange(): number {
        return this._ratingChange;
    }
}
