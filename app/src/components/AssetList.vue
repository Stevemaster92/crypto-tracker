<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getHeaders } from "../helpers";
import { IAsset } from "../models/coin.model";
import Asset from "./Asset.vue";
import AlertMessage from "./AlertMessage.vue";
import LoadingBar from "./LoadingBar.vue";
import Pagination from "./Pagination.vue";
import SearchAndSort from "./SearchAndSort.vue";

let assets = ref<IAsset[]>();
let filtered = ref<IAsset[]>();
let bookmarks = ref<IAsset[]>();

const error = ref(false);
const search = ref("");
const sort = ref("cmc_rank");
const order = ref("asc");

const searchBy = (searchString: string) => {
    search.value = searchString.toLowerCase();

    filtered.value = assets.value?.filter((asset) => {
        return asset.name.toLowerCase().includes(search.value) || asset.symbol.toLowerCase().includes(search.value);
    });
};

const sortBy = (sortString: string, orderString: string) => {
    sort.value = sortString;
    order.value = orderString;

    filtered.value = filtered.value?.sort((a, b) => {
        let l, r;
        // Determine correct sort order.
        if (orderString === "asc") {
            l = a as any;
            r = b as any;
        } else {
            l = b as any;
            r = a as any;
        }

        if (sortString === "name") {
            // Compare strings.
            return l[sortString].localeCompare(r[sortString]);
        }

        if (sortString === "date_added") {
            // Compare dates.
            return new Date(l[sortString]) < new Date(r[sortString]);
        }

        // Compare numbers.
        if (sortString.includes(".")) {
            const [prefix, suffix] = sortString.split(".");

            return l[prefix]["USD"][suffix] - r[prefix]["USD"][suffix];
        }

        return l[sortString] - r[sortString];
    });
};

const getAssets = (start = 0, limit = 50) => {
    getAuth()
        .currentUser?.getIdToken(true)
        .then(async (token) => {
            error.value = false;

            try {
                const { data } = await axios.get<IAsset[]>(`${import.meta.env.VITE_API_URL}/coin/assets`, {
                    headers: getHeaders(token),
                    params: { start: start * limit + 1, limit },
                });
                assets.value = data;

                searchBy(search.value);
                sortBy(sort.value, order.value);
            } catch (err) {
                console.log(err);
                error.value = true;
            }
        })
        .catch(console.error);
};

const getBookmarks = () => {
    getAuth()
        .currentUser?.getIdToken(true)
        .then(async (token) => {
            error.value = false;

            try {
                const { data } = await axios.get<IAsset[]>(`${import.meta.env.VITE_API_URL}/coin/bookmarks`, {
                    headers: getHeaders(token),
                });
                bookmarks.value = data;

                // searchBy(search.value);
                // sortBy(sort.value, order.value);
            } catch (err) {
                console.log(err);
                error.value = true;
            }
        })
        .catch(console.error);
};

const isBookmarked = (asset: IAsset) => (bookmarks.value ? bookmarks.value.some((b) => b.id === asset.id) : false);

onMounted(() => {
    getAssets();
    getBookmarks();
});
</script>

<template>
    <AlertMessage v-if="error">No assets found!</AlertMessage>

    <div v-else>
        <SearchAndSort @search="searchBy" @sort="sortBy" class="mb-6" />

        <Pagination @update="getAssets" class="mb-4" />

        <div v-if="filtered" class="grid md:grid-cols-2 gap-4">
            <Asset v-for="asset in filtered" :key="asset.id" :asset="asset" :isBookmarked="isBookmarked(asset)" />
        </div>

        <LoadingBar v-else>Loading assets...</LoadingBar>
    </div>
</template>
