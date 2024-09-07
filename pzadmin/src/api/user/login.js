import instance from "../index";

//登录
export const getInforDetail = (data) => {
  return instance({
    method: "post",
    url: "/login",
    data,
  });
};

//发送验证码
export const getInfo = (data) => {
  return instance({
    method: "post",
    url: "/get/code",
    data: data,
  });
};

//注册
export const registered = (data) => {
  return instance({
    method: "post",
    url: "/user/authentication",
    data,
  });
};
