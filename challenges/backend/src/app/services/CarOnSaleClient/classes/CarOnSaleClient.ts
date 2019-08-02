import {inject, injectable, interfaces} from "inversify";
import {ILogger} from "../../Logger/interface/ILogger";
import {ICarOnSaleClient} from "../interface/ICarOnSaleClient";
import {DependencyIdentifier} from "../../../DependencyIdentifiers";
import "reflect-metadata";
import {createHash} from "crypto";
import fetch from "node-fetch";
import {IAuction} from "../interface/IAuction";
import * as jwt from "jsonwebtoken";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.AUCTION_CONSTRUCTOR) private Auction: interfaces.Newable<IAuction>,
    ) { }

    private hashPasswordWithCycles(plainTextPassword: string, cycles: number): string {
        let hash = `${plainTextPassword}`;

        for(let i = 0; i < cycles; i++) {
            const sha512 = createHash("sha512");
            sha512.update(hash);
            hash = sha512.digest("hex");
        }

        return hash;
    }

    public async getRunningAuctions(): Promise<IAuction[]> {
        const hashpass = this.hashPasswordWithCycles("123test", 5);
        const user = encodeURIComponent("salesman@random.com");
        const headers = {
            "Accept": "application/json",
            "User-Agent": "caronsale-coding-challenge",
        };

        const base = "https://caronsale-backend-service-dev.herokuapp.com/api/v1/";

        const authResponse = await fetch(base + "authentication/" + user, {
            method: "PUT",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: hashpass,
                meta: "",
            }),
        });

        const auth = await authResponse.json();

        const response = await fetch(base + "auction/salesman/" + user + "/_all", {
            method: "GET",
            headers: {
                ...headers,
                userid: "salesman@random.com",
                authtoken: auth.token,
            },
        });
        const list = await response.json();

        return list.map((auction: object) => new this.Auction(auction));
    }

}
