Page({

  /**
   * 页面的初始数据
   */
  data: {
    testData: 0.0,
    all_in_money: 0.00,
    all_out_money: 0.00,

    formIndex: 0,
    objarr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData ({
        all_in_money: wx.getStorageSync('all_in'),
        all_out_money: wx.getStorageSync('all_out'),
    });
    if (!this.data.all_in_money) {
      this.setData({
        all_in_money: 0.0
      });
      wx.setStorageSync('all_in', this.data.all_in_money);
    }
    if (!this.data.all_out_money) {
      this.setData({
        all_out_money: 0.0
      });
      wx.setStorageSync('all_out', this.data.all_out_money);
    }
    this.setData({
      all_in_money: parseFloat(wx.getStorageSync('all_in').toFixed(2)),
      all_out_money: parseFloat(wx.getStorageSync('all_out').toFixed(2)),
    });

    this.setData({
      formIndex: wx.getStorageSync('formIndex')
    })
    if (!this.data.formIndex) {
      this.setData({
        formIndex: 0,
      })
      wx.setStorageSync('formIndex', this.data.formIndex);
    }

    for (var i = 0; i < this.data.formIndex; i ++) {
      var formIndex = 'form' + i;
      this.data.objarr.push(wx.getStorageSync(formIndex));
    }
    this.setData({
      objarr: this.data.objarr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /**
     * 获取总收入支出
     */
    this.setData({
      all_in_money: parseFloat(wx.getStorageSync('all_in').toFixed(2)),
      all_out_money: parseFloat(wx.getStorageSync('all_out').toFixed(2)),
    });

    /**
     * 获取流水
     */
    this.setData({
      formIndex: wx.getStorageSync('formIndex')
    })

    for (var i = this.data.objarr.length; i < this.data.formIndex; i++) {
      var formIndex = 'form' + i;
      this.data.objarr.push(wx.getStorageSync(formIndex));
    }
    this.setData({
      objarr: this.data.objarr
    })
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})

