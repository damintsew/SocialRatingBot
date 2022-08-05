import {DataSource} from "typeorm";
import { env } from 'node:process';
import {User} from "../entity/User";

export const ds = new DataSource({
            type: "postgres",
            host: env.DB_HOST,
            port: 5432,
            username: "postgres",
            password: "changeme",
            database: "postgres",
            entities: [
                User //, SubsriptionData, Announcements
            ],
            synchronize: true,
            logging: true
        });
