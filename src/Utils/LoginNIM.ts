import configs from "../Components/Chat/Config";
import config from "../Components/Chat/Config";
import {DeviceEventEmitter, NetInfo, Platform} from "react-native";
import {getFriendAlias, mapMsgType, parseDisconnectMsg, simpleClone} from "../Utils/DataTool/DataTool";
import {showNotification} from '../../NimSDK/NIM_Android_Push';
import {NimUserInfo} from "../../App";
import {formatDate, genAvatar, parseCustomMsg, shortenWord} from "./DataTool/DataTool";

declare let global: any;

const SDK = require('../../NimSDK/NIM_Web_SDK_rn_v6.1.0.js');
const Realm = require('realm');

SDK.usePlugin({
    db: Realm,
});
const iosPushConfig = {
    //这里的tokenName是网易云信上传的p12的证书的名字
    tokenName: 'releaseAgent',
};
const androidPushConfig = {
    xmAppId: '2882303761517806219',
    xmAppKey: '5971780672219',
    xmCertificateName: 'RN_MI_PUSH',
    hwCertificateName: 'RN_HW_PUSH',
    mzAppId: '113798',
    mzAppKey: 'b74148973e6040c6abbda2af4c2f6779',
    mzCertificateName: 'RN_MZ_PUSH',
    fcmCertificateName: 'RN_FCM_PUSH',
};


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: NimSDK数据监听
 */
