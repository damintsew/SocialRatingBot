
export interface Reply {

    getType(): AnswerType;
}

export class TextReply implements Reply {

    constructor(text: string) {
        this.text = text;
    }

    getType(): AnswerType {
        return AnswerType.TEXT;
    }

    text: string
}

export class ImageTextReply extends TextReply implements Reply{

    sendSeparately: boolean
    imagePath: any

    constructor(text: string, image: any, sendSeparately?: boolean) {
        super(text);
        this.imagePath = image;
        this.sendSeparately = sendSeparately
    }

    getType(): AnswerType {
        return AnswerType.IMAGE_TEXT;
    }
}

export enum AnswerType {
    TEXT, PHOTO, STICKER, IMAGE_TEXT
}
