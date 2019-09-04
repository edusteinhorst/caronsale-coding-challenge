/**
 * Individual auction from CarOnSale API.
 */
export interface IAuction {

    numBids: number;
    currentHighestBidValue: number;
    minimumRequiredAsk: number;
}

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    getRunningAuctions(): Promise<IAuction[]>;
}
