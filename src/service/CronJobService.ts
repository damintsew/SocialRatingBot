import {CronJob} from 'cron';
import {RatingService} from "./RatingService";
import {RatingTgAdapter} from "./RatingTgAdapter";

export class CronJobService {

    cronJob: CronJob;
    ratingTgAdapter: RatingTgAdapter;

    constructor(ratingTgAdapter: RatingTgAdapter) {
        this.ratingTgAdapter = ratingTgAdapter;
        this.cronJob = new CronJob('0 0 10 * * *', async () => {
            try {
                await this.action();
            } catch (e) {
                console.error(e);
            }
        });
    }

    async action(): Promise<void> {
        console.log("22 Job start")
        await this.ratingTgAdapter.prepareRatingMessageForChat();

        console.log("22 Job end")


    }

    start() {
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    }

    stop() {
        if (this.cronJob.running) {
            this.cronJob.stop();
        }
    }
}
