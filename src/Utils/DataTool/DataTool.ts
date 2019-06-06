import { NativeModules, Platform } from 'react-native';

const { PlatformConstants = {} } = NativeModules,
    { minor = 0 } = PlatformConstants.reactNativeVersion || {};

/**
 * 评论人匿名显示
 * @param commentPersonName
 * @param limitLength
 * @return anonymousName
 *
 * 昵称规则：用户昵称最高可显示9个字符，超过9个字符的以2+***+4形式出现，9个字符内的全部显示出来
 * */
export function commentPersonAnonymous(commentPersonName: string, limitLength: number) {
    if (isOrNotEmpty(commentPersonName)) {
        return null;
    }

    let userName = commentPersonName,
        userArr: string[] = [];

    if (userName) {
        userArr = userName.split('');
    }
    if (userArr.length > limitLength) {
        userArr.forEach((data: any, index: number) => {
            if (index >= 5 && userArr.length - limitLength > 0) {
                //截取长度
                let cutLength = userArr.length - 9;

                userArr.splice(index, cutLength);
            }
            if (index >= 2 && index < userArr.length - 4) {
                userArr.splice(index, 1, '*');
            }
        });
    }
    // }
    userName = userArr ? userArr.join('') : '';
    return userName;
}

/**
 * 判断是否是手机号
 * @param手机号
 * */
export function isPhoneAvailable(phone: string) {
    if (phone.length !== 11) {
        return false;
    }
    let reg = /^[0-9]+.?[0-9]*$/;

    if (reg.test(phone) && phone.substring(0, 1) === '1') {
        return true;
    }
    return false;
}

/**
 * 判断是否是电话号码
 * @param电话号码
 * */
export function isTelAvailable(tel: string) {
    let myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;

    if (!myreg.test(tel)) {
        return false;
    }
    return true;
}

/**
 * 验证是否是微信号
 * @param验证字符 checkCode
 * 微信号规则：微信账号仅支持6-20个字母、数字、下划线或减号，以字母开头
 * */
export function isWeixinAccount(checkCode: string) {
    let myreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //拿到所有的字母,数字组合
        checkCodeStr = checkCode.replace(/[^0-9a-z]/gi, '');

    if (!myreg.test(checkCodeStr)) {
        return false;
    }
    return true;
}

/**
 * 验证是否包含特殊客服
 * @param验证字符 checkStr
 * */
export function checkSpecialWords(checkStr: string) {
    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
}

/**
 * 判断是否包含数字
 * @param
 * */
export function checkContainNumber(str: string) {
    let numberValue = str.replace(/[^0-9]/gi, '');
    const checkIsPhone = numberValue.length > 5;

    return checkIsPhone;
}

/**
 * 去掉特殊字符
 * @param字符检验
 * */
export function excludeSpecial(s: string) {
    // 去掉转义字符
    let tmp: string = s && s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    // 去掉特殊字符

    tmp = tmp && tmp.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/, '');
    return tmp;
}

/**
 * 去掉特殊字符,返回true为空，返回false不为空
 * @param字符检验
 * */
function isOrNotEmpty(s: any) {
    if (s) {
        switch (typeof s) {
            case 'string':
                if (s !== '') {
                    return false;
                }
                return true;
            case 'number':
                return false;
            case 'object':
                if (JSON.stringify(s) === '{}' || JSON.stringify(s) === '[]') {
                    return true;
                }
                return false;
            default:
                return true;
        }
    }
    return true;
}

/**
 * 判断是否需要人民币符号
 * @param字符检验
 * */
export function getPrice(s: string) {
    try {
        if (String(parseInt(s, 10)) !== 'NaN') {
            return '¥' + s;
        }
        return s;
    } catch (e) {
        return s;
    }
}

/**
 * 点赞数计算
 * @param doLikeMounts
 * */
export function doLikeMountsCount(doLikeMounts: number) {
    //获取点赞字符串
    let doLikeMountsStr = String(doLikeMounts),
        //点赞数第一位截取
        firstDoLikeStr: number = parseInt(doLikeMountsStr.substring(0, 1), 10),
        //点赞数位数
        dolikeMountsCapacity = doLikeMountsStr.length - 1,
        nameOne = '小',
        list = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
        nameTwo = list[dolikeMountsCapacity];

    switch (firstDoLikeStr) {
        case 1:
        case 2:
        case 3:
            nameOne = '小';
            break;
        case 4:
        case 5:
        case 6:
            nameOne = '中';
            break;
        case 7:
        case 8:
        case 9:
            nameOne = '大';
            break;
        default:
            break;
    }

    return nameOne + nameTwo;
}

