<template>
    <div>
        <paneHead :title="route.meta.name" :description="route.meta.describe" />
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="permissions_id" label="所属类别">
                <template #default="scope">
                    {{ findList(scope.row.permissions_id) }}
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="active" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.active ? 'success' : 'danger'"> {{ scope.row.active ? '正常' : '失败'
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
                <template #default="scope">
                    <div style="display: flex;align-items: center;">
                        <el-icon>
                            <Clock />
                        </el-icon> {{ formatTimestamp(scope.row.create_time) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="编辑">
                <template #default="scope">
                    <el-button @click="editsItem(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-info">
            <el-pagination title="编辑用户" v-model:current-page="pagination.pageNum" :page-size="pagination.pageSize"
                :size="size" :disabled="disabled" :background="background" layout="total, prev, pager, next"
                :total="pagination.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <el-dialog title="编辑用户" v-model="dialogTableVisible" :before-close="closeDialog" :close="close" :title="title"
            width="500">
            <el-form :rules="rules" ref="formRef" :model="permissions" label-width="100px" label-position="left">
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="permissions.name" autocomplete="off" placeholder="编辑昵称" />
                </el-form-item>
                <el-form-item label="权限" prop="permissions_id">


                    <el-select v-model="permissions.permissions_id" placeholder="Select" size="large">
                        <el-option v-for="item in permissionsList" :key="item.value" :label="item.label"
                            :value="item.value" />

                    </el-select>
                </el-form-item>

            </el-form>
            <template #footer>
                <el-button type="primary" @click="edites()">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { authAdmin, UserInfo } from '../../../api/user/user'
import { selectList } from '../../../api/user/menu'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import formatTimestamp from '../../../hooks/useTime/index'

const route = useRoute()


//编辑
const permissionsList = ref([])
const permissions = ref({})
const dialogTableVisible = ref(false)
const editsItem = (item) => {
    dialogTableVisible.value = true
    permissions.value = item
    permissionsList.value = InfoList.value.map(item => ({
        label: item.name,
        value: item.id
    }))

}


//确定修改
const edites = () => {
    UserInfo({
        name: permissions.value.name,
        permissions_id: permissions.value.permissions_id
    }).then(res => {
        ElMessage.success('提交成功！')
        // console.log(res.data.code);
        if (res.data.code === 10000) {
            dialogTableVisible.value = false
        }
    })
}

//分页
const pagination = ref({
    pageNum: 1,
    pageSize: 10,
    total: 0
})
const handleSizeChange = (val) => { console.log(val); }
const handleCurrentChange = (val) => {
    pagination.value.pageNum = val
    authAdmin(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
    })

}

const tableData = ref([])
//状态字典

onMounted(() => {
    authAdmin(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
    })

    selectList().then((res) => {
        InfoList.value = res.data.data

    }
    )
})

const InfoList = ref([])
const findList = (id) => {
    const res = InfoList.value.find(item => {
        return item.id === id
    })
    return res ? res.name : '超级管理员'
}


</script>