import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: "bigint"})
    chatId: string;

    @ManyToOne(() => User)
    user: User

    @Column({type: "text"})
    text: string

    @Column({nullable: true, type: "bigint"})
    tgMessageId: string;

    @Column({nullable: true})
    date: Date;

}
