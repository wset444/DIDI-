import { createStore } from "vuex";
import menu from "./modules/menu";
import ceratePersistedstate from "vuex-persistedstate";

export default createStore({
  plugins: [
    new ceratePersistedstate({
      key: "pz_v3pz",
    }),
  ],
  modules: { menu },
});
