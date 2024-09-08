<template>
    <div>
        <el-button @click="handleClick(1)" style="margin-bottom: 20px;">新增</el-button>
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
            <el-table-column prop="name" label="用户名" />
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMenu, getMenuList, setMenu } from '../../../api/user/menu'
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

onMounted(() => {
    getMenu().then(res => {
        datas.value = res.data.data
    })
    getMenuList(
        {
            pageNum: "1",
            pageSize: 20
        }
    ).then(({ data }) => {
        console.log(data);
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