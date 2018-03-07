/**
 * Created by 38079 on 2017/8/17.
 */
let vhomed = {
};
vhomed.install = function (Vue, options) {
    // 调整页面
    (function (doc, win) {
        let docEl = doc.documentElement;

        // 一物理像素在不同屏幕的显示效果不一样。要根据devicePixelRatio来修改meta标签的scale
        (function () {
            let dpr = 1;
            let scale = 1;
            let isIPhone = win.navigator.appVersion.match(/iphone/gi);
            let devicePixelRatio = win.devicePixelRatio;

            if (isIPhone) {
                // iOS下，对于2和3的屏，用2、3倍的方案，其余的用1倍方案
                if (devicePixelRatio >= 3) {
                    dpr = 3;
                } else if (devicePixelRatio >= 2) {
                    dpr = 2;
                }
            }
            scale = 1 / dpr;

            let metaEl = '';
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ',user-scalable=no');
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                let wrap = doc.createElement('div');
                wrap.appendChild(metaEl);
                doc.write(wrap.innerHTML);
            }
            let divElBasement = doc.createElement('div');
            divElBasement.setAttribute('id', 'basement');
            let bodyEl = doc.body;
            bodyEl.appendChild(divElBasement);
        })();

        let isMobile = navigator.userAgent.match(/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile|micromessenger/i);
        let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        let clientWidth = docEl.clientWidth;   // 此处放在外层防止input唤起页面重新计算font-size
        let clientHeight = docEl.clientHeight;
        let min = Math.min(clientWidth, clientHeight);
        let recalc = function () {
            /* eslint-enable */
            if (isMobile) {
                // 移动端按750标准（以iphone6plus标准开发，iphone6p上1rem == 100px）设置字体
                let fontSize = Math.floor(min / 75) * 10;
                docEl.style.fontSize = fontSize + 'px';
            } else { // 此处为兼容pc端手动调整的，不影响手机上效果(pc上1px任然为1px)
                docEl.style.fontSize = '100px';
            }
            // 页面横竖屏切换时让页面向上滚动到顶部，解决fixed定位浮动bug
            window.scrollTo(0, 0);
        };

        // 如果浏览器不支持addEventListener方法，终止运行
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false); // 页面调试(横竖屏)时重新设置字体
        doc.addEventListener('DOMContentLoaded', recalc, false); // 页面dom结构加载完设置字体
    })(document, window);
};
export default vhomed;

