const locData = localStorage.getItem("pz_v3pz");

const state = locData
  ? locData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      menuList: [],
      menuActive: "1-1",
    };

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  addMenu(state, payload) {
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      state.selectMenu.push(payload);
    }
  },
  delMenu(state, index) {
    state.selectMenu.splice(index, 1);
  },
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(
      (val) => val.name === payload.name
    );

    state.selectMenu.splice(index, 1);
  },
  dynamicMenu(state, payload) {
    const modules = import.meta.glob("../../views/**/**/*.vue");

    function routerSet(router) {
      //判断有没有子菜单,拼接路由数据
      router.forEach((route) => {
        if (!route.children) {
          const url = `../../views${route.meta.path}/index.vue`;

          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
    }
    routerSet(payload);
    state.menuList = payload;
    // console.log(state.menuList);
  },
  updateMenuActive(state, payload) {
    state.menuActive = payload;
  },
};

export default {
  state,
  mutations,
};
