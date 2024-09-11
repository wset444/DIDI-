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
