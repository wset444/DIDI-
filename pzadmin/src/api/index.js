//http.js
import axios from "axios";

// 1. 创建axios实例
const instance = axios.create({
  baseURL: "https:/v3pz.itndedu.com", //请求的域名  url = baseURL + requestUrl
  timeout: 5000, // 请求超时时间
  // headers: { //设置请求头
  //   "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  // },
});

// ​2. axios拦截器的使用
/** 需要拦截请求的原因
 *   1.config中包含了某些不符合服务器要求的信息
 *   2.发送网络请求的时候需要向用户展示一些加载中的图标
 *   3.网站需要登录才能请求资源，也就是需要token才能请求资源
 */

// 2.1 添加请求拦截器
// 添加公共请求头、处理请求参数等
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么

    const token = localStorage.getItem("pz_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; //拦截器里一定要记得将拦截的结果处理后返回，否则无法进行数据获取
  },
  (err) => {
    // 对请求错误做些什么

    return Promise.reject(err); // 在请求错误的时候的逻辑处理
  }
);

// 2.2 添加响应拦截器
// 修改响应信息，比如数据转换、错误处理等
instance.interceptors.response.use(
  (res) => {
    // 在请求成功后对响应数据做处理
    // console.log(res.data);
    // if (res.status === 200) {
    //   return res.data;
    // }
    return res.data;
  },
  (err) => {
    // 对响应错误做些什么
    if (err.response.status) {
      switch (err.response.status) {
        case 400:
          // 处理错误信息，例如抛出错误信息提示，或者跳转页面等处理方式。
          err.message = "错误请求";
          break;
        case 401:
          err.message = "未授权，请重新登录";
          break;
        case 403:
          err.message = "拒绝访问";
          break;
        case 404:
          err.message = "请求错误,未找到该资源!!!!";
          alert(err.message);
          break;
        case 405:
          err.message = "请求方法未允许";
          break;
        case 408:
          err.message = "请求超时";
          break;
        case 500:
          err.message = "服务器端出错";
          break;
        case 501:
          err.message = "网络未实现";
          break;
        case 502:
          err.message = "网络错误";
          break;
        case 503:
          err.message = "服务不可用";
          break;
        case 504:
          err.message = "网络超时";
          break;
        case 505:
          err.message = "http版本不支持该请求";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    }

    return Promise.reject(err); // 在响应错误的时候的逻辑处理
  }
);

export default instance;
