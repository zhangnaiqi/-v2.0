const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable';

class CityIndex extends Component {
    state = {
        page: 1,
        height: 0,
        width: 0,
        playImg: "",
        playId: "",
        play: '',
        city: '',
        weather: '',
        currentTab: 0,
        cityStoryList: [],
        cityStoryNum: "",
        cityScenicList: [],
        cityScenicNum: '',
        showNearby: true, //显示附近
        cityName: '',
        cityId: ''
    };
    timer = null;
    async onLoad(options) {
        console.log("Options", options)
        const cityId = options.id || '549a647a6593ef1c008b470e';
        const city = options.city || '成都市';
        console.log("cityId", cityId, city)
        const res = await wx.getSystemInfo();
        console.log('systemInfo: ', res)

        this.setState({
            height: res.windowHeight,
            width: res.windowWidth,
            cityId: cityId,
            cityName: city
        });
    };
    onShareAppMessage() {
        return {
            title: '鱼说故事，处处风景',
            desc: '星球的每一处角落都蕴藏着不为人知的秘密与故事，点这里收听',
            path: '/pages/cityIndex/cityIndex',
        }
    };
    onReady() {
        console.log("this.state11111", this.state)
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        wx.setNavigationBarTitle({
            title: this.state.cityName || ""
        });
        this.request();
    };
    onShow() {
        // this.request();

        this.playState();
        this.setState({
            playImg: wx.app.playImg,
            playId: wx.app.playId
        });
    }
    async request() {
        console.log("this.state", this.state)
        try {
            const promiseAll = Promise.all([
                requests.weather(this.state.cityName),
                requests.getCityStory(this.state.cityId, this.state.page),
                requests.getCityScenice(this.state.cityId, this.state.page)
            ]);
            const [weathers, resp, cityScenic] = await promiseAll;
            console.log("resp", resp)
            wx.hideToast();
            this.setState({
                cityStoryList: resp.data.voices,
                cityScenicList: cityScenic.data.scenics,
                cityScenicNum: cityScenic.data.scenicNum,
                cityStoryNum: resp.data.voiceNum,
                weather: weathers.data.lives[0].temperature,
                showNearby: true
            });
        } catch (e) {
            console.log('get error: ', e);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }
    playState() {
        if (this.timer) return;
        const update = async() => {
            const res = await wx.getBackgroundAudioPlayerState();
            // console.log(res)
            this.setState({
                play: res.status
            })
        };
        update();
        this.timer = setInterval(update, 500);
    };
    swichNav(e) {
        var that = this;
        if (this.state.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setState({
                currentTab: e.target.dataset.current
            })
        }
    }
    toStory(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../story/story?id=' + id
        });
    };
    toSearch() {
        console.log('toSearch....')
        wx.navigateTo({
            url: '../newSearch/newSearch?id=' + this.state.cityId + '&city=' + this.state.cityName
        });
    };
    toScenicList() {
        console.log('toscenicList....')
        wx.navigateTo({
            url: '../scenicList/scenicList?id=' + this.state.cityId + '&city=' + this.state.cityName
        });
    };
    toStoryList() {
        console.log('toscenicList....')
        wx.navigateTo({
            url: '../storyList/storyList?id=' + this.state.cityId + '&city=' + this.state.cityName
        });
    };
    toSceniceSpots(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    onHide() {
        console.log('onHide	...')
        clearInterval(this.timer);
        this.timer = null;
    }
    async onPullDownRefresh() {
        this.request();
        wx.showToast({
            title: '刷新成功',
        });
        wx.stopPullDownRefresh();
    }
}

export default CityIndex;