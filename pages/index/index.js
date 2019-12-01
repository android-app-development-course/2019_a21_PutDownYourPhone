//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue: '',
    imgs:[],
    self_info:{},
    skey:"",
    remindItems:{},
    identity:0,
    score:0
  },


  searchInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
    
  },

  search:function(){
    var tourl = "../searchResult/searchResult?value=" + this.data.inputValue;
    console.log(tourl)
    wx.navigateTo({
      url: tourl
    })
  },


  onLoad:function(e){

    //检查是否有skey已存储
    let that=this;
    let loginFlag = wx.getStorageSync('skey');
    if (loginFlag) {
      console.log("has skey");
      wx.checkSession({
        succss: function () {
          that.setData({
            skey:loginFlag
          })
        },
        fail: function () {
          //跳转前往登录
          wx.redirectTo({
            url: '../login/login'
          })
        }
      })
    }else{
      wx.redirectTo({
        url: '../login/login'
      })
    }


    //获取封面图片
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/respondIndexImg.php',
      method: "GET",
      dataType: 'json',
      success: function (res) {
        that.setData({
          imgs:res.data
        })
      }
    })
    that.setData({
      identity: parseInt(wx.getStorageSync('identity'))
    })

    this.getHomeworkRemind()
    this.getScore()

  },

  //获取最近一节课的平均专注度
  getScore:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/classScore.php',
      data:{
        skey:wx.getStorageSync('skey')
      },
      method: "GET",
      dataType: 'json',
      success:function(res){
        console.log(res.data)
        that.setData({
          score:res.data
        })
      }
    })
  },

  getHomeworkRemind:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/homeworkRemind.php',
      data:{
        skey:wx.getStorageSync('skey')
      },
      method: "GET",
      dataType: 'json',
      success:function(res){
        
        that.setData({
          remindItems: res.data
        })
        
      },
      fail(err){
        console.log(err)
      }
    })
  }



})