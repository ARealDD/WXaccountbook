var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    textTopTips: "错误提示",

    money: "",

    mark: "",

    date: "",
    dateStr: "",

    indexOfIncomeOrOut: -1,
    typeOfIncomeOrOut: "",
    arrayOfIncomeOrOut: ['支出', '收入'],

    indexOfClassify: 0,
    typeOfClassify: "",
    arrayOfClassify: [],

    indexOfIncomeClassify: 0,
    typeOfIncomeClassify: "",
    arrayOfIncomeClassify: [],
    
    // indexOfIncomeClassifyByUser: 0,
    // typeOfIncomeClassifybyUser: "",
    // arrayOfIncomeClassifybyUser: [],

    indexOfOutClassify: 0,
    typeOfOutClassify: "",
    arrayOfOutClassify: [],

    // indexOfOutClassifyByUser: 0,
    // typeOfOutClassifybyUser: "",
    // arrayOfOutClassifybyUser: [],

    all_in_money: 0.00,
    all_out_money: 0.00,

    formIndex: 0,

    indexOfBill: -1,
    arrayOfBill: [],
    typeOfBill: "",

    now_date:""
  },

  /**
   * 表单提交事件
   */
  submit: function (e) {
    console.log('form发生了submit时间，数据为：',e.detail.value);
    if (e.detail.value.add_money == "") {
      this.setData({
        showTopTips: true,
        textTopTips: "金额不能为空"
      })
    } else if (e.detail.value.add_time == ""){
      this.setData({
        showTopTips: true,
        textTopTips: "时间不能为空"
      })
    } else if (!(e.detail.value.add_type == 0 || e.detail.value.add_type == 1)){
      this.setData({
        showTopTips: true,
        textTopTips: "请选择收支"
      })
    } else if (!this.data.arrayOfClassify[e.detail.value.add_classify]) {
      this.setData({
        showTopTips: true,
        textTopTips: "请选择分类"
      })
    } else if (!this.data.arrayOfBill[e.detail.value.add_bill]) {
      this.setData({
        showTopTips: true,
        textTopTips: "请选择账单"
      })
    } else {
      this.setData({
        money: e.detail.value.add_money,
        mark: e.detail.value.add_mark,
        typeOfIncomeOrOut: this.data.arrayOfIncomeOrOut[e.detail.value.add_type],
        indexOfIncomeOrOut: e.detail.value.add_type,
        typeOfClassify: this.data.arrayOfClassify[e.detail.value.add_classify],
        indexOfClassify: e.detail.value.add_classify,
        typeOfBill: this.data.arrayOfBill[e.detail.value.add_bill],
        indexOfBill: e.detail.value.add_bill,
      })

      if (this.data.indexOfIncomeOrOut == 0) { //支出
        this.setData({
          all_out_money: parseFloat(this.data.all_out_money) + parseFloat(this.data.money),
        })
      } else {  //收入
        this.setData({
          all_in_money: parseFloat(this.data.all_in_money) + parseFloat(this.data.money),
        })
      }
      e.detail.value.add_classify = this.data.typeOfClassify;
      e.detail.value.add_bill = this.data.typeOfBill;
      //console.log (e.detail.value.add_bill);
      this.setData({
        formIndex: wx.getStorageSync('formIndex'),
      })
      if (!this.data.formIndex) {
        this.setData({
          formIndex: 0,
        })
        wx.setStorageSync('formIndex', this.data.formIndex);
      }
      var formIndex = 'form' + this.data.formIndex;
      wx.setStorageSync('all_in', this.data.all_in_money);
      wx.setStorageSync('all_out', this.data.all_out_money);
      wx.setStorageSync(formIndex, e.detail.value),
      this.setData({
        formIndex: this.data.formIndex + 1,
      })
      wx.setStorageSync('formIndex', this.data.formIndex);

      this.setData({
        showTopTips: true,
        textTopTips: "保存成功"
      })
      console.log('form发生了submit时间，数据为：', e.detail.value);
    }
    setTimeout(textTime, 2000, this);
  },
  /**
   * 表单重置事件
   */
  reset: function(e) {
    this.setData({
      indexOfIncomeOrOut: -1,
      indexOfBill: -1,
      dateStr: "",
      showTopTips: false,
      textTopTips: ""
    })
    console.log('form发生了reset事件')
  },
  
  /**
   * 日期改变事件
   */
  bindDateChange: function (e) {
    var date = new Date(e.detail.value);
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    this.setData({
      date: e.detail.value,
      dateStr: "" + year + "年" + month + "月" + day + "日"
    })
  },
  /**
   * 收支类型改变事件
   */
  bindPickerChange: function(e) {
    this.setData({
      indexOfIncomeOrOut: e.detail.value,
    })
    if (e.detail.value == 0) {
      this.setData({
        indexOfOutClassify: wx.getStorageSync('indexOfOutClassify'),
      });
      if (!this.data.indexOfOutClassify) {    //第一次使用
        this.setData({
          indexOfOutClassify: 4,
          arrayOfOutClassify: ["吃", "喝", "玩", "乐"],
        })
        for (var i = 0; i < this.data.indexOfOutClassify; i++) {
          var tmp = "OutClassify" + i;
          wx.setStorageSync(tmp, this.data.arrayOfOutClassify[i]);
        }
        wx.setStorageSync('indexOfOutClassify', this.data.indexOfOutClassify);
      }
      else {      //载入类型数据
      this.setData({
        arrayOfOutClassify: [],
      })
        for (var i = 0; i < this.data.indexOfOutClassify; i ++) {
          var tmp = "OutClassify" + i;
          this.data.arrayOfOutClassify.push(wx.getStorageSync(tmp));
        }
        this.setData({
          arrayOfOutClassify: this.data.arrayOfOutClassify,
        })
      }
      this.setData({
        indexOfClassify: this.data.indexOfOutClassify,
        arrayOfClassify: this.data.arrayOfOutClassify
      })
    }
    else {
      this.setData({
        indexOfIncomeClassify: wx.getStorageSync('indexOfIncomeClassify'),
      });
      if (!this.data.indexOfIncomeClassify) {
        this.setData({
          indexOfIncomeClassify: 2,
          arrayOfIncomeClassify: ["工资", "收款"],
        })
        for (var i = 0; i < this.data.indexOfIncomeClassify; i++) {
          var type = "IncomeClassify" + i;
          wx.setStorageSync(type, this.data.arrayOfIncomeClassify[i]);
        }
        wx.setStorageSync('indexOfIncomeClassify', this.data.indexOfIncomeClassify);
      }
      else {
        this.setData({
          arrayOfIncomeClassify: [],
        })
        for (var i = 0; i < this.data.indexOfIncomeClassify; i++) {
          var tmp = "IncomeClassify" + i;
          this.data.arrayOfIncomeClassify.push(wx.getStorageSync(tmp));
        }
        this.setData({
          arrayOfIncomeClassify: this.data.arrayOfIncomeClassify,
        })
      }
      
      this.setData({
        indexOfClassify: this.data.indexOfIncomeClassify,
        arrayOfClassify: this.data.arrayOfIncomeClassify
      })
    }
  },
  bindPickerForClassify: function(e) {
    this.setData({
      indexOfClassify: e.detail.value,
    })
  },
  bindPickerForBill: function (e) {
    this.setData({
      indexOfBill: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 设置当前日期
     */
    var DATE = util.formatDate(new Date());
    this.setData({
      now_date: DATE,
    });

    /**
     * 设置当前总收入/支出
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
    var DATE = util.formatDate(new Date());
    this.setData({
      now_date: DATE,
    });

    /**
     * 自动清空表单
     */
    this.setData({
      indexOfIncomeOrOut: -1,
      indexOfBill: -1,
      dateStr: "",
      money: '',
      showTopTips: false,
      textTopTips: ""
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

/**
 * 控制提示文本时间
 */
function textTime(that) {
  that.setData({
    showTopTips: false,
    textTopTips: ""
  })
}