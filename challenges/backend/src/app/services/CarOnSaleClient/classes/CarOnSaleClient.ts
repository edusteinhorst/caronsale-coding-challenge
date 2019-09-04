import { injectable } from "inversify";
import { createHash } from "crypto";
import { HttpClient } from "../../../utils/HttpClient";
import { ICarOnSaleClient, IAuction } from "../interface/ICarOnSaleClient";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    private RUNNING_AUCTIONS_URL = `${process.env.API_BASE_URL}/auction/salesman/${process.env.API_USER}/_all`;
    private AUTH_URL = `${process.env.API_BASE_URL}/authentication/${process.env.API_USER}`;
    private PWD_HASH_CYCLES = 5;
    private authHeaders: object;

    private hashPasswordWithCycles(plainTextPassword: string, cycles: number): string {
        let hash = `${plainTextPassword}`;

        for (let i = 0; i < cycles; i++) {
            hash = createHash('sha512').update(hash).digest('hex');
        }

        return hash;
    }

    private async getAuthHeaders(userId: string, userPassword: string): Promise<object> {
        const password = this.hashPasswordWithCycles(userPassword, this.PWD_HASH_CYCLES);

        return {
            userId,
            authtoken: (await HttpClient.putJSON(this.AUTH_URL, { password }, 201)).token,
        };
    }

    public async getRunningAuctions(): Promise<IAuction[]> {
        if (!this.authHeaders) {
            this.authHeaders = await this.getAuthHeaders(process.env.API_USER, process.env.API_PWD);
        }

        const filter = {
            limit: Number.MAX_SAFE_INTEGER,
            offset: 0,
        };

        const items = await HttpClient.get(`${this.RUNNING_AUCTIONS_URL}?filter=${JSON.stringify(filter)}`, this.authHeaders) as IAuction[];

        return items.map((item: IAuction) => ({
            numBids: item.numBids,
            currentHighestBidValue: item.currentHighestBidValue,
            minimumRequiredAsk: item.minimumRequiredAsk,
        } as IAuction));
    }
}
