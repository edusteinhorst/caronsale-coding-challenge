import "reflect-metadata";
import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { IAuctionStats } from "./services/AuctionStats/interfaces/IAuctionStats";
import { DependencyIdentifier } from "./DependencyIdentifiers";

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT) private carOnSaleClient: ICarOnSaleClient,
        @inject(DependencyIdentifier.AUCTION_STATS) private auctionStats: IAuctionStats) {
    }

    public async start(): Promise<void> {
        this.logger.info(`Auction Monitor started.`);

        try {
            const auctions = await this.carOnSaleClient.getRunningAuctions();
            const stats = this.auctionStats.getStatsFromAuctions(auctions);
            this.logger.info(`Number of auctions     : ${stats.numAuctions}`);
            this.logger.info(`Average number of bids : ${stats.avgNumBids.toFixed(2)}`);
            this.logger.info(`Average progess ratio  : ${(stats.avgProgressRatio * 100).toFixed(2)}%`);
        } catch (error) {
            process.exitCode = -1;
            this.logger.error(error.message);
        }
    }
}
