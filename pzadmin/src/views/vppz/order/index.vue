<template>
    <div>
        <paneHead :title="route.meta.name" :description="route.meta.describe" />
        <div><el-button @click="add">创建</el-button></div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="avatar" label="头像" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="age" label="年龄">

            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="active" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.active != 1 ? 'success' : 'danger'"> {{ scope.row.active != 1 ? '生效' : '失效'
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

        <el-dialog title="添加" v-model="dialogTableVisible" :before-close="closeDialog" :close="close" :title="title"
            width="500">
            <el-form :rules="rules" ref="formRef" :model="permissions" label-width="100px" label-position="left">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="permissions.id" autocomplete="off" placeholder="输入ID" />
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="permissions.name" autocomplete="off" placeholder="输入昵称" />
                </el-form-item>

                <el-form-item label="性别" prop="sex">
                    <el-select v-model="permissions.sex" placeholder="请选择性别" size="large">
                        <el-option label="男" value="1" />
                        <el-option label="女" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="permissions.mobile" />
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="permissions.age" min="0" />
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-upload class="avatar-uploader"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item label="是否生效" prop="active">
                    <el-radio-group v-model="permissions.active">
                        <el-radio :value="nub.a" size="large">失效</el-radio>
                        <el-radio :value="nub.b" size="large">生效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="edites()">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { companion, addCompanions, UserInfo, order } from '../../../api/user/user'
import { selectList } from '../../../api/user/menu'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const nub = {
    a: 1,
    b: 2
}


const imageUrl = ref('')




//创建陪护师傅
const add = () => {
    dialogTableVisible.value = true
    // addCompanions(permissions.value)
}

const route = useRoute()


//编辑
const permissions = ref({
    id: "",
    mobile: "",
    active: 1,
    age: 0,
    avatar: "1111",
    name: "",
    sex: ""
})
const dialogTableVisible = ref(false)
const editsItem = (item) => {
    dialogTableVisible.value = true
    permissions.value = item
    console.log(permissions.value);

}


//确定修改
const edites = () => {
    addCompanions({
        id: permissions.value.id,
        mobile: permissions.value.mobile,
        active: Number(permissions.value.active),
        age: permissions.value.age,
        avatar: permissions.value.avatar,
        name: permissions.value.name,
        sex: permissions.value.sex,
    }).then(res => {
        ElMessage.success('提交成功！')
        // console.log(res.data.code);
        if (res.data.code === 10000) {
            companion(pagination.value).then((res) => {
                tableData.value = res.data.data.list
                pagination.value.total = res.data.data.total

            })
            dialogTableVisible.value = false
        }
    })
}

//分页

const handleSizeChange = (val) => { console.log(val); }
const handleCurrentChange = (val) => {
    pagination.value.pageNum = val
    authAdmin(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
    })

}

//解析时间戳
const formatTimestamp = (ts) => {
    // 创建一个新的Date对象  
    const date = new Date(ts);

    // 格式化日期时间字符串  
    // 注意：这里的格式化方式可以根据你的需求进行调整  
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 使用24小时制  
    });
};


const tableData = ref([])

const pagination = ref({
    pageNum: 1,
    pageSize: 10,
    total: 0
})

onMounted(() => {
    order(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
        console.log(res);
    })


})




</script>