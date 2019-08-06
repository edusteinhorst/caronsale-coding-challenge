import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { sha512 } from 'js-sha512';

import { ICarOnSaleClient } from '../interfaces';
import { BuildURLConfig, LoginResponseType } from '../types';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';

import { ILogger } from '../../Logger/interface/ILogger';
import APIClient from '../../APIClient/classes/APIClient';

const { LOGGER } = DependencyIdentifier;

@injectable()
export default class CarOnSaleClient implements ICarOnSaleClient {
  private _apiClient: APIClient;
  private _logger: ILogger;
  private readonly _baseURL: string =
    'caronsale-backend-service-dev.herokuapp.com/api/v1';
  private readonly _auctionsURL: string = '/auction/salesman/';
  private readonly _loginURL: string = '/authentication';

  constructor(@inject(LOGGER) logger: ILogger) {
    this._logger = logger;
    this._apiClient = APIClient.getInstance(this._baseURL);
  }

  private buildURL(param: string, config: BuildURLConfig): string {
    const { login } = config;
    const url: string = login
      ? `${this._loginURL}/${param}`
      : `${this._auctionsURL}/${param}/_count`;

    return url;
  }

  hashString(str: string, cycles: number): string {
    let hash = str;

    for (let index = 0; index < cycles; index++) {
      hash = sha512(hash);
    }

    return hash;
  }

  async getRunningAuctions(
    userMailId: string,
    userId: string,
    token: string
  ): Promise<Array<any>> {
    const url = this.buildURL(userMailId, { getAuctions: true });

    const {
      data: { auctions }
    } = await this._apiClient.get(url, {
      headers: { [userId]: token }
    });

    return auctions;
  }

  async loginSalesman(email: string, hash: string): Promise<LoginResponseType> {
    const url = this.buildURL(email, { login: true });
    const { data } = await this._apiClient.put({ password: hash }, url);

    const { token, userId } = data;
    const loginResponse: LoginResponseType = { token, userid: userId };

    return loginResponse;
  }
}
