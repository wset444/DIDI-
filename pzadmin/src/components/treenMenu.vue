<template>
    <div>
        <template v-for=" item in   routerList ">
            <el-menu-item v-if="!item.children || item.children.length == 0" :index="`${props.index}-${item.meta.id}`"
                :key="`${props.index} -${item.meta.id}`">
                <el-icon size='20'>
                    <component :is="item.meta.icon"></component>
                </el-icon>{{ item.meta.name }}</el-menu-item>

            <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`" :key="`${props.index}-${item.meta.id}`">
                <template #title>
                    <el-icon size='20'>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.name }}</span>
                </template>
                <!-- <el-menu-item-group v-for=" ( item, index ) in  item.children " :key="index">
                    <el-menu-item :index="`${index}-${item.meta.id}`">{{ item.meta.name }}</el-menu-item>
                </el-menu-item-group> -->
                <treen-menu v-if="item.children && item.children.length > 0" :index="`${props.index}-${item.meta.id}`"
                    :data="item.children" />
            </el-sub-menu>

        </template>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['data', 'index']);
const routerList = ref([])
routerList.value = props.data
console.log('routerList.value', routerList.value);

</script>
