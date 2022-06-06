import { IAsset } from "../models/coin.model";

function getBookmarks() {
    const bookmarks = new Array<IAsset>();

    for (const item of Object.values(localStorage)) {
        bookmarks.push(JSON.parse(item));
    }

    return bookmarks;
}

function storeAsset(asset: IAsset) {
    try {
        localStorage.setItem(asset.slug, JSON.stringify(asset));

        return true;
    } catch (err) {
        // Ignore.
    }

    return false;
}

function removeAsset(slug: string) {
    localStorage.removeItem(slug);
}

export default { getBookmarks, storeAsset, removeAsset };
