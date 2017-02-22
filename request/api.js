const CAPI = 'https://capi.fishsaying.com';
const story = CAPI + '/capi/article/v2/article?article_id=';
const comments = CAPI + '/capi/v2/comments/'
    //  获取单条故事
const getStory = (Id) => {
        return story + Id;
    }
    //获取评论
const getComments = (commentId) => {
        return comments + commentId + '/comments?limit=20&page=1';
    }
    // 获取首页景点列表
const getIndexScenice = (id, page) => {
        return CAPI + '/capi/scenic/' + id + '/scenicSpots?&page=' + page + '&limit=15';
    }
    // 获取景区信息
const getJingqu = (id) => {
        return CAPI + '/capi/scenic/v2/' + id;
    }
    // 获取景区景点列表列表
const getSceniceStory = (id, page) => {
        return CAPI + '/capi/article/v2/scenics/voices?&scenics_id=' + id + '&page=' + page + '&limit=20';
    }
    //搜索
const search = (name) => {
        return CAPI + '/capi/search/global?keyword=' + name + '&page=1&limit=20';
    }
    //城市搜索
const citySearch = (name, cityId) => {
        return 'https://capi.fishsaying.com/capi/search/global?keyword=' + name + '&areaId=' + cityId + '&page=1&limit=20';
    }
    //行政区域
const city = (long, lat) => {
        return 'https://restapi.amap.com/v3/geocode/regeo?key=8c29c5ca7eea8480e49a571ea73aea6d&location=' + long + ',' + lat;
    }
    //天气
const weather = (city) => {
        return 'https://restapi.amap.com/v3/weather/weatherInfo?key=8c29c5ca7eea8480e49a571ea73aea6d&city=' + city;
    }
    //获取市级故事
const getCityStory = (cityId, page) => {
        return "https://capi.fishsaying.com/capi/scenic/city/voices/" + cityId + "?page=" + page + "&limit=20"
    }
    //获取市级景区
const getCityScenice = (cityId, page) => {
        return "https://capi.fishsaying.com/capi/scenic/city/scenics/" + cityId + "?page=" + page + "&limit=20"
    }
    //附近故事
const getNearbyStory = (lat, long, page) => {
        return "https://capi.fishsaying.com/capi/article/voices?latitude=" + lat + "&longitude=" + long + "&page=" + page + "&limit=20&radius=10000000"
    }
    //附近景区
const getNearbyScenice = (lat, long, page) => {
    return "https://capi.fishsaying.com/capi/scenic/near/scenics?lat=" + lat + "&lng=" + long + "&page=" + page + "&limit=20&radius=10000000"
}
module.exports = {
    getStory: getStory,
    getComments: getComments,
    getJingqu: getJingqu,
    getSceniceStory: getSceniceStory,
    search: search,
    getIndexScenice,
    city,
    weather,
    getCityStory,
    getCityScenice,
    getNearbyStory,
    getNearbyScenice,
    citySearch
};