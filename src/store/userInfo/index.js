const state = {
    token: localStorage.getItem(`token`) || 1, //token
    code:localStorage.getItem(`code`)||'', //code
    wx_info:JSON.parse(localStorage.getItem(`wx_info`))||{}, //微信个人信息
    url_api : localStorage.getItem(`url_api`)||`http://yygame_admin.youziqipai.cn`||'', //微信请求地址
    share_link:localStorage.getItem(`share_link`)||``, //分享链接
    baseURL: JSON.parse(localStorage.getItem(`base_url`) ) //axios的默认请求地址
        || {
        production: '//qtsxapi.qingtingshuxia.com',
        test: '//qtsxapi.qingtingshuxia.com',
        dev:'http://192.168.1.198'
        },
    appName: JSON.parse(localStorage.getItem(`app_name`)) || '',//项目名称
    appId: JSON.parse(localStorage.getItem(`app_id`)) || 10,//项目名称
    timestamp:JSON.parse(localStorage.getItem(`timestamp`)) || 0
};
const mutations = {
    //保存token
    SAVE_TOKEN(state, token) {
        localStorage.setItem(`token`,token)
        state.token = token;
    },
    //保存token
    SAVE_CODE(state, code) {
        localStorage.setItem(`code`,code)
        state.code = code;
    },
    //保存个人信息
    SAVE_Wx_INFO(state, wx_info) {
        localStorage.setItem(`wx_info`, JSON.stringify(wx_info))
        state.wx_info = wx_info;
    },
     //保存分享链接
     SAVE_SHARE_LINK(state, share_link) {
        localStorage.setItem(`share_link`, JSON.stringify(share_link))
        state.share_link = share_link;
    },
     //保存请求地址
    SAVE_URL_API(state, url_api) {
        localStorage.setItem(`url_api`, JSON.stringify(url_api))
        state.url_api = url_api;
    },
    //保存AXIOS请求地址
    SAVE_BASEURL(state, baseURL) {
        localStorage.setItem(`base_url`, JSON.stringify(baseURL))
        state.baseURL = baseURL;
    },
     //保存项目名称
     SAVE_APPNAME(state, app_name) {
        localStorage.setItem(`app_name`, JSON.stringify(app_name))
        state.appName = app_name;
    },
      //保存项目名称id
      SAVE_APPID(state, app_id) {
        localStorage.setItem(`app_id`, JSON.stringify(app_id))
        state.appId = app_id;
    },
      //保存秒的时间
      SAVE_TIME_TAMP(state, timestamp) {
        localStorage.setItem(`timestamp`, JSON.stringify(timestamp))
        state.timestamp = timestamp;
    },
};

const actions = {
    saveToken({
        commit
    }, token) {
        commit("SAVE_TOKEN", token)
    },
    saveCode({
        commit
    }, code) {
        commit("SAVE_CODE", code)
    },
    saveWxInfo({
        commit
    }, wx_info) {
        commit("SAVE_Wx_INFO", wx_info)
    },
    shareLink({
        commit
    }, share_link) {
        commit("SAVE_SHARE_LINK", share_link)
    },
    url_api({
        commit
    }, url_api) {
        commit("SAVE_URL_API", url_api)
    },
    base_url({
        commit
    }, base_url) {
        commit("SAVE_BASEURL", base_url)
    },
    app_name({
        commit
    }, app_name) {
        commit("SAVE_APPNAME", app_name)
    },
    app_id({
        commit
    }, app_id) {
        commit("SAVE_APPID", app_id)
    },
    times_tamp({
        commit
    }, timestamp) {
        commit("SAVE_TIME_TAMP", timestamp)
    }
};
const getters = {

};

// 不要忘记把state, mutations等暴露出去。
export default {
    state,
    mutations,
    actions,
    getters
}