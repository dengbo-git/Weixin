
import {requestUrl} from '../../../../utils/url'
const qiniuUploader = require("../../../../utils/qiniuUploader");// index.js
// 初始化七牛云相关配置
function initQiniu(uptokenURL) {
    var options = {
      region: 'NCN',
      uptokenURL: uptokenURL,
      shouldUseQiniuFileName: true,
    };
    // 将七牛云相关配置初始化进本sdk
    qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
    data: {
        // 图片上传（从相册）返回对象。上传完成后，此属性被赋值
        imageObject: {},
        // 文件上传（从客户端会话）返回对象。上传完成后，此属性被赋值
        messageFileObject: {},
          // 文件在线查看来源fileUrl
        viewFileOnlineFileUrl: '',
        // 文件下载进度对象。用于文件在线查看前的预下载
        downloadFileProgress: {},
        //是否已经选择
        isChecked:false,
        // 此属性在qiniuUploader.upload()中被赋值，用于中断上传
        cancelTask: function () { }
    },
    //事件处理函数
    onLoad: function () {
        console.log('onLoad');
        
        var that = this;
    },
    // 图片上传（从相册）方法
    didPressChooesImage: function () {
        var that = this;
        didPressChooesImage(that);
    },
    didReChoice: function () {
      var that = this;
      didPressChooesImage(that);
    },
    confirmSubmit: function() {
      var that = this;
      confirmSubmit(that);
    }
  
});

// 图片上传（从相册）方法
function didPressChooesImage(that) {
  
    // 初始化七牛云配置
    // 置空messageFileObject，否则在第二次上传过程中，wxml界面会存留上次上传的信息
  
    
  
    // 微信 API 选择图片（从相册）
    wx.chooseImage({
        // 最多可以选择的图片张数。目前本sdk只支持单图上传，若选择多图，只会上传第一张图
        count: 1,
        success: function (res) {
            that.setData({
                'imageObject': {},
                'imageProgress': {}
            });
            var filePath = res.tempFilePaths[0];
            that.setData({
              'imageObject.fileURL' : filePath,
              'isChecked' : true
            })     
        }
    });
    
};
function confirmSubmit(that) {
  initQiniu(requestUrl+'/upLoadImg');
  qiniuUploader.upload(that.data.imageObject.fileURL, (res) => {
    console.log("上传完成，等待处理！");
    wx.request({
      url: requestUrl+'/handleImg',
      data:{
        token:wx.getStorageSync("token"),
        imgUrl:res.imageURL,
        type:1
      }
    })
  }, (error) => {
    console.error('error: ' + JSON.stringify(error));
  },
  null,
  (progress) => {
    that.setData({
        'imageProgress': progress
    });
    console.log('上传进度', progress.progress);
    console.log('已经上传的数据长度', progress.totalBytesSent);
    console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
  }, cancelTask => that.setData({ cancelTask })
  );  
}