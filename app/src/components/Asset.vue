<script setup lang="ts">
import { ref } from "vue";
import { IAsset } from "../models/coin.model";
import service from "../services/coin.service";

const props = defineProps<{ asset: IAsset; showBookmark: boolean }>();
const quote = props.asset.quote["USD"];
const isBookmarked = ref(props.asset.is_bookmarked);
const bookmarking = ref(false);
const bookmarkText = ref("");

const priceColor = quote.percent_change_24h < 0 ? "text-red-500" : "text-green-500";

const toReadableNumber = (num: number) => {
    return num.toLocaleString("en-us", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const onBookmarked = (event: Event) => {
    bookmarking.value = true;
    bookmarkText.value = isBookmarked.value ? "Unbookmarking..." : "Bookmarking...";

    try {
        if (!isBookmarked.value) {
            service.storeAsset(props.asset);
        } else {
            service.removeAsset(props.asset.slug);
        }

        isBookmarked.value = !isBookmarked.value;
        bookmarkText.value = isBookmarked.value ? "Bookmarked!" : "Unbookmarked!";
    } catch (err) {
        console.log(err);
        bookmarkText.value = "Failed!";
    }

    setTimeout(() => (bookmarking.value = false), 2000);
};
</script>

<template>
    <div class="asset">
        <div class="flex items-center space-x-4">
            <div v-show="asset.icon" class="w-10">
                <img :src="asset.icon" :alt="asset.name" />
            </div>

            <div class="asset-name">
                {{ asset.name }}
            </div>

            <div class="asset-symbol">
                {{ asset.symbol }}
            </div>

            <div :class="priceColor" class="asset-price">
                <div class="font-semibold">
                    $
                    {{ toReadableNumber(quote.price) }}
                </div>
                <div :class="priceColor" class="asset-price-change">
                    {{ toReadableNumber(quote.percent_change_24h) }} %
                </div>
            </div>
        </div>

        <div class="asset-details">
            Market cap: <span>$ {{ toReadableNumber(quote.market_cap) }}</span>
        </div>

        <div class="asset-details">
            Circulating supply: <span>{{ toReadableNumber(asset.circulating_supply) }} {{ asset.symbol }}</span>
        </div>

        <div class="flex items-center asset-details">
            <div v-if="showBookmark" class="flex-grow flex items-center">
                <button
                    :disabled="bookmarking"
                    @click.prevent="onBookmarked"
                    :class="isBookmarked ? 'text-green-500' : 'text-gray-900'"
                    class="p-2 transition duration-500 transform hover:scale-125"
                >
                    <span class="icon-heart"></span>
                </button>
                <div v-show="bookmarking" class="ml-1 text-xs text-green-500">{{ bookmarkText }}</div>
            </div>
            <div class="italic text-right">Last updated: {{ new Date(asset.last_updated).toLocaleString() }}</div>
        </div>
    </div>
</template>

<style scoped>
.asset {
    @apply flex-col space-y-2 bg-white rounded-lg shadow-md border border-gray-100 p-4 transition-colors duration-300;
}

.asset:active,
.asset:focus,
.asset:hover {
    @apply cursor-pointer bg-gray-50;
}

.asset-name {
    @apply font-semibold text-xl;
}

.asset-symbol {
    @apply font-light text-lg text-gray-400;
}

.asset-price {
    @apply flex-grow flex-col text-right justify-end;
}

.asset-details {
    @apply text-sm text-gray-400 capitalize;
}

.asset-details > span {
    @apply font-semibold text-gray-900;
}
</style>
