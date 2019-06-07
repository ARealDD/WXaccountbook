// pages/addClassify/addClassify.js
var strEditClassName = "";
var intEditClassId = 0;
var that = this;
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    showTopTips: false,
    textTopTips: "错误提示",

    winWidth: 0,
    winHeight: 0,
    currentTab: 0,

    arrayOfIncomeClassify: [],
    indexOfIncomeClassify: 0,

    arrayOfOutClassify: [],
    indexOfOutClassify: 0,

    hiddenmodalput: true,
    editClassId: 0,
    editClassType: "",
    editClassName: "",
  },

  /**
   * 表单提交--添加类型
   */
  outSubmit: function(e) {
    if (e.detail.value.add_classify == "") {
      this.setData({
        showTopTips: true,
        textTopTips: "类型不能为空"
      })
    } 
    else if(!isExistClassify(e.detail.value.add_classify, this.data.indexOfOutClassify, this.data.arrayOfOutClassify, this.data.indexOfIncomeClassify, this.data.arrayOfIncomeClassify)) {
      this.setData({
        showTopTips: true,
        textTopTips: "类型已存在"
      })
    }
    else {
      this.data.arrayOfOutClassify.push(e.detail.value.add_classify);

      var tmp = 'OutClassify' + this.data.indexOfOutClassify;
      wx.setStorageSync(tmp, e.detail.value.add_classify);
      this.setData({
        indexOfOutClassify: this.data.indexOfOutClassify + 1,
        arrayOfOutClassify: this.data.arrayOfOutClassify,
        showTopTips: true,
        textTopTips: "添加成功"
      });
      wx.setStorageSync('indexOfOutClassify', this.data.indexOfOutClassify);
    }
    setTimeout(textTime, 2000, this);
  },

  incomeSubmit: function (e) {
    if (e.detail.value.add_classify == "") {
      this.setData({
        showTopTips: true,
        textTopTips: "类型不能为空"
      })
    }
    else if (!isExistClassify(e.detail.value.add_classify, this.data.indexOfOutClassify, this.data.arrayOfOutClassify, this.data.indexOfIncomeClassify, this.data.arrayOfIncomeClassify)) {
      this.setData({
        showTopTips: true,
        textTopTips: "类型已存在"
      })
    }
    else {
      this.data.arrayOfIncomeClassify.push(e.detail.value.add_classify);

      var tmp = 'IncomeClassify' + this.data.indexOfIncomeClassify;
      wx.setStorageSync(tmp, e.detail.value.add_classify);
      this.setData({
        indexOfIncomeClassify: this.data.indexOfIncomeClassify + 1,
        arrayOfIncomeClassify: this.data.arrayOfIncomeClassify,
        showTopTips: true,
        textTopTips: "添加成功"
      });
      wx.setStorageSync('indexOfIncomeClassify', this.data.indexOfIncomeClassify);
    }
    setTimeout(textTime, 2000, this);
  },

  /**
   * 编辑分类及相应账目
   */
  btnClassEdit: function (e) {
    var classId = e.target.dataset.id;
    var classType = e.target.dataset.type;
    var className = e.target.dataset.name;
    console.log("编辑分类：", e.target.dataset);
    strEditClassName = className;
    this.setData({
      editClassId: classId,
      editClassType: classType,
      editClassName: className,
      hiddenmodalput: false,
    })
  },
  /**
   * 编辑分类名称（提交）按钮
   */
  btnEditClassNameConfirm: function () {
    that = this;
    console.log("编辑分类名称（提交）按钮", strEditClassName);
    this.setData({
      hiddenmodalput: true
    });
    if (strEditClassName == this.data.editClassName) {
      wx.showToast({
        title: '分类名未修改',
        icon: 'none',
      })
    } else if (!isExistClassify(strEditClassName, this.data.indexOfOutClassify, this.data.arrayOfOutClassify, this.data.indexOfIncomeClassify, this.data.arrayOfIncomeClassify)) {
      showTopTips('分类已存在');
    } else {
      editClassify(strEditClassName, this.data.editClassName);
      this.onShow();
    }
  },

  /**
   * 编辑分类名称（取消）按钮
   */
  btnEditClassNameCancel: function () {
    console.log("编辑分类名称（取消）按钮");
    strEditClassName = "";
    this.setData({
      hiddenmodalput: true
    });
  },

  /**
   * 编辑分类名称输入框
   */
  inputEditClassName: function (e) {
    strEditClassName = e.detail.value;
  },

  /**
   * 删除分类及相应账目
   */
  btnClassDelete: function(e) {
    var that = this;
    var classId = e.target.dataset.id;
    var classType = e.target.dataset.type;
    var className = e.target.dataset.name;
    console.log("删除分类：", e.target.dataset);
    wx.showModal({
      title: '删除分类',
      content: '你是否要将【' + className + '】分类删除？' + '\n同时会删除相关账目',
      cancelText: '否',
      confirmText: '是',
      confirmColor: '#e51c23',
      success: function (res) {
        if (res.confirm) {
          if (classType == 'out') {
            var i;
            for (i = classId; i < that.data.indexOfOutClassify - 1; i ++) {
              that.data.arrayOfOutClassify[i] = that.data.arrayOfOutClassify[i + 1];
            }
            var tmp = "OutClassify" + i;
            wx.removeStorageSync(tmp);
            that.data.arrayOfOutClassify.splice(i, 1);
            that.setData ({
              indexOfOutClassify: that.data.indexOfOutClassify - 1,
              arrayOfOutClassify: that.data.arrayOfOutClassify,
            })
            for (i = 0; i < that.data.indexOfOutClassify; i ++) {
              var tmp = "OutClassify" + i;
              wx.setStorageSync(tmp, that.data.arrayOfOutClassify[i]);
            }
            wx.setStorageSync('indexOfOutClassify', that.data.indexOfOutClassify);
          }
          else if (classType == 'income') {
            var i;
            for (i = classId; i < that.data.indexOfIncomeClassify - 1; i++) {
              that.data.arrayOfIncomeClassify[i] = that.data.arrayOfIncomeClassify[i + 1];
            }
            var tmp = "IncomeClassify" + i;
            wx.removeStorageSync(tmp);
            that.data.arrayOfIncomeClassify.splice(i, 1);
            that.setData({
              indexOfIncomeClassify: that.data.indexOfIncomeClassify - 1,
              arrayOfIncomeClassify: that.data.arrayOfIncomeClassify,
            })
            for (i = 0; i < that.data.indexOfIncomeClassify; i++) {
              var tmp = "IncomeClassify" + i;
              wx.setStorageSync(tmp, that.data.arrayOfIncomeClassify[i]);
            }
            wx.setStorageSync('indexOfIncomeClassify', that.data.indexOfIncomeClassify);
            
          }
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
            if (obj.add_classify != className) {
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
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    /**
     * 初始化类型
     */
    //支出
    this.setData({
      indexOfOutClassify: wx.getStorageSync('indexOfOutClassify'),
    });
    if (!this.data.indexOfOutClassify) {
      this.setData({
        indexOfOutClassify: 4,
        arrayOfOutClassify: ["吃", "喝", "玩", "乐"],
      })
      for (var i = 0; i < this.data.indexOfOutClassify; i++) {
        var type = "OutClassify" + i;
        wx.setStorageSync(type, this.data.arrayOfOutClassify[i]);
      }
      wx.setStorageSync('indexOfOutClassify', this.data.indexOfOutClassify);
    }
    else {      //载入类型数据
      this.setData({
        arrayOfOutClassify: [],
      })
      for (var i = 0; i < this.data.indexOfOutClassify; i++) {
        var tmp = "OutClassify" + i;
        this.data.arrayOfOutClassify.push(wx.getStorageSync(tmp));
      }
      this.setData({
        arrayOfOutClassify: this.data.arrayOfOutClassify,
      })
    }
    
    //收入
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
  },
  /**
   * 每次打开更新
   */
  onShow: function (e) {
    /**
     * 初始化类型
     */
    this.setData({
      indexOfClassify: wx.getStorageSync('indexOfOutClassify'),
    });
    if (!this.data.indexOfOutClassify) {
      this.setData({
        indexOfOutClassify: 4,
        arrayOfOutClassify: ["吃", "喝", "玩", "乐"],
      })
      for (var i = 0; i < this.data.indexOfOutClassify; i++) {
        var type = "OutClassify" + i;
        wx.setStorageSync(type, this.data.arrayOfOutClassify[i]);
      }
    }
    else {      //载入类型数据
      this.setData({
        arrayOfOutClassify: [],
      })
      for (var i = 0; i < this.data.indexOfOutClassify; i++) {
        var tmp = "OutClassify" + i;
        this.data.arrayOfOutClassify.push(wx.getStorageSync(tmp));
      }
      this.setData({
        arrayOfOutClassify: this.data.arrayOfOutClassify,
      })
    }

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
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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

function isExistClassify(classifyName, indexOfOutClassify, arrayOfOutClassify, indexOfIncomeClassify, arrayOfIncomeClassify) {
  for (var i = 0; i < indexOfOutClassify; i ++) {
    if (classifyName == arrayOfOutClassify[i])
      return false;
  }
  
  for (var i = 0; i < indexOfIncomeClassify; i++) {
    if (classifyName == arrayOfIncomeClassify[i])
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

/**
 * 修改分类名
 */
function editClassify(newName, oldName) {
  var formIndex = wx.getStorageSync('formIndex');
  
  for (var i = 0; i < formIndex; i ++) {
    var formKey = "form" + i;
    var obj = wx.getStorageSync(formKey);
    if (obj.add_classify == oldName) {
      obj.add_classify = newName;
      wx.setStorageSync(formKey, obj);
    }
  }

  var indexOfOutClassify = wx.getStorageSync('indexOfOutClassify');
  for (var i = 0; i < indexOfOutClassify; i ++) {
    var classifyKey = "OutClassify" + i;
    var classifyName = wx.getStorageSync(classifyKey);
    if (classifyName == oldName) {
      wx.setStorageSync(classifyKey, newName);
      break;
    }
  }
  var indexOfIncomeClassify = wx.getStorageSync('indexOfIncomeClassify');
  for (var i = 0; i < indexOfIncomeClassify; i++) {
    var classifyKey = "IncomeClassify" + i;
    var classifyName = wx.getStorageSync(classifyKey);
    if (classifyName == oldName) {
      wx.setStorageSync(classifyKey, newName);
      break;
    }
  }
}