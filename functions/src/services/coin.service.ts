import axios from "axios";
import config from "../config";
import { IAsset, IStatus } from "../models/coin.model";
import FirestoreService from "./firestore";

const firestore = new FirestoreService<IAsset>("bookmarks");
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

    // const params = bookmarks ? { filter_asset_id: bookmarks.join(";") } : undefined;

    // let assets = await getAll();

    // Fetch assets from API if none stored to save request quota :P
    // TODO: Fetch assets if stored assets are older than x hours/days.
    // if (assets.length === 0) {
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

async function getBookmarks() {
    const snapshot = await firestore.getAll();

    return snapshot.map((s) => s.data() as IAsset);
}

async function storeAsset(asset: IAsset) {
    try {
        await firestore.create(asset, asset.slug);
        return true;
    } catch (err) {
        // Ignore.
    }

    return false;
}

function removeAsset(slug: string) {
    return firestore.remove(slug);
}

export default { getAssets, getBookmarks, storeAsset, removeAsset };