/**
 * 数组中是否包含某个元素
 * @param checkArr
 * @param checkElement
 * */
export function checkArrIsContainElement(checkArr: string, checkElement: string) {
    for (let i = 0; i < checkArr.length; i++) {
        if (checkArr[i] === checkElement) {
            return true;
        }
    }
    return false;
}

/**
 * js判断字符串是否为JSON格式
 *@param str
 * */
export function isJSONAction(str: string) {
    if (typeof str === 'string') {
        try {
            let obj = JSON.parse(str);

            if (typeof obj === 'object' && obj) {
                return true;
            }
            return false;
        } catch (e) {
            // console.log('isJSONAction error：'+str+'!!!'+e);
            return false;
        }
    }
}

/**
 * js去除数组中的重复
 *@param str
 * */
export function unique(arr: any[]) {
    let len = arr.length,
        result = [];

    for (let i = 0; i < len; i++) {
        let flag = true;

        for (let j = i; j < arr.length - 1; j++) {
            if (arr[i] === arr[j + 1]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            result.push(arr[i]);
        }
    }
    return result;
}

/**
 * 移除对应项
 * @param arr
 * @param from
 * @param to
 * @returns {*}
 */
export function remove(arr: string[], from: number, to?: number) {
    let rest = arr.slice((to || from) + 1 || arr.length);

    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
}

/**
 * 按值移除
 * @param arr
 * @param val
 */
export function removeByValue(arr: string[], val: string) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            break;
        }
    }
}

/**
 * 输出反向数组
 * @param arr
 * @returns {Array}
 */
