<template>
    <div>

        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
            text-color="#fff" @open="handleOpen" @close="handleClose">
            <p class="logo-title">医疗系统</p>
            <treenMenu :index="'1'" :data="routerListData" />
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import treenMenu from './treenMenu.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const routerListData: any = ref([])
routerListData.value = router.options.routes[0].children


const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {

}
const handleClose = (key: string, keyPath: string[]) => {

}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100vh;
}

.logo-title {
    text-align: center;
    padding: 10px 0;
    color: #fff;
    font-size: 20px;
}
</style>