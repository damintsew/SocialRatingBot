
export abstract class Reply {

    abstract getType(): AnswerType;
    // data: any
}

export class TextReply extends Reply {


    constructor(text: string) {
        super();
        this.text = text;
    }

    getType(): AnswerType {
        return AnswerType.TEXT;
    }

    text: string
}

export class ImageTextReply extends TextReply {

    sendSeparately: boolean

    constructor(text: string, image: any, sendSeparately?: boolean) {
        super(text);
        this.imagePath = image;
        this.sendSeparately = sendSeparately
    }

    getType(): AnswerType {
        return AnswerType.IMAGE_TEXT;
    }

    imagePath: any
}

export enum AnswerType {
    TEXT, PHOTO, STICKER, IMAGE_TEXT
}
