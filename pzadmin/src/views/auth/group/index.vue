<template>
    <div>
        <paneHead :title="route.meta.name" :description="route.meta.describe" />
        <div class="btns">
            <el-button :icon="Plus" type="primary" @click="handleClick(1)" style="margin-bottom: 20px;">新增</el-button>
        </div>
        <el-dialog v-model="dialogTableVisible" :before-close="closeDialog" :close="close" :title="title" width="500">
            <el-form :rules="rules" ref="formRef" :model="form" label-width="100px" label-position="left">
                <el-form-item label="ID" prop="id" v-show="isShow">
                    <el-input v-model="form.id" autocomplete="off" placeholder="请填写ID" disabled />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" autocomplete="off" placeholder="请填写好权限名称" />
                </el-form-item>
                <el-form-item label="权限" prop="permissions">
                    <el-tree ref="treeRef" style="max-width: 600px" :data="datas" show-checkbox node-key="id"
                        :default-expanded-keys="[2]" :default-checked-keys="defKeys" :props="defaultProps" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="addMenus(formRef)">确定</el-button>
            </template>
        </el-dialog>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="permissionName" label="权限" />
            <el-table-column prop="create_time" label="编辑">
                <template #default="scope">
                    <el-button type="primary" @click="handleClick(2, scope)" plain>
                        编辑
                    </el-button>
                    <!-- <el-button link type="primary" @click="delList(scope)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-info">
            <el-pagination v-model:current-page="pagination.pageNum" :page-size="pagination.pageSize" :size="size"
                :disabled="disabled" :background="background" layout="total, prev, pager, next"
                :total="pagination.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMenu, getMenuList, setMenu } from '../../../api/user/menu'
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from 'vue-router'

const route = useRoute()


//菜单标题
const titles = '菜单管理'
const description = '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取'

const form = ref({
    name: '',
    permissions: "",
    id: ""
})
const dialogTableVisible = ref(false)
const closeDialog = () => {
    dialogTableVisible.value = false
}

const defaultProps = {
    children: 'children',
    label: 'label',
}


//树形列表数据
const datas = ref([
])

const tableData = ref([])


//分页器事件
const pagination = ref({
    pageNum: 1,
    pageSize: 10,
    total: 0
})
const handleSizeChange = (val) => { console.log(val); }
const handleCurrentChange = (val) => {
    pagination.value.pageNum = val
    getMenuList(
        {
            pageNum: pagination.value.pageNum,
            pageSize: pagination.value.pageSize,
        }
    ).then(({ data }) => {

        pagination.value.total = data.data.total
        tableData.value = data.data.list

    })
}

onMounted(() => {
    getMenu().then(res => {
        datas.value = res.data.data
    })
    getMenuList(
        {
            pageNum: pagination.value.pageNum,
            pageSize: pagination.value.pageSize,
        }
    ).then(({ data }) => {

        pagination.value.total = data.data.total
        tableData.value = data.data.list

    })
})




//选中默认权限
const defKeys = [4, 5]
const treeRef = ref()



//弹窗关闭回调
const close = () => {
    dialogTableVisible.value = false
    //重置表单
    formRef.value.resetFields()
    //重置tree
    treeRef.value.setCheckedKeys(defKeys)
}

//提交表单

const formRef = ref()
const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
})
const addMenus = async (forms) => {
    if (!forms) return

    await forms.validate((valid, fields) => {
        if (valid) {
            setMenu({ name: form.value.name, permissions: JSON.stringify(treeRef.value.getCheckedKeys()), id: form.value.id }).then(
                res => {
                    ElMessage.success('提交成功！')
                    dialogTableVisible.value = false
                    getMenuList(
                        {
                            pageNum: "1",
                            pageSize: 20
                        }
                    ).then(({ data }) => {
                        console.log(data);
                        tableData.value = data.data.list
                    })
                }
            )
        } else {
            ElMessage.error('请输入完整的校验表单')

        }
    })

}


const isShow = ref(false)
//编辑权限菜单
const title = ref('添加权限')
const handleClick = (isShowId, dataes) => {
    dialogTableVisible.value = true
    if (isShowId === 1) {
        isShow.value = false
        title.value = '添加权限'
        form.value = {
            name: '',
            permissions: "",
            id: ""
        }
    } else {
        isShow.value = true
        title.value = '编辑权限'
        form.value = {
            name: dataes.row.name,
            permissions: dataes.row.name,
            id: dataes.row.id,
        }
    }

}
</script>
<style>
.pagination-info {
    background: #fff;
}

.btns {
    background: #fff;
    padding: 10px 0px 10px 10px;
}
</style>