import {Alert, Dimensions, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {number} from 'prop-types';

const { height, width } = Dimensions.get('window'),
    /**
     * 屏幕工具类
     * ui设计基准,iphone 6
     * width:750
     * height:1334
     *设备的像素密度，例如：
     *PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
     *PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
     *PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
     *PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
     *PixelRatio.get() === 3.5        Nexus 6       */
    defaultPixel = 2, //iphone6的像素密度
    //px转换成dp
    w2 = 750 / defaultPixel,
    h2 = 1334 / defaultPixel,
    scale = Math.min(height / h2, width / w2); //获取缩放比例
/**
 * 设置text为sp，单位为像素
 * @param size sp
 * return number dp
 */

export function setSpText(spSize: number) {
    return Math.round(spSize * scale + 0.5);
}

/**
 * 屏幕大小适配size，单位为像素
 * @param {number} size
 * @returns {number}
 */
export function scaleSize(scaleSize: number) {
    let scaleSizeTmp = Math.round(scaleSize * scale + 0.5);

    return scaleSizeTmp;
}

//盒子
function uf(flexNumber: number): ViewStyle {
    return { flex: flexNumber };
}

//高度百分比
function hRatio(height: number): ViewStyle {
    return { height: height + '%' };
}

//高度
function h(height: number): ViewStyle {
    return { height: scaleSize(height) };
}

//最小高度
function minh(minHeight: number): ViewStyle {
    return { minHeight: scaleSize(minHeight) };
}

//最大高度
function maxh(maxHeight: number): ViewStyle {
    return { maxHeight: scaleSize(maxHeight) };
}

//宽度百分比
function wRatio(width: number): ViewStyle {
    return { width: width + '%' };
}

//宽度
function w(width: number): ViewStyle {
    return { width: scaleSize(width) };
}

//最小宽度
export function minw(minWidth: number): ViewStyle {
    return { minWidth: scaleSize(minWidth) };
}

//最大宽度
function maxw(maxWidth: number): ViewStyle {
    return { maxWidth: scaleSize(maxWidth) };
}

//内边距
function pt(paddingTop: number): ViewStyle {
    return { paddingTop: scaleSize(paddingTop) };
}

function pr(paddingRight: number): ViewStyle {
    return { paddingRight: scaleSize(paddingRight) };
}

function pl(paddingLeft: number): ViewStyle {
    return { paddingLeft: scaleSize(paddingLeft) };
}

function pb(paddingBottom: number): ViewStyle {
    return { paddingBottom: scaleSize(paddingBottom) };
}

function pa(padding: number): ViewStyle {
    return { padding: scaleSize(padding) };
}

function padding(paddingArr: any): ViewStyle {
    /*传递的是一个数组*/
    if (paddingArr.constructor === Array) {
        return {
            paddingTop: scaleSize(paddingArr[0]),
            paddingRight: scaleSize(paddingArr[1]),
            paddingBottom: scaleSize(paddingArr[2]),
            paddingLeft: scaleSize(paddingArr[3])
        };
    }
    Alert.alert('提示:', 'padding方法第一个参数为数组,四个参数的时候分别代表上右下左,也可以传递3,2,1个参数');
    return {};
}

//边框
function bt(borderTopWidth: number): ViewStyle {
    return { borderTopWidth: scaleSize(borderTopWidth) };
}

function bb(borderBottomWidth: number): ViewStyle {
    return { borderBottomWidth: scaleSize(borderBottomWidth) };
}

function bl(borderLeftWidth: number): ViewStyle {
    return { borderLeftWidth: scaleSize(borderLeftWidth) };
}

function br(borderRightWidth: number): ViewStyle {
    return { borderRightWidth: scaleSize(borderRightWidth) };
}

function bo(borderWidth: number): ViewStyle {
    return { borderWidth: scaleSize(borderWidth) };
}

function border(borderWidthArr: any): ViewStyle {
    /*传递的是一个数组*/
    if (borderWidthArr.constructor === Array) {
        return {
            borderTopWidth: scaleSize(borderWidthArr[0]),
            borderRightWidth: scaleSize(borderWidthArr[1]),
            borderBottomWidth: scaleSize(borderWidthArr[2]),
            borderLeftWidth: scaleSize(borderWidthArr[3])
        };
    }
    Alert.alert('提示:', 'border方法第一个参数为数组,四个参数的时候分别代表上右下左,也可以传递3,2,1个参数');
    return {};
}

//外边距
function mt(marginTop: number): ViewStyle {
    return { marginTop: scaleSize(marginTop) };
}

function mb(marginBottom: number): ViewStyle {
    return { marginBottom: scaleSize(marginBottom) };
}

function ml(marginLeft: number): ViewStyle {
    return { marginLeft: scaleSize(marginLeft) };
}

function mr(marginRight: number): ViewStyle {
    return { marginRight: scaleSize(marginRight) };
}

function ma(margin: number): ViewStyle {
    return { margin: scaleSize(margin) };
}

function margin(marginArr: any): ViewStyle {
    /*传递的是一个数组*/
    if (marginArr.constructor === Array) {
        return {
            marginTop: scaleSize(marginArr[0]),
            marginRight: scaleSize(marginArr[1]),
            marginBottom: scaleSize(marginArr[2]),
            marginLeft: scaleSize(marginArr[3])
        };
    }
    Alert.alert('提示:', 'margin方法第一个参数为数组,四个参数的时候分别代表上右下左,也可以传递3,2,1个参数');
    return {};
}

//圆角
function radiusA(borderRadius: number): ViewStyle {
    return { borderRadius: scaleSize(borderRadius) };
}

function radiusTL(borderTopLeftRadius: number): ViewStyle {
    return { borderTopLeftRadius: scaleSize(borderTopLeftRadius) };
}

function radiusTR(borderTopRightRadius: number): ViewStyle {
    return { borderTopRightRadius: scaleSize(borderTopRightRadius) };
}

function radiusBL(borderBottomLeftRadius: number): ViewStyle {
    return { borderBottomLeftRadius: scaleSize(borderBottomLeftRadius) };
}

function radiusBR(borderBottomRightRadius: number): ViewStyle {
    return { borderBottomRightRadius: scaleSize(borderBottomRightRadius) };
}

function borderRadius(borderRadiusArr: any): ViewStyle {
    /*传递的是一个数组*/
    if (borderRadiusArr.constructor === Array) {
        return {
            borderTopLeftRadius: scaleSize(borderRadiusArr[0]),
            borderTopRightRadius: scaleSize(borderRadiusArr[1]),
            borderBottomRightRadius: scaleSize(borderRadiusArr[2]),
            borderBottomLeftRadius: scaleSize(borderRadiusArr[3])
        };
    }
    Alert.alert('提示:', 'radius方法中第一个数组参数必须为四个元素,默认左上为第一个参数,顺时针旋转');
    return {};
}

//位置

function absT(top: number): ViewStyle {
    return { top: scaleSize(top) };
}

function absB(bottom: number): ViewStyle {
    return { bottom: scaleSize(bottom) };
}

function absL(left: number): ViewStyle {
    return { left: scaleSize(left) };
}

function absR(right: number): ViewStyle {
    return { right: scaleSize(right) };
}

function abs(absolutePositionArr: any): ViewStyle {
    /*传递的是一个数组*/
    if (absolutePositionArr.constructor === Array) {
        return {
            top: scaleSize(absolutePositionArr[0]),
            right: scaleSize(absolutePositionArr[1]),
            bottom: scaleSize(absolutePositionArr[2]),
            left: scaleSize(absolutePositionArr[3])
        };
    }
    Alert.alert('提示:', 'abs方法第一个参数为数组,四个参数的时候分别代表上右下左,也可以传递3,2,1个参数');
    return {};
}

/*字体大小*/
function fSize(fontSize: number): TextStyle {
    return { fontSize: setSpText(fontSize) };
}

/*字体weight*/
function fWeight(fontWeight: any): TextStyle {
    return { fontWeight: fontWeight };
}

/*字体颜色*/
function color(color: string): TextStyle {
    return { color };
}

/*字体行高*/
function lh(lineHeight: number): TextStyle {
    return { lineHeight };
}

/*字体行间距*/
function ls(letterSpacing: number): TextStyle {
    return { letterSpacing };
}

/*背景色*/
function bgColor(backgroundColor: string): ViewStyle {
    return { backgroundColor };
}

/*边框色*/
function bdColor(borderColor: string): ViewStyle {
    return { borderColor };
}

/*透明度*/

function op(opacity: number): ViewStyle {
    return { opacity };
}

/*透明度*/

function bs(borderStyle: any): ViewStyle {
    return { borderStyle };
}

export {
    h,
    w,
    bo,
    bs,
    pt,
    pr,
    pl,
    pb,
    pa,
    padding,
    bt,
    bb,
    bl,
    br,
    border,
    mt,
    mb,
    mr,
    ml,
    ma,
    margin,
    radiusTL,
    radiusTR,
    radiusBL,
    radiusBR,
    absT,
    absB,
    absL,
    absR,
    abs,
    color,
    bgColor,
    bdColor,
    fSize,
    op,
    radiusA,
    height,
    width,
    wRatio,
    hRatio,
    lh,
    ls,
    fWeight
};

export const commonStyles = {
    // 粗体字
    fontWeight:'bold',
    colorTheme: '#488eff',
    blueColor: '#2F8BE7',
    deepBlueColor: '#4E95FF',
    pinkColor: '#f58062',
    greenColor: '#50e3c2',
    //按钮不可点击的背景色,
    disabledColor: '#ecf0f9',
    //输入框placeholder颜色
    holderColor: '#bccae5',
    //底部菜单字体颜色
    tabBottomTextActiveColor: '#488eff',
    tabBottomTextInActiveColor: '#9B9B9B',
    bgGray: '#e5e5e5',
    //页面默认底色
    pageDefaultBackgroundColor: '#f6f9fc',
    whiteColor: '#FFFFFF',
    blackColor: '#000000',
    //主题字黑色
    textBlackColor: '#2b3642',
    //主题字灰色
    textGrayColor: '#979aa0',
    textGrayColorTwo:'#acb7c2',
    chatTextColor: '#7b7f7e',
    //主题字浅蓝色
    textWathetBlueColor: '#b7c6e4',
    //主题字橙色
    textOrangeColor: '#f8832b',
    textOrangeColorTwo: '#fdaf72',
    //主题字绿色
    textGreenColor: '#24c8a5',
    yellowColor:'#fac253',
    //分割线颜色
    dividerColor: '#f6f9fc',
    transparent: 'transparent',
    linearGradientStartColor: '#61c8ff',
    linearGradientEndColor: '#4e95ff',
    ratingStarColor: '#E98269',
    chatBgColor: '#E5E5E5',
    //边距30
    left30: 15,
    right30: 15,
    //每个页面的导航条高度
    headHeight: 44,
    lineHeight: 24,
    letterSpacing: 0.8,
    buttonOpacityBg: 'rgba(118, 190, 253, 0.1)',
    redColor: '#ec1313',
    modalOpacity: 0.3,
    activeOpacity: 0.8,
    sysMsgGrayColor:'rgb(243,245,242)',
    sysMsgBgColor:'rgb(243,245,242)',
    sessionItemBg:'#02420B',
};
//总则u开头表示样式(ui),c开头表示颜色(color)
const styles = StyleSheet.create({
    deviceWidth: { width },
    deviceHeight: { height },
    h100: {
        height: '100%'
    },
    w100: {
        width: '100%'
    },
    uWrap: {
        flexWrap: 'wrap' //自动换行
    },
    uNoWrap: {
        flexWrap: 'nowrap' //截断
    },
    //主轴的排列方向
    udr: {
        //子项横向排列
        flexDirection: 'row'
    },
    udc: {
        //子项竖向排列
        flexDirection: 'column'
    },
    //主轴的排列方向 end

    uf1: {
        flex: 1
    },

    //次轴排序
    uas: {
        //居前
        alignItems: 'flex-start'
    },
    uac: {
        //居中
        alignItems: 'center'
    },
    uae: {
        //居后
        alignItems: 'flex-end'
    },
    //主轴排序
    ujs: {
        //居前
        justifyContent: 'flex-start'
    },
    ujc: {
        //居中
        justifyContent: 'center'
    },
    uje: {
        //居后
        justifyContent: 'flex-end'
    },
    uja: {
        //平均分布
        justifyContent: 'space-around'
    },
    ujb: {
        //两端
        justifyContent: 'space-between'
    },
    //自身次轴对齐 alignSelf enum('auto', 'flex-start', 'flex-end', 'center', 'stretch')
    uSelfAuto: { alignSelf: 'auto' },
    uSelfStart: { alignSelf: 'flex-start' },
    uSelfEnd: { alignSelf: 'flex-end' },
    uSelfCenter: { alignSelf: 'center' },
    uSelfStretch: { alignSelf: 'stretch' },
    upa: {
        //绝对定位
        position: 'absolute'
    },
    upr: {
        position: 'relative'
    },
    //文字水平居中 enum('auto', 'left', 'right', 'center')
    utxc: {
        textAlign: 'center'
    },
    //水平居左
    utxl: {
        textAlign: 'left'
    },
    //水平居右
    utxr: {
        textAlign: 'right'
    },
    //文字垂直居中 textAlignVertical enum('auto', 'top', 'bottom', 'center') 只支持安卓
    utxvc: {
        textAlignVertical: 'center'
    },
    utxvt: {
        textAlignVertical: 'top'
    },
    //文本横线-底部
    utxdu: {
        textDecorationLine: 'underline'
    },
    //文本横线-中间
    utxdt: {
        textDecorationLine: 'line-through'
    },
    //文本横线-中间和底部
    utxdut: {
        textDecorationLine: 'underline line-through'
    },
    //按键阴影
    uvs: {
        shadowColor: commonStyles.colorTheme,
        shadowOpacity: 0.33,
        shadowRadius: 5
    }
});

export default styles;
