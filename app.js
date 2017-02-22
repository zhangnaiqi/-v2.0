import wx from 'labrador-immutable';

if (__DEV__) {
    console.log('当前为开发环境');
}

export default class {
    async onLaunch() {
        try {
            const sysInfo = await wx.getSystemInfo();
            this.sysInfo = sysInfo;
            // const position = await wx.getLocation();
            // this.position = position;
            console.log(`sysInfo: ${sysInfo}`);
        } catch (error) {
            console.error('startup:', error);
        }
    }
}