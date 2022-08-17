import {CronJob} from 'cron';
import {RatingService} from "./RatingService";

export class CronJobService {

    cronJob: CronJob;
    ratingService: RatingService;

    constructor(ratingService: RatingService) {
        this.ratingService = ratingService;
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
        await this.ratingService.printRatingAll_Z();

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
