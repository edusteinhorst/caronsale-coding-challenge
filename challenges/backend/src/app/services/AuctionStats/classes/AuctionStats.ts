import { injectable } from "inversify";
import { IAuctionStats, IStats } from "../interfaces/IAuctionStats";
import { IAuction } from "../../CarOnSaleClient/interface/ICarOnSaleClient";

@injectable()
export class AuctionStats implements IAuctionStats {

    public getStatsFromAuctions(auctions: IAuction[]): IStats {

        return {
            numAuctions: auctions.length,
            avgNumBids: auctions.map((x: IAuction) => x.numBids).reduce((a, b) => a + b) / auctions.length,
            avgProgressRatio: auctions.map((x: IAuction) => x.currentHighestBidValue / x.minimumRequiredAsk).reduce((a, b) => a + b) / auctions.length,
        };
    }
}
