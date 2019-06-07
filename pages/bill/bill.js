Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    textTopTips: "错误提示",

    indexOfBill: 0,
    arrayOfBill: [],

    formIndex: 0,
    objarr: [],

    billList: [],
    listCount: [],
    // 展开折叠
    selectedFlag: [],

  },

  /**
   * 表单提交事件
   */
  submit: function(e) {
    if (e.detail.value.add_bill == "") {
      this.setData({
        showTopTips: true,
        textTopTips: "账单名不能为空"
      })
    } else if (!isExistBill(e.detail.value.add_bill, this.data.indexOfBill, this.data.arrayOfBill)) {
      this.setData({
        showTopTips: true,
        textTopTips: "账单已存在"
      })
    } else {
      this.data.arrayOfBill.push(e.detail.value.add_bill);

      var tmp = 'Bill' + this.data.indexOfBill;
      wx.setStorageSync(tmp, e.detail.value.add_bill);
      this.setData({
        indexOfBill: this.data.indexOfBill + 1,
        arrayOfBill: this.data.arrayOfBill,
        showTopTips: true,
        textTopTips: "添加成功"
      });
      wx.setStorageSync('indexOfBill', this.data.indexOfBill);
      e.detail.value.add_bill = "";
    }
    this.onLoad();
    setTimeout(textTime, 2000, this);
  },

  /**
   * 跳转到编辑页面
   */
  editBill: function(e) {
    wx.navigateTo({
      url: '../editBill/editBill',
    })
  },

  /**
   * 展开折叠选择
   */ 
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    //console.log(index);
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 初始化账单分类
     */
    this.setData({
      indexOfBill: wx.getStorageSync('indexOfBill'),
    });
    if (!this.data.indexOfBill) {
      this.setData({
        indexOfBill: 1,
        arrayOfBill: ["默认"],
      })
      wx.setStorageSync('indexOfBill', this.data.indexOfBill);
      var tmp = "Bill0";
      wx.setStorageSync(tmp, this.data.arrayOfBill[0]);
    }
    else {
      for (var i = 0; i < this.data.indexOfBill; i++) {
        var tmp = "Bill" + i;
        this.data.arrayOfBill[i] = wx.getStorageSync(tmp);
      }
      this.setData({
        arrayOfBill: this.data.arrayOfBill,
      })
    }
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

    /**
     * 账单分类显示
     */
    var objarr = this.data.objarr;
    var newBillList = [];
    var newSelectedFlag = [];
    var newCount = [];
    for (var i = 0; i < this.data.indexOfBill; i++) {
      var count = 0;
      newBillList.push([]);
      newSelectedFlag.push(false);
      for (var j = 0; j < this.data.formIndex; j++) {
        if (objarr[j].add_bill == this.data.arrayOfBill[i]) {
          newBillList[i].push(objarr[j]);
          count++;
        }
      }
      newCount.push(count);
    }
    this.setData({
      billList: newBillList,
      selectedFlag: newSelectedFlag,
      listCount: newCount,
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
    this.setData ({
      showTopTips: false,
      textTopTips: "错误提示",

      indexOfBill: 0,
      arrayOfBill: [],

      formIndex: 0,
      objarr: [],

      billList: [],
      listCount: [],
      // 展开折叠
      selectedFlag: [],
    })
    /**
     * 初始化账单分类
     */
    this.setData({
      indexOfBill: wx.getStorageSync('indexOfBill'),
    });
    if (!this.data.indexOfBill) {
      this.setData({
        indexOfBill: 1,
        arrayOfBill: ["默认"],
      })
      wx.setStorageSync('indexOfBill', this.data.indexOfBill);
      var tmp = "Bill0";
      wx.setStorageSync(tmp, this.data.arrayOfBill[0]);
    }
    else {
      for (var i = 0; i < this.data.indexOfBill; i++) {
        var tmp = "Bill" + i;
        this.data.arrayOfBill[i] = wx.getStorageSync(tmp);
      }
      this.setData({
        arrayOfBill: this.data.arrayOfBill,
      })
    }
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

    /**
     * 账单分类显示
     */
    var objarr = this.data.objarr;
    var newBillList = [];
    var newSelectedFlag = [];
    var newCount = [];
    for (var i = 0; i < this.data.indexOfBill; i ++) {
      var count = 0;
      newBillList.push ([]);
      newSelectedFlag.push (false);
      for (var j = 0; j < this.data.formIndex; j ++) {
        if (objarr[j].add_bill == this.data.arrayOfBill[i]) {
          newBillList[i].push (objarr[j]);
          count ++;
        }
      }
      newCount.push (count);
    }
    this.setData ({
      billList: newBillList,
      selectedFlag: newSelectedFlag,
      listCount: newCount,
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

function isExistBill(billName, indexOfBill, arrayOfBill, ) {
  for (var i = 0; i < indexOfBill; i++) {
    if (billName == arrayOfBill[i])
      return false;
  }
  return true;
}

/**
 * 控制提示文本时间
 */
function textTime(that) {
  that.setData({
    showTopTips: false,
    textTopTips: ""
  })
}