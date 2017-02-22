import wx from 'labrador-immutable';

var util = require('../utils/util.js');
var api = require('./api.js');

var app = getApp();

//  网络请求方法
//   url ： 请求url
//   data ： 参数
//   successCallback ： 成功回调函数
//   errorCallback： 失败回调函数
//   completeCallback ： 完成回调函数
function requestData(url, data) {
    return requestDataWithRetry(url, data, 1);
}
async function requestDataWithRetry(url, data, retryTimes) {
    console.log(url, data, retryTimes);
    if (app.debug) {
        console.log('requestData url: ', url);
    }
    try {
        const result = await wx.request({
            url: url,
            data: data,
            header: { 'Content-Type': 'application/json' }
        });
        return result;
    } catch (e) {
        console.log('request error: ', e, ' retryTimes: ', retryTimes);
        if (retryTimes >= 3) {
            throw e;
        } else {
            return requestDataWithRetry(url, data, retryTimes + 1);
        }
    }
}

function getSuggestScenics() {
    const indexUrl = "https://api.fishsaying.com/indexScenicSpots.json"
    return requestData(indexUrl);
}
//获取行政区域列表
function getCity() {
    const indexUrl = "https://api.fishsaying.com/city.json"
    return requestData(indexUrl);
}
//获取故事详情
function getStory(newsId) {
    return requestData(api.getStory(newsId));
}
//获取故事评论
function getComments(commentId) {
    return requestData(api.getComments(commentId));
}
//获取景点下的故事列表
const getIndexScenice = (id, page) => {
        return requestData(api.getIndexScenice(id, page));
    }
    //获取景区信息
const getJingqu = (id) => {
        return requestData(api.getJingqu(id));
    }
    //获取景区下的故事列表
const getSceniceStory = (id, page) => {
        return requestData(api.getSceniceStory(id, page), {});
    }
    // 获取搜索热门
const hotsearch = () => {
        return requestData('https://capi.fishsaying.com/capi/search/hotsearch', {});
    }
    // 搜索
const search = (name) => {
    return requestData(api.search(name), {});
}
const citySearch = (name, cityId) => {
        return requestData(api.citySearch(name, cityId), {});
    }
    // 行政区域
const city = (long, lat) => {
        return requestData(api.city(long, lat), {});
    }
    // 天气
const weather = (city) => {
        return requestData(api.weather(city), {});
    }
    //获取市级故事
const getCityStory = (cityId, page) => {
        return requestData(api.getCityStory(cityId, page));
    }
    //获取市级景区
const getCityScenice = (cityId, page) => {
        return requestData(api.getCityScenice(cityId, page));
    }
    //附近故事
const getNearbyStory = (lat, long, page) => {
    return requestData(api.getNearbyStory(lat, long, page));
}
const getNearbyScenice = (lat, long, page) => {
    return requestData(api.getNearbyScenice(lat, long, page));
}
module.exports = {
    requestData,
    getSuggestScenics,
    getStory: getStory,
    getComments: getComments,
    getIndexScenice,
    getJingqu: getJingqu,
    getSceniceStory: getSceniceStory,
    hotsearch: hotsearch,
    search: search,
    city,
    weather,
    getCity,
    getCityStory,
    getCityScenice,
    getNearbyStory,
    getNearbyScenice,
    citySearch
};