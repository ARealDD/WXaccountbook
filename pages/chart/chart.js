var app = getApp()
var list = []
var wxCharts = require('../../utils/wxcharts.js')
var typearray = []
var pieChart1 = null
var pieChart2 = null
var pieChart3 = null
var pieChart4 = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_in_money: 0.00,
    all_out_money: 0.00,

    indexOfBill: 0,
    arrayOfBill: [],

    formIndex: 0,
    objarr: [],

    billList: [],
    listCount: [],
  },

  pickerBind: function(e) {
    this.setData ({
      indexOfBill: e.detail.value,
    });
    var index = e.detail.value;
    var list = this.data.billList[index];
    var all_in = 0;
    var all_out = 0;
    var classListOfIncome = [];
    var classValueOfIncome = [];
    var classListOfOut = [];
    var classValueOfOut = [];

    for (var i = 0; i < this.data.listCount[index]; i ++) {
      //console.log(list[i].add_classify);
      if (list[i].add_type == '0') {
        all_out += parseFloat(list[i].add_money);
        var flag = isExisted(list[i].add_classify, classListOfOut);
        if (flag == -1) {
          classListOfOut.push(list[i].add_classify);
          classValueOfOut.push(parseFloat(list[i].add_money))
          console.log(list[i].add_classify + " -> " +classListOfIncome);
        } else {
          classValueOfOut[flag] += parseFloat(list[i].add_money);
        }
      } else {
        all_in += parseFloat(list[i].add_money);
        var flag = isExisted(list[i].add_classify, classListOfIncome);
        if (flag == -1) {
          classListOfIncome.push(list[i].add_classify);
          classValueOfIncome.push(parseFloat(list[i].add_money));
        } else {
          classValueOfIncome[flag] += parseFloat(list[i].add_money);
        }
      }
    }
    console.log(classListOfIncome);
    console.log(classListOfOut);

    var windowWidth = 320
    try {
      var res = wx.getSystemInfoSync()
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!')
    }
    //生成账单收入支出图
    var seriesOfAll = [];
    if (all_in == 0 && all_out == 0) {
      seriesOfAll.push({
        name: "无",
        data: 1,
      });
    } else {
      seriesOfAll.push({
        name: "支出",
        data: all_out,
        id: 0,
      });
      seriesOfAll.push({
        name: "收入",
        data: all_in,
        id: 1,
      });
    }
    pieChart2 = new wxCharts({
      animation: true,
      canvasId: 'pieCanvasForBillAll',
      type: 'pie',
      series: seriesOfAll,
      width: windowWidth * 0.96,
      height: 300,
      dataLabel: true,
    })

    //生成账单支出分类图
    var seriesOfOut = [];
    for (var i = 0; i < classListOfOut.length; i ++) {
      seriesOfOut.push ({
        name: classListOfOut[i],
        data: classValueOfOut[i],
        id: i,
      })
    }
    if (seriesOfOut.length == 0) {
      seriesOfOut.push ({
        name: "无",
        data: 1,
      })
    }
    pieChart3 = new wxCharts({
      animation: true,
      canvasId: 'pieCanvasForBillOutClassify',
      type: 'pie',
      series: seriesOfOut,
      width: windowWidth * 0.96,
      height: 300,
      dataLabel: true,
    })

    //生成账单收入分类图
    var seriesOfIncome = [];
    for (var i = 0; i < classListOfIncome.length; i++) {
      seriesOfIncome.push({
        name: classListOfIncome[i],
        data: classValueOfIncome[i],
        id: i,
      })
    }
    if (seriesOfIncome.length == 0) {
      seriesOfIncome.push({
        name: "无",
        data: 1,
      })
    }
    pieChart4 = new wxCharts({
      animation: true,
      canvasId: 'pieCanvasForBillIncomeClassify',
      type: 'pie',
      series: seriesOfIncome,
      width: windowWidth * 0.96,
      height: 300,
      dataLabel: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      all_in_money: 0.00,
      all_out_money: 0.00,

      indexOfBill: 0,
      arrayOfBill: [],

      formIndex: 0,
      objarr: [],

      billList: [],
      listCount: [],
    })
    /**
     * 总收入、支出
     */
    this.setData({
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

    /**
     * 总收入支出图
     */
    var seriesOfAll = [];
    seriesOfAll.push({
      name: "支出",
      data: this.data.all_out_money,
      id: 0,
    });
    seriesOfAll.push ({
      name: "收入",
      data: this.data.all_in_money,
      id: 1,
    });

    if (seriesOfAll.length == 0) {
      seriesOfAll.push({
        name: '无',
        data: 1
      })
    }
    var windowWidth = 320
    try {
      var res = wx.getSystemInfoSync()
      windowWidth = res.windowWidth
    } catch (e) {
      console.error('getSystemInfoSync failed!')
    }
    pieChart1 = new wxCharts({
      animation: true,
      canvasId: 'pieCanvasForAll',
      type: 'pie',
      series: seriesOfAll,
      width: windowWidth * 0.96,
      height: 300,
      dataLabel: true,
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

function isExisted(className, classList) {
  for (var i = 0; i < classList.length; i ++) {
    //console.log(className +" " + classList[i]);
    if (className == classList[i])
      return i;
  }
  return -1;
}