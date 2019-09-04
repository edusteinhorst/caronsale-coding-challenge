import axios from "axios";

export class HttpClient {

    public static async get(url: string, headers?: any): Promise<any> {
        const resp = await axios.get(url, { headers });

        if (resp.status === 200) {
            return resp.data;
        }

        throw new Error(`GET failed with code ${resp.status}: ${resp.statusText}`);
    }

    public static async putJSON(url: string, json: object, expectedStatus: number) {
        const resp = await axios.put(url, json);

        if (resp.status === expectedStatus) {
            return resp.data;
        }

        throw new Error(`PUT failed with code ${resp.status}: ${resp.statusText}`);
    }
}
