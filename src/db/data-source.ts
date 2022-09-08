import {DataSource} from "typeorm";
import { env } from 'node:process';
import {User, UserSocialRating} from "../entity/User";
import {Message} from "../entity/Message";

export const dataSource = new DataSource({
            type: "postgres",
            host: env.DB_HOST,
            port: 5432,
            username: "postgres",
            password: "changeme",
            database: "social_rating",
            entities: [
                User, UserSocialRating, Message
            ],
            synchronize: true,
            logging: true
        });
