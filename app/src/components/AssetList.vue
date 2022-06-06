<script setup lang="ts">
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { IAsset } from "../models/coin.model";
import service from "../services/coin.service";
import Asset from "./Asset.vue";
import LoadingBar from "./LoadingBar.vue";
import Pagination from "./Pagination.vue";
import SearchAndSort from "./SearchAndSort.vue";
import AlertMessage from "./AlertMessage.vue";

const props = defineProps<{ isBookmarked: boolean }>();

const assets = ref<IAsset[]>();
const filtered = ref<IAsset[]>();
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

const getAssets = async (start = 0, limit = 50) => {
    error.value = false;

    // Fetch all assets.
    try {
        const bookmarks = service.getBookmarks();

        if (props.isBookmarked) {
            assets.value = bookmarks;
        } else {
            const { data } = await axios.get<IAsset[]>(`${import.meta.env.VITE_API_URL}/coin/assets`, {
                params: { start: start * limit + 1, limit },
            });

            // Assign bookmark to respective assets.
            assets.value = data.map((asset) => {
                asset.is_bookmarked = bookmarks.some((b) => b.id === asset.id);

                return asset;
            });
        }

        searchBy(search.value);
        sortBy(sort.value, order.value);
    } catch (err) {
        console.log(err);
        error.value = true;
    }
};

onMounted(getAssets);

watch(
    () => props.isBookmarked,
    () => getAssets(),
);
</script>

<template>
    <AlertMessage v-if="error">No assets found!</AlertMessage>

    <SearchAndSort @search="searchBy" @sort="sortBy" class="mb-6" />

    <Pagination v-if="!isBookmarked" @update="getAssets" class="mb-4" />

    <div v-if="filtered" class="grid md:grid-cols-2 gap-4">
        <Asset v-for="asset in filtered" :key="asset.id" :asset="asset" :showBookmark="!isBookmarked" />
    </div>

    <LoadingBar v-else>Loading assets...</LoadingBar>
</template>
