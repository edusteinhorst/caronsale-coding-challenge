import * as chai from "chai";
import "mocha";
import { CarOnSaleService } from "./CarOnSaleService";

const expect = chai.expect;

describe('CarOnSale Service', () => {
    it('should list running auctions', async () => {
        const service = new CarOnSaleService();
        const auctions = await service.getRunningAuctions();
        expect(auctions).length.to.be.greaterThan(0);
    });
});