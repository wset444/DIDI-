import instance from "../index";

//登录
export const authAdmin = (params) => {
  return instance({
    method: "get",
    url: "/auth/admin",
    params,
  });
};
