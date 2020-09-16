// var root = process.env.VUE_APP_API_URL;
import axios from "axios";
import qs from "qs";
import store from '../../store';
import {
    Toast
} from "vant";
import clearStorage from './clear'
// import router from '../../router'
import {GetQueryString} from '../utils/mixin'

var root =store.state.UserInfo.baseURL.test;



console.log('root', root)

// axios 配置

axios.defaults.timeout = 50000;

axios.defaults.baseURL = root + '/api';

axios.defaults.withCredentials = false;

// http request 拦截器

axios.interceptors.request.use( //请求前拦截

    config => {

        console.log(config)
        if (config.method == "post" && config.url.indexOf("/upload/img") <= 0) {
            config.data = qs.stringify(config.data);
        }
        if (config.method == "post" && config.url.indexOf("/upload/img") > 0) {
            config.headers = {
                Accept: "application/json, text/javascript, */*",
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryhwvBOffcBtcVGV8f"
            };
        } else {
            config.headers = {
                Accept: "application/json, text/javascript, */*",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            };

        }
        return config;
    },

    err => {

        return Promise.reject(err);

    }

);



// http response 拦截器

axios.interceptors.response.use(
    response => {
        // console.log(response, 92)
        //请先登录
        if (response.data.code == "1001" || response.data.code == "1003" || response.data.code == "1410" ) {
            // 错误
            let instance = Toast(response.data.msg);
            let tem = null;
            console.log(response.data);
            // return false;
            // 清除Session
            clearStorage();
            tem = setTimeout(() => {
                instance.close();
                // router.push("/h5");
                toUrl();
                clearTimeout(tem);
            }, 1000);
            throw response.data.msg; //返回错误中断请求
        }
        return response;
    },

    error => {

        //请先登录

        if (error.response.data.status == 2) {

            //请重新登录
            let tem = null;
            let instance = Toast(error.response.data.msg);
            // 清除Session
            clearStorage();
            tem = setTimeout(() => {
                instance.close();
                toUrl();
                clearTimeout(tem);
            }, 1000);

            return false;

        }

        return Promise.reject(error.response.data);

    }

);

function toUrl(){
    console.log(123123123)
    let url = window.location.href;
    let indexBegin = url.indexOf('h5/');
    let indexEnd = url.indexOf('?');
    let str = url.slice(indexBegin+3,indexEnd)
    let urlParams='';
    switch(str){
      case 'answer':
        urlParams='questionnaire'
        break;
      case 'article':
        urlParams='article&relation_id=' + GetQueryString('article_id')
        break;
      case 'userPostDetail':
        urlParams='userPostDetail&relation_id=' + GetQueryString('post_id')
        break;  
      case 'userTopicDetail':
        urlParams='userTopicDetail&relation_id=' + GetQueryString('topic_id');
        break;  
      case 'woodsDetail':
        urlParams='woodsDetail&relation_id=' + GetQueryString('woods_id');
        break; 
      case 'notice':
        urlParams='notice&relation_id=' + GetQueryString('notice_id');
        break;
      case 'woodsPost':
        urlParams='woodsPost&relation_id=' + GetQueryString('woods_post_id');
        break;
      case 'thing':
        urlParams='thing&relation_id=' + GetQueryString('thing_id');
        break;
      default:
        urlParams='h5login&relation_id=' + GetQueryString('course_id');
        if(GetQueryString('invite')){
          urlParams = urlParams+ "&invite=" + GetQueryString('invite')
        }
        break;
    }
    window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view='+urlParams;
}


export function fetch(url, params = {}) {

    return new Promise((resolve, reject) => {

        axios.get(url, {
                params: params
            })

            .then(response => {

                resolve(response.data);

            })

            .catch(err => {

                reject(err);

            });

    });

}




export function post(url, data = {}, responseType) {
    console.log('url', url)

    return new Promise((resolve, reject) => {
        axios.post(url, data, responseType).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}





export function patch(url, data = {}) {

    return new Promise((resolve, reject) => {

        axios.patch(url, data).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}




export function put(url, data = {}) {

    return new Promise((resolve, reject) => {

        axios.put(url, data).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}

export function get(url, data = {}) {
    console.log(data, 'data')
    return new Promise((resolve, reject) => {

        axios.get(url, {
            params: data
        }).then(

            response => {

                resolve(response.data);

            },

            err => {

                reject(err);

            }

        );

    });

}



export function regist(val) {

    Toast(val);

}