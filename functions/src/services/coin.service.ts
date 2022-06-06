import axios from "axios";
import config from "../config";
import { IAsset, IStatus } from "../models/coin.model";

const coinApiIconUrl = "https://s2.coinmarketcap.com/static/img/coins/128x128/{id}.png";
const headers = {
    Accept: "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CMC_PRO_API_KEY": config.coinApiKey as string,
};

async function getAssets(start = 1, limit = 100) {
    // Limit parameters.
    if (start <= 0) start = 1;
    if (limit > 100) limit = 100;

    let assets = new Array<IAsset>();
    try {
        const { data } = await axios.get<{ data: IAsset[]; status: IStatus }>(
            `${config.coinApiUrl}/cryptocurrency/listings/latest`,
            {
                headers,
                params: { start, limit },
            },
        );

        // Assign icon URL to each asset.
        assets = data.data.map((asset) => {
            asset.icon = coinApiIconUrl.replace("{id}", asset.id.toString());

            return asset;
        });
    } catch (err) {
        console.error(err);
    }

    return assets;
}

export default { getAssets };
