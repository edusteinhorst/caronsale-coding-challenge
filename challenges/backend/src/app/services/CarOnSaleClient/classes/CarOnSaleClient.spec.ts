import "reflect-metadata";
import "mocha";
import * as chai from "chai";
import { CarOnSaleClient } from "./CarOnSaleClient";

const expect = chai.expect;

describe('CarOnSaleClient', () => {

    it('should list running auctions', async () => {
        const service = new CarOnSaleClient();
        const auctions = await service.getRunningAuctions();
        expect(auctions).length.to.be.greaterThan(0);
        const sampleAuction = auctions[0];
        expect(sampleAuction).to.have.property('numBids');
        expect(sampleAuction).to.have.property('currentHighestBidValue');
        expect(sampleAuction).to.have.property('minimumRequiredAsk');
    });
});
