<template>
    <el-menu :style="{ width: !res ? '230px' : '64px', height: '100vh' }" active-text-color="#ffd04b"
        background-color="#545c64" class="el-menu-vertical-demo" :default-active="active" :collapse="res"
        text-color="#fff" @open="handleOpen" @close="handleClose">
        <p class="logo-title">{{ res ? 'DD' : '医疗系统' }}</p>
        <treenMenu :index="'1'" :data="routerListData" />
    </el-menu>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import treenMenu from './treenMenu.vue'

const store = useStore()

const routerListData = computed(() => { return store.state.menu.menuList }
)
const res = computed(() => { return store.state.menu.isCollapse })

const active = computed(() => { return store.state.menu.menuActive })



const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {

}
const handleClose = (key: string, keyPath: string[]) => {

}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    height: 100vh;
}

.logo-title {
    box-sizing: border-box;
    text-align: center;
    padding: 10px 0;
    color: #fff;
    font-size: 20px;
}
</style>