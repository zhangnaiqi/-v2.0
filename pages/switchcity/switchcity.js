const requests = require('../../request/request.js');
import wx, { Component, PropTypes } from 'labrador-immutable';
class Switchcity extends Component {
    state = {
        searchLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
        showLetter: "",
        winHeight: 0,
        // tHeight: 0,
        // bHeight: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0, //置顶高度
        scrollTopId: '', //置顶id
        city: "",
        cityId: "",
        hotcityList: [
            { id: '549a647a6593ef1c008b460e', cityCode: 110000, city: '北京市' },
            { id: '549a647a6593ef1c008b4656', cityCode: 310000, city: '上海市' },
            { id: '549a647a6593ef1c008b46d5', cityCode: 440100, city: '广州市' },
            { id: '549a647a6593ef1c008b46d7', cityCode: 440300, city: '深圳市' },
            { id: '549a647a6593ef1c008b4664', cityCode: 330100, city: '杭州市' },
            { id: '549a647a6593ef1c008b4657', cityCode: 320100, city: '南京市' },
            { id: '549a647a6593ef1c008b46b6', cityCode: 420100, city: '武汉市' },
            { id: '549a647a6593ef1c008b46a4', cityCode: 410100, city: '郑州市' },
            { id: '549a647a6593ef1c008b460f', cityCode: 120000, city: '天津市' },
            { id: '549a647a6593ef1c008b4743', cityCode: 610100, city: '西安市' },
            { id: '549a647a6593ef1c008b470e', cityCode: 510100, city: '成都市' },
            { id: '549a647a6593ef1c008b470d', cityCode: 500000, city: '重庆市' }
        ]
    };

    async onLoad(e) {
        // 生命周期函数--监听页面加载
        console.log(e)
        const searchLetter = this.state.searchLetter;
        let cityObj = [];
        console.log("wx.app.cityObj", wx.app.cityObj)
        if (!wx.app.cityObj) {
            // console.log("11111111")
            const cityListData = await requests.getCity();
            // console.log("11111111222222")
            wx.app.cityObj = cityListData.data;
            cityObj = cityListData.data;
            console.log("cityObj", cityObj)
        } else {
            // console.log("2222222")
            cityObj = wx.app.cityObj;
        }
        // console.log(" hou ", cityObj)
        const templist = [];
        for (var i = 0; i < searchLetter.length; i++) {
            var initial = searchLetter[i];
            var cityInfo = [];
            var tempArr = {};
            tempArr.initial = initial;
            for (var j = 0; j < cityObj.length; j++) {
                if (initial == cityObj[j].initial) {
                    cityInfo.push(cityObj[j]);
                }
            }
            tempArr.cityInfo = cityInfo;
            templist.push(tempArr);
            // console.log(" templist ", templist)
        }
        // console.log("cityListData", cityListData)
        // console.log(" templist ", templist)
        const cityList = templist;
        const sysInfo = wx.getSystemInfoSync();
        const winHeight = sysInfo.windowHeight;
        const itemH = winHeight / searchLetter.length;
        const tempObj = [];
        for (let i = 0; i < searchLetter.length; i++) {
            const temp = {};
            temp.name = searchLetter[i];
            temp.tHeight = i * itemH;
            temp.bHeight = (i + 1) * itemH;
            tempObj.push(temp)
        }
        this.setState({
            // city: e.city,
            winHeight: winHeight,
            itemH: itemH,
            searchLetter: tempObj,
            cityList: cityList
        })
        console.log(tempObj, cityList)
    };
    onReady() {
        this.location();
    };

    clickLetter(e) {
        console.log(e.currentTarget.dataset.letter)
        const showLetter = e.currentTarget.dataset.letter;
        this.page.setData({
                "state.showLetter": showLetter,
                "state.isShowLetter": true,
                "state.scrollTopId": showLetter,
            })
            // this.setState({
            //     showLetter: showLetter,
            //     isShowLetter: true,
            //     scrollTopId: showLetter,
            // })
        console.log(this.state.showLetter)
        const that = this;
        setTimeout(function() {
            that.page.setData({
                    "state.isShowLetter": false,
                })
                // that.setState({
                //     isShowLetter: false
                // })
        }, 1000)
    };
    //定位
    async location() {
            console.log("location.......")
            let cityObj = [];
            const citys = await requests.city(wx.app.position.longitude, wx.app.position.latitude);
            if (!wx.app.cityObj) {
                console.log("location1111.......")
                const cityListData = await requests.getCity();
                wx.app.cityObj = cityListData.data;
                cityObj = cityListData.data;
            } else {
                console.log("location2222.......")
                cityObj = wx.app.cityObj;
            }
            console.log("location333.......")
            let cityId = '';
            for (let i = 0; i < cityObj.length; i++) {
                if (citys.data.regeocode.addressComponent.city == cityObj[i].city) {
                    console.log("当前城市：", cityObj[i].city)
                    cityId = cityObj[i].id
                    break
                } else {
                    console.log("没有匹配")
                }
            }
            this.setState({
                city: citys.data.regeocode.addressComponent.city,
                cityId: cityId
            })
        }
        //选择城市
    bindCity(e) {
        console.log(e)
        wx.app.city = e.currentTarget.dataset.city;
        wx.app.cityId = e.currentTarget.dataset.id;
        wx.navigateBack({
            delta: 1
        })
        this.setState({ city: e.currentTarget.dataset.city })
    };
    //选择热门城市
    bindHotCity(e) {
        console.log("bindHotCity")
        wx.app.city = e.currentTarget.dataset.city;
        wx.app.cityId = e.currentTarget.dataset.id;
        wx.navigateBack({
            delta: 1
        })
        this.setState({
            city: e.currentTarget.dataset.city
        })
    };
    scroll(e) {
            console.log("scroll", e)
            this.page.setData({
                "state.scrollTop": e.detail.scrollTop
            })
        }
        //点击热门城市回到顶部
    hotCity() {
        // this.setState({
        //     scrollTop: 0,
        // })
        this.page.setData({
            "state.scrollTop": 0,
        })
    }

}
export default Switchcity;