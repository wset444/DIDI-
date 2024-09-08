import instance from "../index";

//登录
export const authAdmin = (params) => {
  return instance({
    method: "get",
    url: "/auth/admin",
    params,
  });
};

export const UserInfo = (data) => {
  return instance({
    method: "post",
    url: "/update/user",
    data,
  });
};
