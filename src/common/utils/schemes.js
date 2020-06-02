class schemes {
  // schemesUrl 唤起协议 
  // schemesObj 综合唤起方法
  // var schemesObj = {
  //   pkgname: 'com.listeningtrees.webapp',
  //   appleId: '1503106436',
  //   app_qq: 'https://a.app.qq.com/o/simple.jsp?pkgname=',
  //   appleUrl: ' https://itunes.apple.com/cn/app/id'
  // }
  // var isschemes = new schemes('listeningtrees://', schemesObj)
  // isschemes.init()
  constructor(schemesUrl, schemesObj, tempTime = null) {
    this.schemesUrl = schemesUrl;
    this.schemesObj = schemesObj;
    this.tempTime = tempTime;
    let navigators = navigator.userAgent;
    this.ios = navigators.match(/(iPhone|iPod|iPad);?/i) ? true : false;
    this.android = navigators.match(/android/i) ? true : false;
    this.isWeChat = navigators.match(/MicroMessenger/i) ? true : false;
  }
  openSchemes() {
    var openSchemesUrl;
    var ifr = document.createElement('iframe');
    var loadDateTime = new Date();
    this.isWeChat && this.android ? openSchemesUrl = this.schemesObj.app_qq + this.schemesObj.pkgname : openSchemesUrl = '';
    this.isWeChat && this.ios ? openSchemesUrl = this.schemesObj.appleUrl + this.schemesObj.appleId : openSchemesUrl;
    if (openSchemesUrl) {
      window.location.href = openSchemesUrl;
      return false;
    }
    ifr.src = this.schemesUrl;
    ifr.style.display = 'none';
    clearTimeout(this.tempTime)
    this.tempTime = setTimeout(() => {
      var timeOutDateTime = new Date();
      if (timeOutDateTime - loadDateTime < 3000) {
        this.ios ? window.location.href = this.schemesObj.appleUrl + this.schemesObj.appleId : window.location.href = this.schemesObj.app_qq + this.schemesObj.pkgname
        clearTimeout(this.tempTime)
      } else {
        clearTimeout(this.tempTime)
        // alert('销毁')
        // window.close()
      }
    }, 2500);
    document.body.appendChild(ifr);
    this.destroy(ifr);
  }
  destroy(ifr) {
    let temp = null;
    temp = setTimeout(function () {
      document.body.removeChild(ifr);
      clearTimeout(temp)
    }, 1000);
  }
  init() {
    this.openSchemes()
  }

}
export default schemes;