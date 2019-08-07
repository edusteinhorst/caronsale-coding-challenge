import {injectable} from "inversify";
import "reflect-metadata";
import { IAuction } from "../interface/IAuction";

@injectable()
export class Auction implements IAuction {

    public constructor(public numBids, public minimumRequiredAsk, public currentHighestBidValue, public numAuctions) {
        this.numBids = numBids;
        this.minimumRequiredAsk = minimumRequiredAsk;
        this.currentHighestBidValue = currentHighestBidValue;
        this.numAuctions = numAuctions;
    }

    public getAvgPercentAuctionsProgress(): number {
        const avgPercentage = this.minimumRequiredAsk ? (this.currentHighestBidValue / this.minimumRequiredAsk) * 100 : 0;
        // round number to 2 decimals place
        return Math.round(avgPercentage * 100) / 100;
    }
    public getAvgNumberBids(): number {
        return this.numBids/this.numAuctions;
    }
}
