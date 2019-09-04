import { IAuction } from "../../CarOnSaleClient/interface/ICarOnSaleClient";

/**
 * Auction statistic.
 */
export interface IStats {

    numAuctions: number;
    avgNumBids: number;
    avgProgressRatio: number;
}

/**
 * Statistics service for CarOnSale auctions.
 */
export interface IAuctionStats {

    getStatsFromAuctions(auctions: IAuction[]): IStats;
}

