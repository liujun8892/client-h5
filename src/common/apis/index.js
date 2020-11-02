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
export const informationDetail = (data) => post(`informationDetail`,designSign(data)); // 文章资讯详情

export const getShareAddress = (data) => post(`getShareAddress`,designSign(data)); // 

export const userPostDetail = (data) => post(`userPostDetail`,designSign(data)); // 问答、话题详情
export const getCommentListWoods = (data) => post(`getCommentListWoods`,designSign(data)); // 评论列表
export const thingsDetail = (data) => post(`thingsDetail`,designSign(data)); // 宝贝详情
export const woodsPostDetail = (data) => post(`woodsPostDetail`,designSign(data)); // 树林动态详情
export const userWoodsIdentity = (data) => post(`userWoodsIdentity`,designSign(data)); // 树林身份
export const woodsDetail = (data) => post(`woodsDetail`,designSign(data)); // 树林详情
export const thingsList = (data) => post(`thingsList`,designSign(data)); // 宝贝列表
export const woodsPostList = (data) => post(`woodsPostList`,designSign(data)); // 动态列表
export const getWoodsNoticeDetail = (data) => post(`getWoodsNoticeDetail`,designSign(data)); // 公告详情
export const joinWoods = (data) => post(`joinWoods`,designSign(data)); // 加入树林

export const getActivityIndex = (data) => post(`getActivityIndex`,designSign(data)); // 99读书活动获取活动首页信息
export const getH5AddressArea = (data) => post(`getH5AddressArea`,designSign(data)); // 99读书活动获取省市区地址
export const getDefaultUserAddress = (data) => post(`getDefaultUserAddress`, designSign(data)); // 99读书活动获取用户默认的收货地址
export const confirmActivityOrder = (data) => post(`confirmActivityOrder`,designSign(data)); // 99读书确认订单活动礼包列表
export const addUserAddress = (data) => post(`addUserAddress`,designSign(data)); // 99读书添加修改收货地址
export const createBuyActivityWap = (data) => post(`createBuyActivityWap`,designSign(data)); // 99读书获取支付信息

export const giveUserFriendGift = (data) => post(`giveUserFriendGift`,designSign(data)); // 99读书赠送图书




