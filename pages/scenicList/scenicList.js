import wx, { Component, PropTypes } from 'labrador-immutable';

const requests = require('../../request/request.js');

class ScenicList extends Component {
    state = {
        id: "",
        city: '',
        page: 1,
        scenicList: [],
        scenicListNum: '',
        height: 0,
        width: 0,
        loadingMore: false,
        scrollTop: 0,
    };

    async onLoad(options) {
        console.log("options:", options)
        const res = await wx.getSystemInfo();
        this.setState({
            height: res.windowHeight,
            width: res.windowWidth
        });
        const id = options.id;
        const city = options.city;
        this.setState({ id: id, city: city });
    };
    onShareAppMessage() {
        return {
            title: this.state.scenic.title,
            desc: '为你收集了关于这里的所有故事，点这儿收听'
        }
    };
    onShareAppMessage() {
        return {
            title: '鱼说故事，处处风景',
            desc: '星球的每一处角落都蕴藏着不为人知的秘密与故事，点这里收听',
            path: '/pages/scenicList/scenicList',
        }
    };
    async onReady() {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        this.request()
    };

    async request() {
        try {
            const promiseAll = Promise.all([
                requests.getCityScenice(this.state.id, this.state.page),
            ]);
            const [resp] = await promiseAll;
            wx.hideToast();
            wx.setNavigationBarTitle({
                title: this.state.city + '景区' || ""
            })
            console.log("resp:", resp.data.scenics)
            let ar = [];
            let k = 0;
            for (var i = 0; i < 20; i++) {
                k = Math.floor(i / 5);
                if (!ar[k]) ar[k] = [];
                ar[k][i % 5] = resp.data.scenics[i];
            }
            console.log("ar:", ar)
            this.setState({
                scenicList: ar,
                scenicListNum: resp.data.scenicNum
            })
        } catch (e) {
            console.log('get error: ', e);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }
    scroll(e) {
        console.log("scroll", e)
        this.setState({
            scrollTop: e.detail.scrollTop
        })
    };
    toTop(e) {
        console.log("toTop", e)
            // this.setState({
            //         scrollTop: 0,
            //     })
        this.page.setData({
            "state.scrollTop": 0,
        })
    };

    toSceniceSpots(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    async loadMore() {
        console.log("load")
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            try {
                const res = await requests.getCityScenice(this.state.id, this.state.page + 1);
                let newscenicList = [];
                newscenicList = this.state.scenicList;
                console.log("load:", res.data.scenics, newscenicList)
                let ar = [];
                let k = 0;
                for (var i = 0; i < 20; i++) {
                    k = Math.floor(i / 5);
                    if (!ar[k]) ar[k] = [];
                    ar[k][i % 5] = res.data.scenics[i];
                }
                newscenicList = newscenicList.concat(ar);
                console.log("ar:", newscenicList)
                this.setState({
                    scenicList: newscenicList,
                    page: this.state.page + 1,
                    loadingMore: false
                })
            } catch (e) {
                console.log('get error: ', e);
                wx.showToast({
                    title: '请下拉刷新',
                    icon: 'loading',
                });
            }

        }
    };
    async onPullDownRefresh() {
        console.log('scenicSpots onPullDownRefresh...');
        this.state.page = 1;
        console.log(this.state.page);
        await this.request();
        console.log('scenicSpots onPullDownRefresh...request again..');
        this.setState({
            loadingMore: false
        })
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }
}

export default ScenicList;