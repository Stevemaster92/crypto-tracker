<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import LoginForm from "./components/LoginForm.vue";
import AssetList from "./components/AssetList.vue";

const user = ref<User | null>();
const auth = getAuth();
const showBookmarks = ref(false);

const logout = async (event: Event) => await auth.signOut();

onMounted(() => {
    onAuthStateChanged(auth, (u) => (user.value = u));
});
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center font-bold text-4xl mb-10">Crypto Tracker</div>

        <div v-if="user">
            <div class="flex space-x-4">
                <button @click.prevent="logout" class="btn-primary mb-8">Logout</button>
                <button @click.prevent="showBookmarks = !showBookmarks" class="btn-primary mb-8">
                    {{ showBookmarks ? "All Assets" : "Bookmarked Assets" }}
                </button>
            </div>

            <AssetList :isBookmarked="showBookmarks" />
        </div>

        <LoginForm v-else />
    </div>
</template>

<style></style>
