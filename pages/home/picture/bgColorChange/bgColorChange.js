const qiniuUploader = require("../../../../utils/qiniuUploader");
import {requestUrl} from '../../../../utils/url'
function initQiniu(uptokenURL) {
  var options = {
      // bucket所在区域
      region: 'NCN',
      uptokenURL: uptokenURL,
      shouldUseQiniuFileName: true,
    
  };
  // 将七牛云相关配置初始化进本sdk、
  console.log(options);
  qiniuUploader.init(options);
}
const app = getApp()
Page({
    data: {
        src: '',
        width: 250, //宽度
        height: 250, //高度
        max_width: 300,
        max_height: 300,
        disable_rotate: false, //是否禁用旋转
        disable_ratio: false, //锁定比例
        limit_move: false, //是否限制移动

        //是否已选择
        isChecked:false,
         // 图片上传（从相册）返回对象。上传完成后，此属性被赋值
         imageObject: {},
         // 文件上传（从客户端会话）返回对象。上传完成后，此属性被赋值
         messageFileObject: {},
         // 图片上传（从相册）进度对象。开始上传后，此属性被赋值
         imageProgress: {},
         // 文件上传（从客户端会话）进度对象。开始上传后，此属性被赋值
         messageFileProgress: {},
         // 文件在线查看来源fileUrl
         viewFileOnlineFileUrl: '',
         // 文件下载进度对象。用于文件在线查看前的预下载
         downloadFileProgress: {},
         // 此属性在qiniuUploader.upload()中被赋值，用于中断上传
         cancelTask: function () { }
    },

    onLoad: function (options) {
      
    },

    choosePicture: function (options) {
            this.cropper = this.selectComponent("#image-cropper");
            this.setData({
                src: options.imgSrc
            });
            if(!options.imgSrc){
                this.upload(); //上传图片
            }
        },
        cropperload(e) {
            console.log('cropper加载完成');
        },
        loadimage(e) {
            wx.hideLoading();
            console.log('图片');
            this.cropper.imgReset();
        },
        clickcut(e) {
            console.log(e.detail);
            //图片预览
            wx.previewImage({
                current: e.detail.url, // 当前显示图片的http链接
                urls: [e.detail.url] // 需要预览的图片http链接列表
            })
        },
        upload() {
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    const tempFilePaths = res.tempFilePaths[0];
                    //重置图片角度、缩放、位置
                    that.cropper.imgReset();
                    console.log(that);
                    that.setData({
                        src: tempFilePaths,
                        'isChecked' : true
                    });
                    
                }
            })
        },
        setWidth(e) {
            this.setData({
                width: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        setHeight(e) {
            this.setData({
                height: e.detail.value < 10 ? 10 : e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        switchChangeDisableRatio(e) {
            //设置宽度之后使剪裁框居中
            this.setData({
                disable_ratio: e.detail.value
            });
        },
        setCutTop(e) {
            this.setData({
                cut_top: e.detail.value
            });
            this.setData({
                cut_top: this.cropper.data.cut_top
            });
        },
        setCutLeft(e) {
            this.setData({
                cut_left: e.detail.value
            });
            this.setData({
                cut_left: this.cropper.data.cut_left
            });
        },
        switchChangeDisableRotate(e) {
            //开启旋转的同时不限制移动
            if (!e.detail.value) {
                this.setData({
                    limit_move: false,
                    disable_rotate: e.detail.value
                });
            } else {
                this.setData({
                    disable_rotate: e.detail.value
                });
            }
        },
        switchChangeLimitMove(e) {
            //限制移动的同时锁定旋转
            if (e.detail.value) {
                this.setData({
                    disable_rotate: true
                });
            }
            this.cropper.setLimitMove(e.detail.value);
        },
        switchChangeDisableWidth(e) {
            this.setData({
                disable_width: e.detail.value
            });
        },
        switchChangeDisableHeight(e) {
            this.setData({
                disable_height: e.detail.value
            });
        },
        uploadFile(imgFile){
          initQiniu(requestUrl+'/upLoadImg');
          qiniuUploader.upload(imgFile, (res) => {          
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
        null
        ,
        (progress) => {
            this.setData({
                'messageFileProgress': progress
            });
            console.log('上传进度', progress.progress);
            console.log('已经上传的数据长度', progress.totalBytesSent);
            console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend);
        }, cancelTask => this.setData({ cancelTask })
        );
        },
        submit() {
          var that = this;
            this.cropper.getImg((obj) => {
                app.globalData.imgSrc = obj.url;               
                that.uploadFile(app.globalData.imgSrc);
            });         
        },
        rotate() {
            //在用户旋转的基础上旋转90°
            this.cropper.setAngle(this.cropper.data.angle += 90);
        },
        top() {
            this.data.top = setInterval(() => {
                this.cropper.setTransform({
                    y: -3
                });
            }, 1000 / 60)
        },
        bottom() {
            this.data.bottom = setInterval(() => {
                this.cropper.setTransform({
                    y: 3
                });
            }, 1000 / 60)
        },
        left() {
            this.data.left = setInterval(() => {
                this.cropper.setTransform({
                    x: -3
                });
            }, 1000 / 60)
        },
        right() {
            this.data.right = setInterval(() => {
                this.cropper.setTransform({
                    x: 3
                });
            }, 1000 / 60)
        },
        narrow() {
            this.data.narrow = setInterval(() => {
                this.cropper.setTransform({
                    scale: -0.02
                });
            }, 1000 / 60)
        },
        enlarge() {
            this.data.enlarge = setInterval(() => {
                this.cropper.setTransform({
                    scale: 0.02
                });
            }, 1000 / 60)
        },
        end(e) {
            clearInterval(this.data[e.currentTarget.dataset.type]);
        },

            
})