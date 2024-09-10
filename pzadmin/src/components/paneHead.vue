<template>
    <div class="panel-heading">
        <div class="panel-lead">
            <div class="title">{{ props.title }}</div>
            <p class="description">{{ props.description }} </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    title: String,
    description: String
});

</script>
<style lang="less" scoped>
.panel-heading {
    padding: 15px;
    background: #e8edf0;
    border-color: #e8edf0;
    position: relative;

    .panel-lead {
        font-size: 14px;

        .title {
            font-weight: bold;
            font-style: normal;
        }

        .description {
            margin-top: 5px;
        }
    }
}
</style>