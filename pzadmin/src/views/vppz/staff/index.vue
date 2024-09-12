<template>
    <div>
        <paneHead :title="route.meta.name" :description="route.meta.describe" />
        <div class="btns"><el-button :icon="Plus" type="primary" @click="add">创建</el-button>

            <el-popconfirm @confirm="confirms" width="220" :icon="InfoFilled" icon-color="#626AEF" title="是否确认删除" @cancel="onCancel">
                <template #reference>
                    <el-button :icon="Delete" type="danger" @click="rmover">删除</el-button>
                </template>
             
            </el-popconfirm>


        </div>
        <el-table :data="tableData" stripe style="width: 100%" algin="center" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="id" />
            <el-table-column prop="avatar" label="头像">
                <template #default="scope">
                    <img :src="scope.row.avatar" class="avatar" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="age" label="年龄">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="active" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.active != 1 ? 'success' : 'danger'"> {{ scope.row.active != 1 ? '生效' :
            '失效'
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

        <el-dialog v-model="dialogTableVisible" :before-close="closeDialog" :close="close" :title="title" width="500">
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
                    <el-input-number v-model="permissions.age" min="18" />
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <div style="display: flex; flex-direction: column;">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-button :icon="Plus" type="primary" @click="photoDod = true">添加头像</el-button>
                    </div>
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

        <el-dialog title="头像" v-model="photoDod" :before-close="closeDialog" :close="close" width="680">
            <div class="image-list">
                <div v-for="(item, index) in photoImgList" :key="item.name" class="img-box"
                    @click="selectIndex = index">
                    <div v-if="selectIndex === index" class="select">✔</div>
                    <el-image :src="item.url" alt="" style="width:148px;height: 148px;" @click="actImg(item.url)" />
                </div>
            </div>
            <template #footer>
                <el-button type="primary" @click="addphoto()">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { companion, addCompanions, photoList, rmoveist } from '../../../api/user/user'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import formatTimestamp from '../../../hooks/useTime/index'

const newsList=ref([])
const handleSelectionChange = (val) => {
    const List = val
    const newList = List.map(item => ({ id:item.id})
    )

    newsList.value=newList
    

}
const confirms =()=>{
rmoveist({
        id: newsList.value
    }).then(res=>{
        if(res.code===10000)
        ElMessage.success('删除成功')
        companion(pagination.value).then((res) => {
            tableData.value = res.data.data.list
            pagination.value.total = res.data.data.total

        })
    })


}

//浮窗title
const title = ref('添加陪护')


//字典
const nub = {
    a: 1,
    b: 2
}

//创建陪护师傅
const add = () => {
    dialogTableVisible.value = true
    permissions.value.avatar = ''
    imageUrl.value = ''
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
    title.value = '编辑'
    dialogTableVisible.value = true
    permissions.value = item
    imageUrl.value = permissions.value.avatar
    console.log(permissions.value);

}
//确定修改
const edites = () => {
    permissions.value.avatar = imageUrl.value
    console.log(pagination.value);
    addCompanions({
        id: permissions.value.id,
        mobile: permissions.value.mobile,
        active: Number(permissions.value.active),
        age: permissions.value.age,
        avatar: permissions.value.avatar,
        name: permissions.value.name,
        sex: permissions.value.sex,
    }).then(res => {
        if(res.code=10000){
            ElMessage.success('提交成功！')
        }

        companion(pagination.value).then((res) => {
            tableData.value = res.data.data.list
            pagination.value.total = res.data.data.total

        })
        dialogTableVisible.value = false

    })
}
//解析时间戳

//表格数据
const tableData = ref([])
//分页器
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


const imageUrl = ref('')
const photoImgList = ref([])
const photoDod = ref(false)
const selectIndex = ref(0)
const imgUrl = ref('')
const actImg = (item) => {
    imgUrl.value = item
}
const addphoto = () => {
    imageUrl.value = imgUrl.value
    photoDod.value = false
}
//挂载获取数据
onMounted(() => {
    companion(pagination.value).then((res) => {
        tableData.value = res.data.data.list
        pagination.value.total = res.data.data.total
        console.log(res);
    })

    photoList().then(({ data }) => {
        console.log(data);
        photoImgList.value = data.data
    })
})
</script>

<style lang="less" scoped>
.btns {
    background: #fff;
    padding: 10px 0px 10px 10px;
}

.flex-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}


.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>