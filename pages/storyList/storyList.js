const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable'

class StoryList extends Component {
    state = {
        id: "",
        city: "",
        page: 1,
        height: 0,
        width: 0,
        storyList: [],
        loadingMore: false,
        scrollTop: 0,
    };

    async onLoad(options) {

        try {
            const id = options.id;
            const city = options.city;
            const res = await wx.getSystemInfo();
            this.setState({
                height: res.windowHeight,
                width: res.windowWidth,
                id: id,
                city: city
            });
        } catch (err) {
            console.log('getSystemInfo ', err);
        }
    };
    onShareAppMessage() {
        return {
            title: '鱼说故事，处处风景',
            desc: '星球的每一处角落都蕴藏着不为人知的秘密与故事，点这里收听',
            path: '/pages/storyList/storyList',
        }
    };
    onReady() {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        this.request();
    };

    async request() {
        console.log("request")
        try {
            console.log("request-------------------------")
            const res = await requests.getCityStory(this.state.id, this.state.page);
            wx.hideToast();
            wx.setNavigationBarTitle({
                title: this.state.city + '故事' || ""
            })
            console.log("res:", res, )
            this.setState({
                storyList: res.data.voices
            })
        } catch (e) {
            console.log('request ', err);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }




    async loadMore() {
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            try {
                const res = await requests.getCityStory(this.state.id, this.state.page + 1);
                let newstoryList = [];
                newstoryList = this.state.storyList;
                console.log("load:", res.data.scenics, newstoryList)
                newstoryList = newstoryList.concat(res.data.voices);
                console.log("newstoryList:", newstoryList)
                this.setState({
                    storyList: newstoryList,
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
    scroll(e) {
        console.log("scroll", e)
        this.setState({
            scrollTop: e.detail.scrollTop
        })
    }
    toTop() {
        this.page.setData({
            "state.scrollTop": 0,
        })
    }
    toStory(e) {
        console.log(e)
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
        this.setState({
            loadingMore: false
        })
    }

}
export default StoryList;