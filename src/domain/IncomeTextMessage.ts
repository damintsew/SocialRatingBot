
export default class IncomeTextMessage {
    from: MessageProps
    replyTo: MessageProps | undefined

    text: string // todo make inheritance
}


export class MessageProps {
    constructor(messageProps: MessageProps) {
        this.userId = messageProps.userId
        this.chatId = messageProps.chatId
    }

    userId: number
    chatId: number

    hash(): string {
        return this.userId.toString() + "_" + this.chatId.toString();
    }

    equals(other: MessageProps) {
        return this.userId === other.userId && this.chatId === other.chatId;
    }
}
