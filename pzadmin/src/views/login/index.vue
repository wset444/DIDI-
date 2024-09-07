<template>
    <el-row class="login-container" justify="center" :align="'middle'">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handChange"> {{ types ? '返回登录' : '注册账号' }}</el-link>
            </div>
            <el-form ref="loginFromRef" :model="loginForm" label-width="auto" style="max-width: 600px" :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" :prefix-icon="UserFilled" placeholder="手机号" />
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input type="password" v-model="loginForm.passWord" :prefix-icon="Lock" placeholder="密码" />
                </el-form-item>
                <el-form-item v-if="types" prop="validCode">
                    <el-input v-model="loginForm.validCode" :prefix-icon="Iphone" placeholder="验证码"
                        style="cursor: pointer;">
                        <template #append> <span @click="getInfos">{{ countdown.validText }}</span> </template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="onSubmit(loginFromRef)">{{ types ? '注册' :
        '登录'
                        }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </el-row>
</template>

<script setup>
import { UserFilled, Lock, Iphone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, reactive } from "vue"
import { getInforDetail, getInfo, registered } from '../../api/user/login'
import { useRouter } from 'vue-router'
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href


//切换表单 (0登录 1注册)
const types = ref(0)
const handChange = () => {
    types.value = types.value ? 0 : 1
}

const loginForm = ref({
    userName: '',
    passWord: '',
    validCode: ''
})

//发送短信

const countdown = reactive({
    validText: '获取验证码',
    time: 60
})



//验证码验证
let flag = false
const getInfos = () => {

    if (flag) return
    const iponeRang = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    //判断手机号是否正确
    if (!loginForm.value.userName || !iponeRang.test(loginForm.value.userName)) {
        return ElMessage({
            message: '手机号输入不正确！！！',
            type: 'error',
            plain: true,
        })

    }
    const time = setInterval(() => {
        if (countdown.time <= 0) {
            countdown.time = 60
            ountdown.validText = '获取验证码'
            flag = false
            clearInterval(time)
        } else {
            countdown.time -= 1
            countdown.validText = `剩余${countdown.time}`
        }
    }, 1000)
    flag = true
    getInfo({
        tel: loginForm.value.userName
    }).then(res => {
        if (res.data.code === 10000) {
            ElMessage.success('发送成功')
        }
    })
}

//表单校验

const validatorUser = (rules, value, callback) => {
    //不能为空

    if (value === '') {
        callback(new Error('请输入账号'))
    } else {
        const iponeRang = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        iponeRang.test(value) ? callback() : callback(new Error('请输入正确手机格式'))
    }
}
const validatorPassWord = (rules, value, callback) => {
    //不能为空

    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        const iponeRang = /^[a-zA-Z0-9_-]{4,16}$/
        iponeRang.test(value) ? callback() : callback(new Error('请输入正确的密码格式,需要4到16位字符 '))
    }
}
const rules = ref({
    userName: [{ validator: validatorUser, trigger: 'blur' }],
    passWord: [{ validator: validatorPassWord, trigger: 'blur' }],
    validCode: [],
})


const router = useRouter()
const loginFromRef = ref()
const onSubmit = async (loginFromEl) => {
    if (!loginFromEl) return
    await loginFromEl.validate((valid, fields) => {
        if (valid) {
            if (types.value === 0) {
                getInforDetail({
                    userName: loginForm.value.userName,
                    passWord: loginForm.value.passWord,
                }).then(({ data }) => {
                    if (data.code === 10000) {
                        console.log(data.data.token);
                        ElMessage.success('登录成功！')

                        localStorage.setItem('pz_token', data.data.token)
                        localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
                        router.push('/')
                    }

                })
            } else {
                registered(
                    loginForm.value
                )
                    .then(res => {
                        if (res.data.code = 10000) {
                            ElMessage.success('注册成功！')
                        }
                    })
                types.value === 1
            }
        } else {
            ElMessage.error('请输入完整表单！！')
            // console.log('error submit!', fields)
        }
    })



}

</script>
<style lang="less" scoped>
.login-view {
    width: 100vw;
    height: 100vh;
    background: red;
}

:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>
