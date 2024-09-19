<template>
    <div>
        <paneHead :title="route.meta.name" :description="route.meta.describe" />
        <div class="form">
            <el-input v-model="input" style="width: 240px" />
            <el-button type="primary" style="margin:0 10px;" @click="search" placeholder="订单号">搜索</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="out_trade_no" label="订单号" />
            <el-table-column prop="hospital_name" label="就诊医院">

            </el-table-column>
            <el-table-column prop="service_name" label="陪诊服务" />
            <el-table-column prop="companion" label="陪护师">
                <template #default="scope">
                    <div class="lay">
                        <img :src="scope.row.companion.avatar" alt="" style="width: 50px; height: 50px;">
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="client.mobile" label="陪护师手机号">


            </el-table-column>
            <el-table-column prop="price" label="总价" />
            <el-table-column prop="paidPrice" label="已付">

            </el-table-column>
            <el-table-column prop="starttime" label="下单时间">

            </el-table-column>
            <el-table-column prop="order_start_time" label="订单状态">
                <template #default="scope">

                    <el-button type="primary" plain v-if="scope.row.trade_state === '待服务'">{{ scope.row.trade_state
                        }}</el-button>
                    <el-button type="info" plain v-if="scope.row.trade_state === '待支付'"> {{ scope.row.trade_state
                        }}</el-button>
                    <el-button type="danger" plain v-if="scope.row.trade_state === '已取消'"> {{ scope.row.trade_state
                        }}</el-button>
                    <el-button type="success" plain v-if="scope.row.trade_state === '已完成'"> {{ scope.row.trade_state
                        }}</el-button>

                </template>
            </el-table-column>
            <el-table-column prop="service_state" label="接单状态">

            </el-table-column>
            <el-table-column prop="companion.mobile" label="联系人手机号">

            </el-table-column>
            <el-table-column prop="trade_state" label="操作">
                <template #default="scope">

                    <el-button type="primary" text v-if="scope.row.trade_state === '待服务'"
                        @click="upData(scope.row.id)">{{
            InfoMap[scope.row.trade_state]
        }}</el-button>
                    <el-button type='primary' text v-if="scope.row.trade_state === '待支付'"
                        @click="upData(scope.row.out_trade_no)">
                        {{
            InfoMap[scope.row.trade_state]
        }}</el-button>
                    <el-button type="primary" text v-if="scope.row.trade_state === '已取消'" disabled> {{
            InfoMap[scope.row.trade_state]
        }}</el-button>


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
                <el-button type="primary" @click="edites()"> </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { companion, addCompanions, order, updateOrder } from '../../../api/user/user'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'


const upData = (id) => {
    console.log(id);
    updateOrder({
        id
    }).then(res => {
        order(pagination.value).then((res) => {
            tableData.value = res.data.data.list
            pagination.value.total = res.data.data.total

        })
    })

}

const InfoMap = {
    '待支付': '暂无服务',
    '已取消': '暂无服务',
    '已接单': '服务完成'
}

const input = ref('')
const search = () => {
    order({
        pageNum: pagination.value.pageNum,
        pageSize: pagination.value.pageSize,
        out_trade_no: input.value
    }).then(res => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
    })
}
const nub = {
    a: 1,
    b: 2
}

const imageUrl = ref('')

//创建陪护师傅
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
    order(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
    })
}
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
<style>
.lay {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.form {
    display: flex;
    justify-content: end;
    background: #fff;
    padding: 10px;
}
</style>