const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable'
import _ from 'lodash';

class NewSearch extends Component {
    constructor() {
        super();
        this.inputValue = _.debounce(this.inputValue, 200);
    }
    state = {
        id: "",
        page: 1,
        height: 0,
        width: 0,
        hotsearch: [],
        story: {},
        scenics: {},
        figures: {},
        cloudguides: {},
        searchTitle: '',
        loadingMore: false,
        record: [],
        cityId: '',
        city: '',
        hot: true
    };

    async onLoad(options) {
        console.log("Options", options)
        const cityId = options.id || '';
        const city = options.city || '';
        console.log("cityId", cityId, city)
        this.setState({ cityId: cityId, city: city });
        if (cityId === '') {
            this.setState({
                hot: true
            })
        } else {
            this.setState({
                hot: false
            })
        }
        try {
            const res = await wx.getSystemInfo();
            this.setState({
                record: wx.getStorageSync('record') || [],
                height: res.windowHeight,
                width: res.windowWidth
            });
        } catch (err) {
            console.log('getSystemInfo ', err);
        }
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
        wx.setNavigationBarTitle({
            title: this.state.city || ""
        });
        this.request();
    };

    async request() {
        const promiseAll = Promise.all([
            requests.hotsearch(),
        ]);
        try {
            const [res] = await promiseAll;
            wx.hideToast();
            console.log("res:", res)
            this.setState({
                hotsearch: res.data.result.items,
            })
        } catch (e) {
            console.log('request ', err);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }

    inputValue(e) {
        console.log(e.detail.value)
        this.setState({
            searchTitle: e.detail.value
        })
        const searchName = encodeURI(e.detail.value);
        console.log("searchName", searchName)
        if (searchName !== '') {
            this.search(searchName);
        }
    }

    async search(data) {
        console.log("this.state.cityId", this.state.cityId)
        try {
            if (this.state.cityId !== '') {
                console.log("1111111111")
                const res = await requests.citySearch(data, this.state.cityId);
                this.setState({
                    searchName: data,
                    story: res.data.result.articles,
                    scenics: res.data.result.scenics,
                    figures: res.data.result.figures,
                    cloudguides: res.data.result.cloudguides
                })
            } else {
                console.log("2222222222")
                const res = await requests.search(data);
                this.setState({
                    searchName: data,
                    story: res.data.result.articles,
                    scenics: res.data.result.scenics,
                    figures: res.data.result.figures,
                    cloudguides: res.data.result.cloudguides
                })
            }

            console.log("res", res)

        } catch (e) {
            console.log('search ', err);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }
    hotSearch(e) {
        this.setState({
            searchTitle: e.currentTarget.dataset.searchname
        })
        const searchName = encodeURI(e.currentTarget.dataset.searchname);
        console.log("encodeURI", searchName)
        this.search(searchName);
    }
    clear() {
        wx.clearStorageSync();
        let record = wx.getStorageSync('record');
        this.setState({
            record: record,
        })
    }
    toSceniceSpots(e) {
        let record = wx.getStorageSync('record');
        if (!record.unshift) record = [];
        console.log("record:", record);
        if (record.length !== 0) {
            for (let i = 0; i < record.length; i++) {
                console.log("record:", record[i], "name", this.state.searchName)
                if (this.state.searchName == encodeURI(record[i])) {
                    break
                } else {
                    if (record.length >= 10) {
                        console.log('after sync..', record)
                        record.pop();
                        record.unshift(decodeURI(this.state.searchName));
                        wx.setStorageSync('record', record);
                        console.log('after setsync...')
                        this.setState({
                            record: record,
                        })
                        break
                    } else {
                        record.unshift(decodeURI(this.state.searchName));
                        wx.setStorageSync('record', record);
                        console.log('after setsync...')
                        this.setState({
                            record: record,
                        })
                        break
                    }

                }
            }
        } else {
            console.log("else^^^^^^^^^^^^")
            if (record.length >= 10) {
                record.pop();
                record.unshift(decodeURI(this.state.searchName));
                wx.setStorageSync('record', record);
                console.log('after setsync...')
                this.setState({
                    record: record,
                })
            } else {
                record.unshift(decodeURI(this.state.searchName));
                wx.setStorageSync('record', record);
                console.log('after setsync...')
                this.setState({
                    record: record,
                })
            }
        }
        console.log(e)

        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    toStory(e) {
        let record = wx.getStorageSync('record');
        if (!record.unshift) record = [];
        console.log("record:", record);
        if (record.length !== 0) {
            for (let i = 0; i < record.length; i++) {
                console.log("record:", record[i], "name", this.state.searchName)
                if (this.state.searchName == encodeURI(record[i])) {
                    break
                } else {
                    if (record.length >= 10) {
                        console.log('after sync..', record)
                        record.pop();
                        record.unshift(decodeURI(this.state.searchName));
                        wx.setStorageSync('record', record);
                        console.log('after setsync...')
                        this.setState({
                            record: record,
                        })
                        break
                    } else {
                        record.unshift(decodeURI(this.state.searchName));
                        wx.setStorageSync('record', record);
                        console.log('after setsync...')
                        this.setState({
                            record: record,
                        })
                        break
                    }

                }
            }
        } else {
            console.log("else^^^^^^^^^^^^")
            if (record.length >= 10) {
                record.pop();
                record.unshift(decodeURI(this.state.searchName));
                wx.setStorageSync('record', record);
                console.log('after setsync...')
                this.setState({
                    record: record,
                })
            } else {
                record.unshift(decodeURI(this.state.searchName));
                wx.setStorageSync('record', record);
                console.log('after setsync...')
                this.setState({
                    record: record,
                })
            }
        }
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../story/story?id=' + id
        });
    };
    async onPullDownRefresh() {
        this.state.page = 1;
        await this.request();
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }

}
export default NewSearch;