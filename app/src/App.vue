<script setup lang="ts">
import { ref } from "vue";
import AssetList from "./components/AssetList.vue";

const showBookmarks = ref(false);
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center font-bold text-4xl mb-10">Crypto Tracker</div>

        <div class="flex space-x-4">
            <button @click.prevent="showBookmarks = !showBookmarks" class="btn-primary mb-8">
                {{ showBookmarks ? "All Assets" : "Bookmarked Assets" }}
            </button>
        </div>

        <AssetList :isBookmarked="showBookmarks" />
    </div>
</template>

<style></style>