export function loginNIM(props, nimStore, account, token, callback) {
    let nimStoreTmp = nimStore;

    global.nim = SDK.NIM.getInstance({
        debug: false,
        appKey: configs.appkey,
        account,
        db: true,
        token,
        syncSessionUnread: true,
        iosPushConfig,
        androidPushConfig,
        onwillreconnect() {
            // Toast.message('onwillreconnect');
            console.log('------------->onwillreconnect');
        },
        ondisconnect(event) {
            // Toast.message('ondisconnect');
            console.log('------------->ondisconnect', event);
            let tipMsg = parseDisconnectMsg(event);

            NetInfo.isConnected.fetch().then((isConnected) => {
                if (!isConnected) {
                    tipMsg = '断网情况退出';
                    return;
                }
            });
            DeviceEventEmitter.emit('onupdatesession', 'disconnect');
            //被踢和主动退出都会清空loginToken等账号信息,如果是其他情况断掉的话会进行重连
            if (event.code === 'kicked') {
                DeviceEventEmitter.emit('ondisconnect', '不允许同一个帐号在多个地方同时登录');
                destroyNIM(props);
            } else if (event.code === 'logout') {
                DeviceEventEmitter.emit('ondisconnect', '退出成功');
                destroyNIM(props);
            } else {
                //发送通知消息进行sdk重连
                DeviceEventEmitter.emit('ondisconnect');
            }

        },
        onconnect() {
            // Toast.message('onconnect');
            console.log('------------->onconnect');
            callback();
        },
        onerror(event) {
            // Toast.message('onerror');
            console.log('------------->onerror');
            // destroyNIM(props);
            // callback(event);
        },
        onsyncdone() {
            // Toast.message('onsyncdone');
            console.log('------------->onsyncdone');
            nimStoreTmp.userID = account;
            callback();
            props.updateNimStore(nimStoreTmp, 'onsyncdone');
        },
        onmyinfo(info) {
            // Toast.message('onmyinfo');
            console.log('------------->onmyinfo');
            nimStoreTmp.myInfo = Object.assign(nimStoreTmp.myInfo, info);
            props.updateNimStore(nimStoreTmp, 'onmyinfo');
        },
        onupdatemyinfo(info) {
            // Toast.message('onupdatemyinfo');
            console.log('------------->onupdatemyinfo');
            nimStoreTmp.myInfo = Object.assign(nimStoreTmp.myInfo, info);
            props.updateNimStore(nimStoreTmp, 'onupdatemyinfo');
        },
        onusers(users) {
            // Toast.message('onusers');
            console.log('------------->onusers');
            let usersTmp = [];

            if (!Array.isArray(users)) {
                usersTmp = [users];
            }
            usersTmp.forEach((user) => {
                const tempAccount = user.account;

                if (tempAccount) {
                    const userInfo = nimStoreTmp.userInfos[tempAccount];

                    if (userInfo) {
                        nimStoreTmp.userInfos[tempAccount] = Object.assign(userInfo, user);
                    } else {
                        nimStoreTmp.userInfos[tempAccount] = user;
                    }
                }
            });
            props.updateNimStore(nimStoreTmp, 'onusers');
        },
        onupdateuser(user) {
            // Toast.message('onupdateuser');
            console.log('------------->onupdateuser');
            if (nimStoreTmp.userInfos[user.account]) {
                nimStoreTmp.userInfos[user.account] = Object.assign(nimStoreTmp.userInfos[user.account], user);
            } else {
                nimStoreTmp.userInfos[user.account] = user;
            }
            props.updateNimStore(nimStoreTmp, 'onupdateuser');
        },
        onfriends(friends) {
            // Toast.message('onfriends');
            console.log('------------->onfriends');
            // friends.forEach((item) => {
            //     nimStoreTmp.friendFlags.set(item.account, true);
            //     const tempAccount = item.account;
            //
            //     if (tempAccount) {
            //         const userInfo = nimStoreTmp.userInfos[tempAccount];
            //
            //         if (userInfo) {
            //             nimStoreTmp.userInfos[tempAccount] = Object.assign(userInfo, item);
            //         } else {
            //             nimStoreTmp.userInfos[tempAccount] = item;
            //         }
            //         console.log('update nimStoreTmp', nimStoreTmp);
            //         props.updateNimStore(nimStoreTmp);
            //     }
            // });
            // let friendsTmp = friends;
            //
            // friendsTmp = friends.map((item) => {
            //     if (typeof item.isFriend !== 'boolean') {
            //         item.isFriend = true;
            //     }
            //     return item;
            // });
            // nimStoreTmp.friendslist = global.nim.mergeFriends(nimStoreTmp.friendslist, friends);
            // nimStoreTmp.friendslist = global.nim.cutFriends(nimStoreTmp.friendslist, friends.invalid);
            // props.updateNimStore(nimStoreTmp);
        },
        onmsg(msg) {
            // Toast.message('onmsg');
            console.log('------------->onmsg');
            if (nimStoreTmp.currentSessionId === msg.sessionId) {
                nimStoreTmp.currentSessionMsgs = nimStoreTmp.currentSessionMsgs.concat([msg]);
                global.nim.sendMsgReceipt({
                    msg,
                    done: function sendMsgReceiptDone(error) {
                        // do something
                        console.log(error);
                    },
                });
                props.updateNimStore(nimStoreTmp, 'onmsg');
            }
            if (Platform.OS === 'android') {
                let showText = '';

                if (msg.type === 'text') {
                    showText = msg.text;
                } else {
                    showText = mapMsgType(msg);
                }
                showNotification({
                    icon:'', title: msg.fromNick, content: showText, time: `${msg.time}`,
                });
            }
        },
        onroamingmsgs: () => {
            // Toast.message('onroamingmsgs');
            console.log('------------->onroamingmsgs');
        },
        onofflinemsgs: () => {
            // Toast.message('onofflinemsgs');
            console.log('------------->onofflinemsgs');
        },
        onsessions: (session) => {
            onSession(props, session, nimStoreTmp);
        },
        onupdatesession: (session) => {
            // Toast.message('onupdatesession');
            console.log('------------->onupdatesession');
            //更新会话信息这里会触发聊天消息列表刷新
            props.updateNewMessage(session);
            onSession(props, session, nimStoreTmp);
        },
        onteams: () => {
            console.log('------------->onteams');
        },
        onupdateteam: () => {
            console.log('------------->onupdateteam');
        },
        // 系统通知
        onsysmsg: (sysmsgs) => {
            // Toast.message('onsysmsg');
            console.log('------------->onsysmsg');
            onSysMsgs(props, sysmsgs, nimStoreTmp)
        },
        onofflinesysmsgs: (sysmsgs) => {
            // Toast.message('onofflinesysmsgs');
            console.log('------------->onofflinesysmsgs');
            onSysMsgs(props, sysmsgs, nimStoreTmp)
        },
        onupdatesysmsg: (sysmsgs) => {
            // Toast.message('onupdatesysmsg');
            console.log('------------->onupdatesysmsg');
            onSysMsgs(props, sysmsgs, nimStoreTmp)
        }, // 通过、拒绝好友申请会收到此回调
    });
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/11/24
 * @function: 过滤会话信息
 */
function filterSession(props, nimStore) {
    const {
        sessionList, userInfos, userID,
    } = nimStore;
    const list = [];

    if (sessionList) {
        for (let i = 0; i < sessionList.length; i += 1) {
            const item = {...sessionList[i]};

            item.name = '';
            item.avatar = '';
            // 没有最新会话的不展示
            if (!item.lastMsg) {
                continue;
            }
            if (item.scene === 'p2p') {
                if (item.to === userID) {
                    continue;
                }
                if (userInfos[item.to]) {
                    item.name = getFriendAlias(userInfos[item.to]);
                    item.avatar = genAvatar(userInfos[item.to].avatar || config.defaultUserIcon);
                }
            } else if (item.scene === 'team') {
                continue;
            }
            const lastMsg = item.lastMsg || {};

            if (lastMsg.type === 'text') {
                item.lastMsgShow = lastMsg.text || '';
            } else if (lastMsg.type === 'custom') {
                item.lastMsgShow = parseCustomMsg(lastMsg);
                // } else if (lastMsg.scene === 'team' && lastMsg.type === 'notification') {
                //   item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
            } else if (mapMsgType(lastMsg)) {
                item.lastMsgShow = `[${mapMsgType(lastMsg)}]`;
            } else {
                item.lastMsgShow = '';
            }
            item.lastMsgShow = shortenWord(item.lastMsgShow, 20);
            if (item.lastMsg.time) {
                item.updateTimeShow = formatDate(item.lastMsg.time, true);
            }
            list.push(item);
        }
    }
    if (list.length !== 0) {
        nimStore.sessionList = list;
        props.updateNimStore(nimStore, 'filterSession');
    }
}


function onSysMsgs(props, sysmsgs, nimStoreTmp) {
    let sysmsgsTmp = sysmsgs;

    if (!Array.isArray(sysmsgs)) {
        sysmsgsTmp = [sysmsgs];
    }
    sysmsgsTmp.forEach((sysmsg) => {
        switch (sysmsg.type) {
            // 在其他端添加或删除好友
            case 'addFriend':
                if (sysmsg.friend) {
                    nimStoreTmp.friendslist = global.nim.mergeFriends(nimStoreTmp.friendslist, [sysmsg.friend]);
                    nimStoreTmp.friendFlags.set(sysmsg.from, true);
                }
                nimStoreTmp.sysMsgs.push(sysmsg);
                break;
            case 'applyFriend':
                nimStoreTmp.sysMsgs = global.nim.mergeSysMsgs(nimStoreTmp.sysMsgs, [sysmsg]);
                nimStoreTmp.sysMsgs = nimStoreTmp.sysMsgs.sort((a, b) => a.time - b.time);
                break;
            case 'deleteFriend':
                nimStoreTmp.friendFlags.delete(sysmsg.from);
                nimStoreTmp.sysMsgs.push(sysmsg);
                break;
            // 对方消息撤回
            case 'deleteMsg':
                onBackoutMsg(props, sysmsg.msg, nimStoreTmp);
                break;
            case 'teamInvite': // 被邀请入群
            case 'applyTeam': // 申请入群
            case 'rejectTeamApply': // 申请入群被拒绝
            case 'rejectTeamInvite': // 拒绝入群邀请
                break;
            default:
                break;
        }
        props.updateNimStore(nimStoreTmp, 'onSysMsgs');
    });
}


function onBackoutMsg(props, msg, nimStoreTmp) {

    // console.log(msg.to, msg.sessionId);
    let tip = '';
    let toAccount = '';

    if (msg.from === nimStoreTmp.userID) {
        tip = '你撤回了一条消息';
        toAccount = msg.to;
    } else {
        const userInfo = nimStoreTmp.userInfos[msg.from];

        if (userInfo) {
            tip = `${getFriendAlias(userInfo)}撤回了一条消息`;
        } else {
            tip = '对方撤回了一条消息';
        }
        toAccount = msg.from;
    }
    props.updateDeleteMessage(msg.idClient);
    global.nim.sendTipMsg({
        isLocal: true,
        scene: msg.scene,
        to: toAccount,
        tip,
        time: msg.time,
        done: (tipErr, tipMsg) => {
            if (tipErr) {
                return;
            }
            const idClient = msg.deletedIdClient || msg.idClient;
            const {sessionId} = msg;

            replaceSessionMsg({
                sessionId,
                idClient,
                msg: tipMsg,
            }, nimStoreTmp);
        },
    });
}


function replaceSessionMsg(obj, nimStoreTmp) {
    const {
        sessionId, idClient, idClientFake, msg,
    } = obj;

    if (sessionId === nimStoreTmp.currentSessionId) {
        const tempMsgs = nimStoreTmp.currentSessionMsgs || [];

        if (tempMsgs.length > 0) {
            const lastMsgIndex = tempMsgs.length - 1;

            for (let i = lastMsgIndex; i >= 0; i -= 1) {
                const currMsg = tempMsgs[i];

                if (idClientFake && idClientFake === currMsg.idClientFake) {
                    tempMsgs.splice(i, 1, msg);
                    break;
                } else if (idClient && idClient === currMsg.idClient) {
                    tempMsgs.splice(i, 1, msg);
                    break;
                }
            }
            nimStoreTmp.currentSessionMsgs = simpleClone(tempMsgs);
        }
    }
}


function onSession(props, session, nimStoreTmp) {

    if (global.nim) {
        nimStoreTmp.sessionList = global.nim.mergeSessions(nimStoreTmp.sessionList, session)
            .sort((a, b) => {
                const time1 = a.lastMsg ? a.lastMsg.time : a.updateTime;
                const time2 = b.lastMsg ? b.lastMsg.time : b.updateTime;

                return time2 - time1;
            });
    }

    console.log('onSession更新会话了', nimStoreTmp.sessionList);

    filterSession(props, nimStoreTmp);
    DeviceEventEmitter.emit('onupdatesession');
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/25
 * @function: 用户登录成功后更新用户资料
 */
export function updateNimUserInfo(nimUserInfo: NimUserInfo) {
    global.nim.updateMyInfo(nimUserInfo);
}

let destroyNIM = (props) => new Promise((resolve, reject) => {
    if (global.nim) {
        global.nim.destroy({
            done(error) {
                global.nim = null;
                props.resetNimStore();
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            },
        });
    } else {
        resolve();
    }
});

