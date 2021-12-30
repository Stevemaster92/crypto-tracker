<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update"]);

const page = ref(0);
const itemsPerPage = ref(50);
const lastPage = 9;

const update = (start: number) => {
    if (start >= 0 && start <= lastPage) {
        page.value = start;
    }

    emit("update", page.value, itemsPerPage.value);
};
</script>

<template>
    <div class="flex items-center justify-between space-x-8">
        <div class="flex space-x-4 justify-center">
            <button v-show="page > 0" @click.prevent="update(page - 1)" class="nav nav-icon">
                <span class="icon-chevron-left"></span>
                <p>Prev</p>
            </button>

            <button @click.prevent="update(0)" :class="{ active: page === 0 }" class="nav">1</button>

            <p v-show="page > 0 && page < lastPage" class="nav active">{{ page + 1 }}</p>

            <button @click.prevent="update(lastPage)" :class="{ active: page === lastPage }" class="nav">
                {{ lastPage + 1 }}
            </button>

            <button v-show="page < lastPage" @click.prevent="update(page + 1)" class="nav nav-icon">
                <p>Next</p>
                <span class="icon-chevron-right"></span>
            </button>
        </div>

        <div class="flex items-center justify-end space-x-2">
            <span>Items per page</span>

            <select @change="update(page)" v-model="itemsPerPage" class="form-input">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.nav {
    @apply hover:text-green-400 transition-colors px-2 py-1;
}

.nav.active {
    @apply bg-green-400 text-white font-semibold rounded-md;
}

.nav-icon {
    @apply flex items-center space-x-1;
}
</style>
