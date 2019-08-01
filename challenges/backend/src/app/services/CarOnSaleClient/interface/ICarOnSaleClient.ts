/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    getRunningAuctions(): Promise<void /* TODO: Introduce a type */>;

}
