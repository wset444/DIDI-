<template>

    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20" @click="clickButton">
                <Fold />
            </el-icon>

            <ul class="flex-box">
                <li v-for="(item, index) in selectMenu" :key="item.path" class="tab flex-box "
                    :class="{ selected: item.path === route.path }">
                    <el-icon size='16'>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <router-link class="text flex-box" :to="{ path: item.path }"> {{ item.name }}</router-link>

                    <el-icon class="close" size='16' @click="delItem(item, index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown>
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar" />
                    <p class="user-name">{{ userInfo.name }}</p>

                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="rmove()">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const store = useStore()
const clickButton = () => {
    store.commit('collapseMenu')

}


const router = useRouter()
const route = useRoute()

const rmove = () => {
    localStorage.removeItem("pz_token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem('pz_v3pz')
    ElMessage.success('退出成功！！')
    // router.push('/login')
    window.location.href = window.location.origin
}
const selectMenu = ref([])
selectMenu.value = store.state.menu.selectMenu
const delItem = (item, index) => {
    store.commit('closeMenu', item)
    if (item.path != route.path
    ) {
        return
    }
    let selectMenuData = selectMenu.value

    //如果删除的是最后一项
    if (index === selectMenuData.length) {
        if (!selectMenuData.length) {
            router.push('/')
        } else {
            router.push({
                path: selectMenuData[index - 1].path
            })
        }

    } else {
        router.push({
            path: selectMenuData[index].path
        })
    }

}
const userInfo = ref({})
onMounted(() => {
    userInfo.value = JSON.parse(localStorage.getItem('pz_userInfo'))

})

</script>

<style lang="less">
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .text {
                margin: 0 5px;
            }

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409eff;
                }

                i {
                    color: #409eff;
                }

                background-color: #f5f5f5;
            }
        }

        .tab:hover {
            background-color: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>