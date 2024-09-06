<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="auto">
                <Aside />
            </el-aside>
            <el-container style="background-color: #f2f6f8;">
                <el-header>
                    <navHead />
                </el-header>
                <el-main> <router-view></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup>
import Aside from '../components/aside.vue';
import navHead from '../components/navHead.vue';
</script>
