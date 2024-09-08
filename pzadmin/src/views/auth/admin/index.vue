<template>
    <div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="create_time" label="创建时间" />
        </el-table>
    </div>
</template>

<script setup>
import { authAdmin, UserInfo } from '../../../api/user/user'
import { onMounted, ref } from 'vue'
const tableData = ref([])
const paging = ref({
    pageNum: '1',
    pageSize: '20'
})

onMounted(() => {
    authAdmin(paging.value).then((res) => {
        console.log(res.data.data.list);
        tableData.value = res.data.data.list

    })
    UserInfo({
        name: 'west444'
    })
})
</script>