const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable';

class Index extends Component {
    state = {
        id: '',
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
        nearbyStoryList: [],
        nearbySceniceList: [],
        loadingMore: false,
        nearbyStoryPage: 1,
        nearbyScenicesPage: 1,
        showNearby: true, //显示附近
        scrollTop: 0, //置顶高度
        position: false,
    };
    timer = null;
    async onLoad(options) {
        const res = await wx.getSystemInfo();
        console.log('systemInfo: ', res)
        const id = options.id;
        this.setState({
            height: res.windowHeight,
            width: res.windowWidth,
            id: id
        });
    };
    onShareAppMessage() {
        return {
            title: '鱼说故事，处处风景',
            desc: '星球的每一处角落都蕴藏着不为人知的秘密与故事，点这里收听',
            path: '/pages/index/index',
        }
    };
    onReady() {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        // this.request();
    };
    onShow() {
        console.log("onshow^^^^^^", wx.app.city, this.state.city)
        if (this.state.city != wx.app.city) {
            console.log("onshow")
            wx.pauseBackgroundAudio();
            this.request();
        }
        this.playState();
        this.setState({
            playImg: wx.app.playImg,
            playId: wx.app.playId
        });
    }
    async request() {
        console.log('==============request.......')
        if (!wx.app.position) {
            try {
                const position = await wx.getLocation();
                wx.app.position = position;
                this.setState({
                    position: false
                })
            } catch (err) {
                console.log('get position: ', err);
                this.setState({
                        position: true
                    })
                    // wx.redirectTo({
                    //     url: '../newindex/newindex'
                    // });
            }
        }
        if (wx.app.currentCity === wx.app.city) {
            this.setState({
                showNearby: true
            })
        } else {
            this.setState({
                showNearby: false
            })
        }
        if (this.state.city == wx.app.city || this.state.city == '') {
            console.log('11111111111================')
            try {
                const citys = await requests.city(wx.app.position.longitude, wx.app.position.latitude);
                const cityListData = await requests.getCity();
                wx.app.currentCity = citys.data.regeocode.addressComponent.city;
                let cityId = '';
                for (let i = 0; i < cityListData.data.length; i++) {
                    if (citys.data.regeocode.addressComponent.city == cityListData.data[i].city) {
                        console.log("当前城市：", cityListData.data[i].city)
                        cityId = cityListData.data[i].id
                        break
                    } else {
                        console.log("没有匹配")
                    }
                }
                //此处拿到城市id
                console.log(cityId);
                wx.app.city = citys.data.regeocode.addressComponent.city;
                wx.app.cityId = cityId;
                const promiseAll = Promise.all([
                    requests.weather(citys.data.regeocode.addressComponent.city),
                    requests.getCityStory(cityId, this.state.page),
                    requests.getCityScenice(cityId, this.state.page),
                    requests.getNearbyStory(wx.app.position.latitude, wx.app.position.longitude, this.state.page),
                    requests.getNearbyScenice(wx.app.position.latitude, wx.app.position.longitude, this.state.page)
                ]);
                const [weathers, resp, cityScenic, nearbyStory, nearbyScenice] = await promiseAll;
                // const weathers = await requests.weather(citys.data.regeocode.addressComponent.city);
                // const resp = await requests.getCityStory(cityId, this.state.page);
                const nearbyStorys = nearbyStory.data.result.items;
                for (let nearbyStorys of nearbyStorys) {
                    nearbyStorys.distance = Number(nearbyStorys.distance).toFixed(0);
                }
                const nearbyScenices = nearbyScenice.data.result.items;
                for (let nearbyScenices of nearbyScenices) {
                    nearbyScenices.distance = Number(nearbyScenices.distance).toFixed(0);
                }
                console.log("resp", resp)
                wx.hideToast();
                this.setState({
                    cityStoryList: resp.data.voices,
                    cityScenicList: cityScenic.data.scenics,
                    cityScenicNum: cityScenic.data.scenicNum,
                    nearbyStoryList: nearbyStorys,
                    nearbySceniceList: nearbyScenices,
                    cityStoryNum: resp.data.voiceNum,
                    city: citys.data.regeocode.addressComponent.city,
                    weather: weathers.data.lives[0].temperature
                });
            } catch (e) {
                console.log('get error: ', e);
                wx.showToast({
                    title: '请下拉刷新',
                    icon: 'loading',
                });
            }
        } else {
            console.log(222222222222)
            try {
                const promiseAll = Promise.all([
                    requests.weather(wx.app.city),
                    requests.getCityStory(wx.app.cityId, this.state.page),
                    requests.getCityScenice(wx.app.cityId, this.state.page),
                ]);
                const [weathers, resp, cityScenic] = await promiseAll;
                console.log("resp", resp)
                wx.hideToast();
                this.setState({
                    cityStoryList: resp.data.voices,
                    cityStoryNum: resp.data.voiceNum,
                    city: wx.app.city,
                    weather: weathers.data.lives[0].temperature,
                    cityScenicList: cityScenic.data.scenics,
                    cityScenicNum: cityScenic.data.scenicNum,
                });
            } catch (e) {
                console.log('get error: ', e);
                wx.showToast({
                    title: '请下拉刷新',
                    icon: 'loading',
                });
            }
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
    scroll(e) {
        console.log("scroll", e)
        this.setState({
            scrollTop: e.detail.scrollTop
        })
    }
    async loadMore(e) {
        console.log("load", e);
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            try {
                if (this.state.currentTab === 0) {
                    const res = await requests.getNearbyScenice(wx.app.position.latitude, wx.app.position.longitude, this.state.nearbyScenicesPage + 1)
                    let newScenice = [];
                    newScenice = this.state.nearbySceniceList;
                    console.log("load:", res.data.result.items, newScenice)
                    const nearbyScenices = res.data.result.items;
                    for (let nearbyScenices of nearbyScenices) {
                        nearbyScenices.distance = Number(nearbyScenices.distance).toFixed(0);
                    }
                    newScenice = newScenice.concat(nearbyScenices);
                    this.setState({
                        nearbySceniceList: newScenice,
                        nearbyScenicesPage: this.state.nearbyScenicesPage + 1,
                        loadingMore: false
                    })
                } else {
                    const res = await requests.getNearbyStory(wx.app.position.latitude, wx.app.position.longitude, this.state.nearbyStoryPage + 1)
                    let newStory = [];
                    newStory = this.state.nearbyStoryList;
                    console.log("load:", res.data.result.items, newStory)
                    const nearbyStorys = res.data.result.items;
                    for (let nearbyStorys of nearbyStorys) {
                        nearbyStorys.distance = Number(nearbyStorys.distance).toFixed(0);
                    }
                    newStory = newStory.concat(nearbyStorys);
                    this.setState({
                        nearbyStoryList: newStory,
                        nearbyStoryPage: this.state.nearbyStoryPage + 1,
                        loadingMore: false
                    })
                }

            } catch (e) {
                console.log('get error: ', e);
                wx.showToast({
                    title: '请下拉刷新',
                    icon: 'loading',
                });
            }

        }



    };
    toSwitchcity(e) {
        console.log('toSwitchcity....', e)
        const city = e.currentTarget.dataset.city;
        wx.navigateTo({
            url: '../switchcity/switchcity?city=' + city
        });
    };
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
            url: '../newSearch/newSearch'
        });
    };
    toScenicList() {
        console.log('toscenicList....')
        wx.navigateTo({
            url: '../scenicList/scenicList?id=' + wx.app.cityId + '&city=' + this.state.city
        });
    };
    toStoryList() {
        console.log('toscenicList....')
        wx.navigateTo({
            url: '../storyList/storyList?id=' + wx.app.cityId + '&city=' + this.state.city
        });
    };
    toSceniceSpots(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    toTop() {
        // this.setState({
        //         scrollTop: 0,
        //     })
        this.page.setData({
            "state.scrollTop": 0,
        })
    }
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

export default Index;