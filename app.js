// app.js
import {requestUrl} from './utils/url'
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        wx.request({
          url: requestUrl+'/login/into',
          data:{
            jsCode:res.code,
          },
          success(res){
            console.log(res.data.msg);
            if(res.data.state=="1"){
              wx.setStorageSync("token",res.data.token);
              wx.setStorageSync("wxAvatarUrl",res.data.user.wxAvatarUrl);
              wx.setStorageSync("wxNickname",res.data.user.wxNickname);  
            }else if(res.data.state=="0"){
              wx.switchTab({
                url: '/pages/person/person',
              })
            }else if(res.data.state=="2"){
              var waring = {
                title:"您已被封禁！",
                content:"原因："+res.data.reason
              };
              wx.showModal(waring)
            }
          }
        })
      }
    });
  },
  
  globalData: {
    userInfo: null
  }
})
