import "reflect-metadata";
import "mocha";
import * as chai from "chai";
import { AuctionStats } from "./AuctionStats";
import { IAuction } from "../../CarOnSaleClient/interface/ICarOnSaleClient";

const expect = chai.expect;

describe('AuctionStats', () => {

    it('should calculate aggregate stats for auctions', async () => {
        const mockAuctions: IAuction[] = [
            {
                currentHighestBidValue: 10,
                minimumRequiredAsk: 20,
                numBids: 5,
            },
            {
                currentHighestBidValue: 20,
                minimumRequiredAsk: 20,
                numBids: 10,
            },
        ];
        const service = new AuctionStats();
        const stats = await service.getStatsFromAuctions(mockAuctions);
        expect(stats.numAuctions).eq(2);
        expect(stats.avgNumBids).eq(7.5);
        expect(stats.avgProgressRatio).eq(0.75);
    });
});
