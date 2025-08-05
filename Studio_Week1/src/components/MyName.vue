<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },

})
</script>



<template>
    <div class="greetings">
        <h1 class="green">{{ name }}</h1>
        <h3>
            This is my first Component.
        </h3>
    </div>
</template>



<style scoped>
h3 {
    color: #FFFF00;
}
</style>