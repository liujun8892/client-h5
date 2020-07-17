import { get,post } from "./http.js";
import designSign from "./sign.js"

export const getAgreement = (data) => get(`getAgreement`, designSign(data)); // 用户协议
export const getCourse = (data) => post(`getCourseIntroduce`, designSign(data)); // 首页推荐课程
export const getApplePay = (data) => post(`acceptApplePayInfo`, designSign(data)); // 首页推荐课程
export const wxH5register = (data) => post(`wxH5register`, designSign(data)); // 微信h5注册登录


export const wxH5bindPhone = (data) => post(`wxH5bindPhone`, designSign(data)); // h5绑定手机号
export const createBuyCourseWap = (data) => post(`createBuyCourseWap`, designSign(data)); // H5下单支付接口
export const sendCode = (data) => post(`sendCode`, designSign(data)); //获取手机验证码
export const createBuyCourse = (data) => post(`createBuyCourse`, designSign(data)); // 购买免费课程
export const getCourseIntroduce = (data) => post(`getCourseIntroduce`, designSign(data)); // 课程介绍页 课程目录
export const getConfirmOrder = (data) => post(`getConfirmOrder`, designSign(data)); // 获取订单信息
export const getAudioDetail = (data) => post(`getAudioDetail`, designSign(data)); // 获取音频详情

export const getMemorySubject = (data) => post(`getMemorySubject`, designSign(data)); // 获取题目
export const getMemoryAnswer = (data) => post(`getMemoryAnswer`,designSign(data)); // 提交答案

export const addLessClassH5 = (data) => post(`addLessClassH5`,designSign(data)); // H5加入班级