export function mapByDesc(arr: string[]) {
    let newArr = [];

    for (let i = arr.length - 1; i >= 0; i--) {
        newArr.push(arr[i]);
    }
    return newArr;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/9/11
 * @function: 判断字符串是否为空
 */
export function isEmpty(str) {
    if (!str || str.length === 0) {
        return true;
    }
    if (str.replace(/\s*/g, '').length === 0) {
        return true;
    }
    return false;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/9/11
 * @function: 去除多余的空格
 */
export function trim(str) {
    if (!str || str.length === 0) {
        return '';
    }
    return str.replace(/\s*/g, '');
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/9/11
 * @function: 去除字符数组中多余的空格
 */
export function replaceEmptyItem(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
        if (!arr[i] || arr[i] === '') {
            arr.splice(i, 1);
            len--;
        }
    }
    return arr;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/9/11
 * @function: 检查是否属入了非字符和数字的非法字符
 */
export function checkIleagal(str) {
    if (!str.match(/^[a-zA-Z0-9_]*$/)) {
        return false;
    }
    return true;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/9/11
 * @function: 检查是否属入了xss类危险字符
 */
export function isSafeText(str) {
    return str.matches('.*(<|>|<script|`|%60|%3c|%3e|img).*');
}

/**
 * android和ios平台数据转化
 * @param jsonData
 * @returns {any}
 */
export function parseData(jsonData) {
    return typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
}

/**
 * android和ios平台接口传参数据转化
 * @param jsonData
 * @returns {any}
 */
export function paramsParseData(jsonObject) {
    return Platform.OS === 'ios' ? jsonObject : JSON.stringify(jsonObject);
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 即时聊天自定义小题tips
 */
export function parseCustomMsg(msg) {
    if (msg.type === 'custom') {
        try {
            const cnt = JSON.parse(msg.content);

            switch (cnt.type) {
                case 1:
                    return '[猜拳消息]';
                case 2:
                    return '[阅后即焚]';
                case 3:
                    return '[贴图表情]';
                case 4:
                    return '[白板消息]';
                default:
                    return '[未定义消息]';
            }
        } catch (e) {
            console.log(e);
        }
        return '[自定义消息]';
    }
    return '';
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 定义消息的类型
 */
export function mapMsgType(msg) {
    const map = {
        text: '文本消息',
        image: '图片消息',
        file: '文件消息',
        audio: '语音消息',
        video: '视频消息',
        geo: '地理位置消息',
        tip: '提醒消息',
        custom: '自定义消息',
        notification: '系统通知',
        robot: '机器人消息'
    };
    const type = msg.type;

    return map[type] || '未知消息类型';
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 定时器任务
 */
export function debounce(idle, action) {
    let last;

    return (() => {
        clearTimeout(last);
        last = setTimeout(function() {
            action();
        }, idle);
    })();
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 获得有效的备注名
 */
export function getFriendAlias(userInfo) {
    userInfo.alias = userInfo.alias ? userInfo.alias.trim() : '';
    return userInfo.alias || userInfo.nick || userInfo.account;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 文件的md5用于文件防篡改校验
 */
export function uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';

    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');

    return new Date().getTime();
}

/* 格式化日期 */
export function formatDate(datetime, simple = false) {
    const tempDate = new Date().getTime();
    // 今天 00:00
    const todayDate = stringifyDate(tempDate, true).thatDay;
    const result = stringifyDate(datetime, simple);
    const thatDay = result.thatDay;
    const deltaTime = (datetime - todayDate) / 1000;

    if (deltaTime > 0) {
        return result.withHour;
    } else if (deltaTime > -3600 * 24) {
        return result.withLastDay;
    } else if (deltaTime > -3600 * 24 * 7) {
        return result.withDay;
    } else if (deltaTime > -3600 * 24 * 30) {
        return result.withMonth;
    }
    return result.withYear;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 断开连接消息转换
 */
export function parseDisconnectMsg(error) {
    const map = {
        PC: '电脑版',
        Web: '网页版',
        Android: '手机版',
        iOS: '手机版',
        WindowsPhone: '手机版'
    };
    let errorMsg = '';

    switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
            errorMsg = '帐号或密码错误';
            break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
            errorMsg = `你的帐号于${formatDate(new Date())}被${map[error.from] || '其他端'}踢出下线，请确定帐号信息安全!`;
            break;
        case 'logout':
            errorMsg = '主动退出';
            break;
        default:
            errorMsg = error.message || error.code || JSON.stringify(errorMsg);
            break;
    }
    return errorMsg;
}

export function simpleClone(obj) {
    let cache = [];
    let strObj = JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });

    return JSON.parse(strObj);
}

function stringifyDate(datetime, simple = false) {
    // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let datetimeTmp = datetime;

    datetimeTmp = new Date(datetimeTmp);
    const year = datetimeTmp.getFullYear();
    const simpleYear = datetimeTmp.getYear() - 100;
    let month = datetimeTmp.getMonth() + 1,
        monthTmp;

    monthTmp = month > 9 ? month : `0${month}`;
    let day = datetimeTmp.getDate(),
        dayTmp;

    dayTmp = day > 9 ? day : `0${day}`;

    let hour = datetimeTmp.getHours(),
        hourTmp;

    hourTmp = hour > 9 ? hour : `0${hour}`;

    let min = datetimeTmp.getMinutes(),
        minTmp;

    minTmp = min > 9 ? min : `0${min}`;

    let week = datetimeTmp.getDay(),
        weekTmp;

    weekTmp = weekMap[week];

    const thatDay = new Date(year, monthTmp - 1, dayTmp, 0, 0, 0).getTime();

    if (simple) {
        return {
            withYear: `${dayTmp}/${monthTmp}/${simpleYear}`,
            withMonth: `${monthTmp}-${dayTmp}`,
            withDay: `${weekTmp}`,
            withLastDay: '昨天',
            withHour: `${hourTmp}:${minTmp}`,
            thatDay
        };
    }
    return {
        withYear: `${year}-${monthTmp}-${dayTmp} ${hourTmp}:${minTmp}`,
        withMonth: `${monthTmp}-${dayTmp} ${hourTmp}:${minTmp}`,
        withDay: `${weekTmp} ${hourTmp}:${minTmp}`,
        withLastDay: `昨天 ${hourTmp}:${minTmp}`,
        withHour: `${hourTmp}:${minTmp}`,
        thatDay
    };
}

export function shortenWord(word, maxLen = 20) {
    let count = 0;

    for (let i = 0; i < word.length; i++) {
        if (word.charCodeAt(i) < 128) {
            count += 1;
        } else {
            count += 2;
        }
        if (count > maxLen) {
            return word.substr(0, i - 1) + '...';
        }
    }
    return word;
}

export function genAvatar(url = '') {
    if (url.indexOf('nim.nosdn.127.net') !== -1) {
        return `${url}?imageView&thumbnail=80x80&quality=85`;
    }
    return url;
}

//深度克隆
export function deepClone(obj) {
    let result,
        oClass = isClass(obj);

    //确定result的类型
    if (oClass === 'Object') {
        result = {};
    } else if (oClass === 'Array') {
        result = [];
    } else {
        return obj;
    }
    for (let key in obj) {
        let copy = obj[key];

        if (isClass(copy) === 'Object') {
            result[key] = arguments.callee(copy); //递归调用
        } else if (isClass(copy) === 'Array') {
            result[key] = arguments.callee(copy);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

//返回传递给他的任意对象的类
function isClass(o) {
    if (o === null) {
        return 'Null';
    }
    return Object.prototype.toString.call(o).slice(8, -1);
}

export enum StringChangeType {
    HeadAndFoot, //头*********尾
    Foot, //*********尾
    Head //头*********
}

/**
 * @author 王亮
 * @QQ 3169232533
 * @date 2018/10/25
 * @function:
 * str 将要被转换的string
 * type 样式
 * changeToStr 由什么string来替代
 * showNum 显示明文的个数
 */
export function changeString(str: string, type: StringChangeType, changeToStr: string, showNum: number) {
    if (str) {
        let allNum = str.length;

        switch (type) {
            case StringChangeType.HeadAndFoot:
                let minN = allNum - showNum * 2;

                if (minN > 0) {
                    let mingHead = str.substr(0, showNum);
                    let mingFoot = str.substr(allNum - minN - showNum, showNum);
                    let minStr = '';

                    for (let i = 0; i < minN; i++) {
                        minStr += changeToStr;
                    }
                    return mingHead + minStr + mingFoot;
                }
                return str;
            case StringChangeType.Head:
                let minN1 = allNum - showNum;

                if (minN1 > 0) {
                    let mingHead = str.substr(0, showNum);
                    let minStr = '';

                    for (let i = 0; i < minN1; i++) {
                        minStr += changeToStr;
                    }
                    return mingHead + minStr;
                }
                return str;

            case StringChangeType.Foot:
                let minN2 = allNum - showNum;

                if (minN2 > 0) {
                    let mingFoot = str.substr(allNum - showNum, showNum);
                    let minStr = '';

                    for (let i = 0; i < minN2; i++) {
                        minStr += changeToStr;
                    }
                    return minStr + mingFoot;
                }
                return str;
            default:
                return str;
        }
    } else {
        return '';
    }
}

/**
 * @author 王亮
 * @QQ 3169232533
 * @date 2018/11/6
 * @function: 统一处理价格
 */
export function toPrice(sMin: number, sMax: number) {
    let isEq = sMax === sMin;

    return isEq ? sMax / 1000 + 'k' : sMin / 1000 + 'k-' + sMax / 1000 + 'k';
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/11/1
 * @function: 判断是图片还是视频
 */
export function judgeIsImage(url: string) {
    if (url.toLowerCase().includes('png') || url.toLowerCase().includes('jpg') || url.toLowerCase().includes('jpeg')) {
        return true;
    }
    return false;
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/12/15
 * @function: 隐藏手机号
 */
export function hidePhone(phoneNumber: string) {
    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 *@author 倪涛
 * @QQ 231572762
 * @date 2018/12/5
 * @func: 判断字符串是否只是空字符串\换行\tab
 */
export function isEnmpty(str) {
    let newStr = str.replace(/\n|\r|\s/g, '');

    if (newStr === '') {
        return true;
    }
        return false;

}

/**
 * @author 倪涛
 * @QQ 231572762
 * @date 2019/11/23
 * @func: 获取中间值
 */
export function getMiddleNum(min: number, max: number, step: number) {
    return Math.floor(((max - min) / 2 + min) / step) * step;
}
/**
 * @author 倪涛
 * @QQ 231572762
 * @date 2019/11/23
 * @func: 根据最小单位, 返回对应的整数
 */
export function getStepInterger(num: number, step: number) {
    return Math.floor(num / step) * step;
}

/**
 * @author 倪涛
 * @QQ 231572762
 * @date 2019/11/23
 * @func: 翻译薪资单位, 如果初始值大于5000, 全部转换为k
 */
export function transformSalary(min: number, max: number) {
    if (min < 5000) {
        if (min === max) {
            return max + '元';
        }
        return `${min}-${max}元`;
    }
        if (min === max) {
            return `${max / 1000}k`;
        }
        return `${min / 1000}k-${max / 1000}k`;

}
/**
 * @author 倪涛
 * @QQ 231572762
 * @date 2019/11/23
 * @func:转换薪资
 */
export function resetSalary(salary: any) {
    salary = String(salary);
    if (salary.indexOf('k') === -1) {
        return Number(salary);
    }
    return Number(salary.replace(/k/g, '')) * 1000;
}

/**
 *@author 倪涛
 * @date 2019/1/25
 * @func: 过滤掉emoji表情字符
 */
export function filteremoji(content) {
    let ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];

    content = content.replace(new RegExp(ranges.join('|'), 'g'), '');

    return content;
}
