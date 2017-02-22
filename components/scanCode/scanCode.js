const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable'

class ScanCode extends Component {
    async sys() {
        const res = await wx.scanCode();
        console.log(res);
        const arr = res.result.split('/');
        const id = arr.pop().split('?')[0];
        const genre = arr.pop();
        if (genre === "ScenicRegion") {
            console.log('str', genre)
            wx.navigateTo({
                url: '../jingqu/jingqu?id=' + id
            });
        } else if (genre === "scenicSpot") {
            console.log('scenicSpot', genre)
            wx.navigateTo({
                url: '../scenicSpots/scenicSpots?id=' + id
            });
        } else if (genre === "scenic") {

        } else if (genre === "voice") {
            console.log('voice', genre)
            wx.navigateTo({
                url: '../story/story?id=' + id
            });
        }
    }
}
export default ScanCode;