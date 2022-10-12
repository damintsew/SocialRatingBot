import moment, {Duration} from "moment/moment";
import {MessageProps} from "../../domain/IncomeTextMessage";

export class RetryStorage {

    private storage: Map<string, Alert[]> = new Map<string, Alert[]>()

    getBy(messageProps: MessageProps): Map<string, Alert> {
        return this.get(messageProps.userId, messageProps.chatId)
    }

    get(userId: number, chatId: number): Map<string, Alert> {
        let alerts = this.storage.get(new Id(userId, chatId).hash()) || []
        let alertMap = new Map<string, Alert>();
        alerts.forEach(a => {
            let expirationTime = moment().subtract(a.duration).toDate();

            if (expirationTime.getTime() < a.lastUpdate.getTime()) {
                alertMap.set(a.actionType, a);
            }
        })
        return alertMap;
    }

    save(alert: Alert) {
        const id = Id.fromMessageProps(alert.messageProps);
        alert.lastUpdate = new Date();

        let alertsById = this.storage.get(id.hash()) || new Map<string, Alert>(); // todo find why null is here

        let existingAlert = alertsById[alert.actionType];
        if (existingAlert != null) {
            existingAlert.occasions = alert.occasions;
            existingAlert.lastUpdate = alert.lastUpdate;

            alertsById[alert.actionType] = existingAlert
        } else {
            alertsById[alert.actionType] = alert;
        }

        this.storage.set(id.hash(), Object.values(alertsById))
    }
}

class Id {
    private userId: number;
    private chatId: number;

    constructor(userId: number, chatId: number) {
        this.userId = userId;
        this.chatId = chatId;
    }
    static fromMessageProps(messageProps: MessageProps) {
        return new this(messageProps.userId, messageProps.chatId);
    }

    hash(): string {
        return this.userId.toString() + "_" + this.chatId.toString();
    }
}

export class Alert {
    constructor(messageProps: MessageProps , actionType: string, duration: Duration) {
        this.messageProps = messageProps;
        this.actionType = actionType;
        this.occasions = 1;
        this.duration = duration;
    }

    messageProps: MessageProps;
    actionType: string;
    occasions: number;
    lastUpdate: Date;
    duration: Duration; // moment.Duration(1, 'day');

}
