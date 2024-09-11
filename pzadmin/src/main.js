import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/style.css";
import "element-plus/dist/index.css";
import store from "./store/index";
import paneHead from "./components/paneHead.vue";

//刷新后动态路由添加
const localData = JSON.parse(localStorage.getItem("pz_v3pz"));
if (localData) {
  store.commit("dynamicMenu", localData.menu.menuList);
  localData.menu.menuList.forEach((item) => {
    router.addRoute("main", item);
  });
}

//全局路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  //非登录页面
  if (!token && to.path != "/login") {
    return "/login";
  } else if (token && to.path === "/login") {
    return "/";
  } else {
    return true;
  }
});

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("paneHead", paneHead);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.mount("#app");
