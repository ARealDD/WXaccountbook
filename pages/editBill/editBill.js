// pages/editBill/editBill.js
var strEditBillName = "";
var intEditBillId = 0;
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexOfBill: 0,
    arrayOfBill: [],

    editBillId: 0,
    editBillName: "",
    hiddenmodalput: true,
  },

  /**
   * 删除账单  
   */
  btnBillDelete: function(e) {
    var that = this;
    var billId = e.target.dataset.id;
    var billName = e.target.dataset.name;
    console.log("删除账单：", e.target.dataset);
    wx.showModal({
      title: '删除账单',
      content: '你是否要将【' + billName + '】账单删除？' + '\n同时会删除相关账目',
      cancelText: '否',
      confirmText: '是',
      confirmColor: '#e51c23',
      success: function (res) {
        if (res.confirm) {
          var i;
          for (i = billId; i < that.data.indexOfBill - 1; i++) {
            that.data.arrayOfBill[i] = that.data.arrayOfBill[i + 1];
          }
          var tmp = "Bill" + i;
          wx.removeStorageSync(tmp);
          that.data.arrayOfBill.splice(i, 1);
          that.setData({
            indexOfBill: that.data.indexOfBill - 1,
            arrayOfBill: that.data.arrayOfBill,
          })
          for (i = 0; i < that.data.indexOfBill; i++) {
            var tmp = "Bill" + i;
            wx.setStorageSync(tmp, that.data.arrayOfBill[i]);
          }
          wx.setStorageSync('indexOfBill', that.data.indexOfBill);
          /**
           * 删除相关账目
           */
          var newForm = [];
          var newFormIndex = 0;
          var newIncome = 0;
          var newOut = 0;
          var oldFormIndex = wx.getStorageSync('formIndex');
          for (var i = 0; i < oldFormIndex; i++) {
            var formKey = "form" + i;
            var obj = wx.getStorageSync(formKey);
            if (obj.add_bill != billName) {
              newForm.push(obj);
              newFormIndex++;
              if (obj.add_type == "1")
                newIncome += parseFloat(obj.add_money);
              else
                newOut += parseFloat(obj.add_money);
            }
          }
          wx.setStorageSync('all_in', newIncome);
          wx.setStorageSync('all_out', newOut);
          wx.setStorageSync('formIndex', newFormIndex);
          for (var i = 0; i < newFormIndex; i++) {
            var formKey = "form" + i;
            wx.setStorageSync(formKey, newForm[i]);
          }
          for (var i = newFormIndex; i < oldFormIndex; i++) {
            var formKey = "form" + i;
            wx.removeStorageSync(formKey);
          }
        }
      }
    });
  },
  /**
   * 编辑账单及相应账目
   */
  btnBillEdit: function (e) {
    var billId = e.target.dataset.id;
    var billName = e.target.dataset.name;
    console.log("编辑账单：", e.target.dataset);
    strEditBillName = billName;
    this.setData({
      editBillId: billId,
      editBillName: billName,
      hiddenmodalput: false,
    })
  },
  /**
   * 编辑账单名称（提交）按钮
   */
  btnEditBillNameConfirm: function () {
    that = this;
    console.log("编辑分类名称（提交）按钮", strEditBillName);
    this.setData({
      hiddenmodalput: true
    });
    if (strEditBillName == this.data.editBillName) {
      wx.showToast({
        title: '分类名未修改',
        icon: 'none',
      })
    } else if (!isExistBill(strEditBillName, this.data.indexOfBill, this.data.arrayOfBill)) {
      showTopTips('分类已存在');
    } else {
      editBill(strEditBillName, this.data.editBillName);
      this.onLoad();
    }
  },

  /**
   * 编辑账单名称（取消）按钮
   */
  btnEditBillNameCancel: function () {
    console.log("编辑分类名称（取消）按钮");
    strEditBillName = "";
    this.setData({
      hiddenmodalput: true
    });
  },

  /**
   * 编辑账单名称输入框
   */
  inputEditBillName: function (e) {
    strEditBillName = e.detail.value;
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

function editBill(newName, oldName) {
  var formIndex = wx.getStorageSync('formIndex');

  for (var i = 0; i < formIndex; i++) {
    var formKey = "form" + i;
    var obj = wx.getStorageSync(formKey);
    if (obj.add_bill == oldName) {
      obj.add_bill = newName;
      wx.setStorageSync(formKey, obj);
    }
  }

  var indexOfBill = wx.getStorageSync('indexOfBill');
  for (var i = 0; i < indexOfBill; i++) {
    var billKey = "Bill" + i;
    var billName = wx.getStorageSync(billKey);
    if (billName == oldName) {
      wx.setStorageSync(billKey, newName);
      break;
    }
  }
}