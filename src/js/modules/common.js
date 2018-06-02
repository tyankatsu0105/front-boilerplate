/* eslint-disable no-undef */
export default class {
  /**
   * メソッドを即時的に動かす
   */
  setUp() {
    this.sampleMethod();
    this.sampleMethod2('tyankatsu', '元気');
    this.isTabFocus();
  }
  /**
   * tabでフォーカスを当てた時のみクラスを付与する
   * cssの:focusでは対応できないため。
   * クリックとタブフォーカスを認識させる。
   */
  isTabFocus() {
    const className = 'js--is-tab-focus';

    document.addEventListener('focusout', function(event) {
      event.target.classList.remove(className);
    });
    document.addEventListener('keydown', function(event) {
      if (event.keyCode !== 9) {
        return;
      }
      window.setTimeout(function() {
        document.activeElement.classList.add(className);
        document.querySelector('body').classList.remove(className);
      }, 0);
    });
  }
  /**
   * bodyに対しサンプルクラスを付与する
   */
  sampleMethod() {
    $('body').addClass('js--sample-class');
  }
  /**
   * サンプルコンソールを返す
   * @param  {string} name 名前
   * @param  {string} status 体調
   */
  sampleMethod2(name, status) {
    console.log(`${name}さんは今日も${status}です。`);
  }
}
