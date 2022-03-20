// index.js
// 获取应用实例

import {requestUrl} from '../../utils/url'
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  goTo(data){
    wx.navigateTo({
      url: '/pages/person/'+data.currentTarget.id+'/'+data.currentTarget.id,
    })
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {   
    
    var wxAvatarUrl = wx.getStorageSync('wxAvatarUrl');
    var wxNickname = wx.getStorageSync('wxNickname');
    
    if(wxAvatarUrl!=null&&wxAvatarUrl!=""){
      var user = {
        userInfo:{
          avatarUrl:wxAvatarUrl,
          nickName:wxNickname
        }
      }
      this.setData({
        userInfo: user.userInfo,
        hasUserInfo: true
      });
    }
  },

  getUserProfile(e) {
    
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (user) => {        
        let that = this;
        wx.login({
          success: res => {
            var predata = user.userInfo;
            predata['jsCode'] = res.code;
            wx.request({
              url: requestUrl+'/login/into',
              data: predata,
              success(res){
                console.log(res.data.msg);
                if(res.data.state==1){
                  wx.setStorageSync("wxAvatarUrl",res.data.user.wxAvatarUrl);
                  wx.setStorageSync("wxNickname",res.data.user.wxNickname);
                  wx.setStorageSync("token",res.data.token);
                  that.setData({
                    userInfo: user.userInfo,
                    hasUserInfo: true
                  });
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
      }
    })
  },
})
