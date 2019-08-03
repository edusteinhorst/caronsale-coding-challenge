import {inject, Container, injectable} from "inversify";
import { equal, ok } from "assert";

import {ILogger} from "./services/Logger/interface/ILogger";
import {DependencyIdentifier} from "./DependencyIdentifiers";
import {ICarOnSaleClient} from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import {CarOnSaleClient} from "./services/CarOnSaleClient/classes/CarOnSaleClient";
import {IAuction} from "./services/CarOnSaleClient/interface/IAuction";
import {Auction} from "./services/CarOnSaleClient/classes/Auction";
import {AuctionMonitorApp} from "./AuctionMonitorApp";
import {fetchfn} from "./services/CarOnSaleClient/classes/AuthedFetch";
import * as fetch from "node-fetch";

@injectable()
class TestLogger implements ILogger {
    public constructor(
        @inject("allowed-messages") private messages: string[],
        private index: number = 0,
    ) { }

    public log(message: string): void {
        ok(this.index < this.messages.length,
            `superfluous message: ${message}`);
        equal(this.messages[this.index], message);
        this.index++;
    }
}

describe("AuctionMonitorApp test", () => {
    it("should return expected auction stats", async () => {
        const container = new Container({
            defaultScope: "Singleton",
        });

        container.bind<ICarOnSaleClient>(DependencyIdentifier.CLIENT).to(CarOnSaleClient);
        container.bind<IAuction>(DependencyIdentifier.AUCTION_CONSTRUCTOR).toConstructor(Auction);

        const list = [new Auction({
            currentHighestBidValue: 1234,
            minimumRequiredAsk: 789,
            numBids: 5,
        }), new Auction({
            currentHighestBidValue: 789,
            minimumRequiredAsk: 1234,
            numBids: 2,
        })];

        async function testFetch(url: fetch.RequestInfo, init?: fetch.RequestInit): Promise<fetch.Response> {
            equal(url, "auction/salesman/dumbo/_all");
            equal(init.method, "GET");
            equal(init.body, null);
            return new fetch.Response(JSON.stringify(list));
        }

        container.bind<fetchfn>(DependencyIdentifier.AUTHED_FETCH).toFunction(testFetch);

        const messages: string[] = [
            "Auction Monitor started.",
            "count: 2",
            "average bids: " + ((5 + 2)/2).toString(),
            "average progress: " + ((1234 / 789 + 789 / 1234 )/2).toString(),
        ];
        container.bind<string[]>("allowed-messages").toConstantValue(messages);
        container.bind<ILogger>(DependencyIdentifier.LOGGER).to(TestLogger);

        const app = container.resolve(AuctionMonitorApp);

        await app.start("dumbo");
    });

    it("should return only auction count == 0", async () => {
        const container = new Container({
            defaultScope: "Singleton",
        });

        container.bind<ICarOnSaleClient>(DependencyIdentifier.CLIENT).to(CarOnSaleClient);
        container.bind<IAuction>(DependencyIdentifier.AUCTION_CONSTRUCTOR).toConstructor(Auction);

        const list = [];

        async function testFetch(url: fetch.RequestInfo, init?: fetch.RequestInit): Promise<fetch.Response> {
            equal(url, "auction/salesman/dumbo/_all");
            equal(init.method, "GET");
            equal(init.body, null);
            return new fetch.Response(JSON.stringify(list));
        }

        container.bind<fetchfn>(DependencyIdentifier.AUTHED_FETCH).toFunction(testFetch);

        const messages: string[] = [
            "Auction Monitor started.",
            "count: 0",
        ];
        container.bind<string[]>("allowed-messages").toConstantValue(messages);
        container.bind<ILogger>(DependencyIdentifier.LOGGER).to(TestLogger);

        const app = container.resolve(AuctionMonitorApp);

        await app.start("dumbo");
    });

    it("should return expected auction stats with null miniumRequiredAsk", async () => {
        const container = new Container({
            defaultScope: "Singleton",
        });

        container.bind<ICarOnSaleClient>(DependencyIdentifier.CLIENT).to(CarOnSaleClient);
        container.bind<IAuction>(DependencyIdentifier.AUCTION_CONSTRUCTOR).toConstructor(Auction);

        const list = [new Auction({
            currentHighestBidValue: 1234,
            minimumRequiredAsk: null,
            numBids: 1,
        }), new Auction({
            currentHighestBidValue: 789,
            minimumRequiredAsk: null,
            numBids: 1,
        })];

        async function testFetch(url: fetch.RequestInfo, init?: fetch.RequestInit): Promise<fetch.Response> {
            equal(url, "auction/salesman/dumbo/_all");
            equal(init.method, "GET");
            equal(init.body, null);
            return new fetch.Response(JSON.stringify(list));
        }

        container.bind<fetchfn>(DependencyIdentifier.AUTHED_FETCH).toFunction(testFetch);

        const messages: string[] = [
            "Auction Monitor started.",
            "count: " + list.length.toString(),
            "average bids: " + ((1 + 1)/2).toString(),
            "average progress: " + (1).toString(),
        ];
        container.bind<string[]>("allowed-messages").toConstantValue(messages);
        container.bind<ILogger>(DependencyIdentifier.LOGGER).to(TestLogger);

        const app = container.resolve(AuctionMonitorApp);

        await app.start("dumbo");
    });

});