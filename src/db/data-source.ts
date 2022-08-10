import {DataSource} from "typeorm";
import { env } from 'node:process';
import {User, UserSocialRating} from "../entity/User";

export const dataSource = new DataSource({
            type: "postgres",
            host: env.DB_HOST,
            port: 5432,
            username: "postgres",
            password: "changeme",
            database: "postgres",
            entities: [
                User, UserSocialRating
            ],
            synchronize: true,
            logging: true
        });
