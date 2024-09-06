<template>
    <template v-for=" item in  routerList ">
        <el-menu-item @click="toRouter(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0" :index="`${props.index}-${item.meta.id}`"
            :key="`${props.index} -${item.meta.id}`">
            <el-icon size='20'>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>


        </el-menu-item>

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
            <treen-menu :index="`${props.index}-${item.meta.id}`" :data="item.children" />
        </el-sub-menu>
    </template>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps(['data', 'index']);
const routerList = ref([])
routerList.value = props.data


const router = useRouter()
const store = useStore()
const toRouter = (e, a) => {
    console.log(e.meta);
    router.push(e.meta.path)
    store.commit('addMenu', e.meta)
}
</script>
