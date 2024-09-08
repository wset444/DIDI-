import instance from "../index";

//权限菜单
export const getMenu = (params) => {
  return instance({
    method: "get",
    url: "/user/getmenu",
    params,
  });
};

//权限管理列表
export const getMenuList = (params) => {
  return instance({
    method: "get",
    url: "/menu/list",
    params,
  });
};

//权限修改
export const setMenu = (data) => {
  return instance({
    method: "post",
    url: "/user/setmenu",
    data,
  });
};
