import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    userId: number

    @Column({nullable: true, type: "bigint"})
    chatId: number

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    username: string;

    @Column({nullable: true})
    isAdmin: boolean

    @Column({nullable: true})
    lastUpdated: Date

    @Column({nullable: false, default: false})
    isBlocked: boolean

}

@Entity()
export class UserSocialRating {

    @PrimaryColumn()
    userId: number

    @Column({nullable: true, type: "bigint"})
    chatId: number

    @Column({nullable: false, type: "int"})
    socialRating: number;
}