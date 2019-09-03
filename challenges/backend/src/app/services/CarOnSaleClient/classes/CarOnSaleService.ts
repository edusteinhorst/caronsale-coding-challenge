import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";

export class CarOnSaleService implements ICarOnSaleClient {
    public async getRunningAuctions(): Promise<any> {
        return new Promise((resolve, reject) => {
            return resolve([]);
        });
    }
}