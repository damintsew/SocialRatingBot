import {Entity, Column, PrimaryColumn, Unique, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn({type: "bigint"})
    userId: string;

    @Column({nullable: true, type: "bigint"})
    chatId: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    username: string;

    @Column({nullable: true})
    isAdmin: boolean;

    @Column({nullable: true})
    lastUpdated: Date;

    @Column({nullable: false, default: false})
    isBlocked: boolean;

}

@Entity()
@Unique(["userId", "chatId"])
export class UserSocialRating {

    @PrimaryGeneratedColumn()
    userRatingId: number;

    @Column({nullable: true, type: "bigint"})
    userId: string;

    @Column({nullable: true, type: "bigint"})
    chatId: string;

    @Column({nullable: true})
    socialRating: number;
}
