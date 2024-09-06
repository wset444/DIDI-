const state = {
  isCollapse: false,
  selectMenu: [],
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
      console.log(state.selectMenu);
    }
  },
  delMenu(state, index) {
    state.selectMenu.splice(index, 1);
  },
  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(
      (val) => val.name === payload.name
    );
    console.log(index);
    state.selectMenu.splice(index, 1);
  },
};

export default {
  state,
  mutations,
};
