import instance from "../index";
export const getInforDetail = (params) => {
  return instance({
    method: "post",
    url: "/v3pz/login",
    data: params,
  });
};

export const getInfo = (params) => {
  return instance({
    method: "post",
    url: "/v3pz/get/code",
    data: params,
  });
};

export const registered = (params) => {
  return instance({
    method: "post",
    url: "/v3pz/user/authentication",
    data: params,
  });
};
