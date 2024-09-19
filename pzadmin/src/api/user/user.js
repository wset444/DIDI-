import instance from "../index";

//登录
export const authAdmin = (params) => {
  return instance({
    method: "get",
    url: "/auth/admin",
    params,
  });
};

//用户信息
export const UserInfo = (data) => {
  return instance({
    method: "post",
    url: "/update/user",
    data,
  });
};

//用户菜单权限
export const UserPermissions = () => {
  return instance({
    method: "get",
    url: "/menu/permissions",
  });
};

//陪护师列表
export const companion = (params) => {
  return instance({
    method: "get",
    url: "/companion/list",
    params,
  });
};

//陪护师编辑or添加
export const addCompanions = (data) => {
  return instance({
    method: "post",
    url: "/companion",
    data,
  });
};

//陪护师编辑or添加
export const photoList = (params) => {
  return instance({
    method: "get",
    url: "/photo/list",
    params,
  });
};

//删除

export const rmoveist = (data) => {
  return instance({
    method: "post",
    url: "/delete/companion",
    data,
  });
};

//订单列表
export const order = (params) => {
  return instance({
    method: "get",
    url: "/admin/order",
    params,
  });
};
export const updateOrder = (data) => {
  return instance({
    method: "post",
    url: "/update/order",
    data,
  });
};
