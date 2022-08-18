

export class RetryStorage {

    private storage: Map<string, Alert[]> = new Map<string, Alert[]>()

    get(userId: number, chatId: number): Map<string, Alert> {
        let alerts = this.storage.get(new Id(userId, chatId).hash()) || []
        let alertMap = new Map<string, Alert>();
        alerts.forEach(a => {
            alertMap.set(a.actionType, a);
        })
        return alertMap;
    }

    save(alert: Alert) {
        const id = new Id(alert.userId, alert.chatId);

        let alertsById = this.storage.get(id.hash()) || new Map<string, Alert>(); // todo find why null is here

        let existingAlert = alertsById[alert.actionType];
        if (existingAlert != null) {
            existingAlert.occasions = alert.occasions;
            alertsById[alert.actionType] = existingAlert
        } else {
            alertsById[alert.actionType] = alert;
        }
        console.log("228=" + alertsById.values())
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

    hash(): string {
        return this.userId.toString() + "_" + this.chatId.toString();
    }
}

export class Alert {
    constructor(userId: number, chatId: number, actionType: string) {
        this.userId = userId;
        this.chatId = chatId;
        this.actionType = actionType;
        this.occasions = 1;
    }

    userId: number;
    chatId: number;
    actionType: string;
    occasions: number
}
