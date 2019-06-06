/**
 * @filename NimManager.ts
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @Description: Nim网易云信聊天状态管理
 */
import {save} from "../../Utils/Storage";
import {DeviceEventEmitter} from "react-native";

const initialState = {
    nimStore: {
        imLastMsg: '',
        imSendMsg: '',
        // 登录账户ID
        userID: null,
        // 用户名片
        myInfo: {},
        // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
        userInfos: {},
        // 是否为好友等相关信息
        friendFlags: new Map(),
        // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
        userSubscribes: {},
        // 好友列表
        friendslist: [],
        // 机器人列表
        robotslist: [],
        // 用于判定帐号是否是robots
        robotInfos: [],
        robotInfosByNick: {},
        // 黑名单列表
        blacklist: [],
        // 禁音列表
        mutelist: [],
        teamlist: [],
        // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
        teamAttrs: {},
        // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
        teamMembers: {},
        // 关闭群提醒的群id列表
        muteTeamIds: [],
        // 群设置传递数据
        teamSettingConfig: {},
        // 已发送群消息回执Map,key为群Id
        sentReceipedMap: {},
        // 当前群消息回执查询的群id
        currReceiptQueryTeamId: null,
        // 群消息回执查询的消息列表
        receiptQueryList: [],
        // 群消息回执查询结果列表
        teamMsgReads: [],
        // 群消息已读未读账号列表
        teamMsgReadsDetail: {},
        // 消息列表
        msgs: null, // 以sessionId作为ke
        msgsMap: {},// 以idClient作为key，诸如消息撤回等的消息查
        // 会话列表
        sessionList: [],
        sessionMap: {},
        // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
        currentSessionId: null,
        currentSessionMsgs: [],
        // 是否有更多历史消息，用于上拉加载更多
        noMoreHistoryMsgs: false,
        // 继续对话的机器人id
        continueRobotAccid: '',
        // 系统消息
        sysMsgs: [],
        customSysMsgs: [],
        sysMsgUnread: null,
        customSysMsgUnread: {
            total: 0,
        },
        // 临时变量
        // 缓存需要获取的用户信息账号,如searchUser
        searchedUsers: [],
        // 缓存需要获取的群组账号
        searchedTeams: [],
    },
    newSession: null,
    //撤回的消息
    deleteMsgId: null,
}

interface Action {
    type: string;
    data: any;
}

export function NimManager(
    state = initialState,
    action: Action = {type: 'default', data: {}}
) {
    switch (action.type) {
        case 'resetNimStore':
            return {
                ...state,
                nimStore: action.data,
            };
        case 'updateNimStore':
            return {
                ...state,
                nimStore: action.data,
            };
        case 'updateNewMessage':
            return {
                ...state,
                newSession: action.data,
            };
        case 'updateDeleteMsg':
            return {
                ...state,
                deleteMsgId: action.data,
            };
        case 'updateSessionList':
            return {
                ...state,
                sessionList: action.data,
            };
        default:
            return state;
    }
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/26
 * @function: 更新会话列表
 */
export function updateSessionList(sessionList) {
    console.log('updateSessionList');
    return {
        type: 'updateSessionList',
        data: sessionList
    };
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/25
 * @function: 消息撤回
 */
export function updateDeleteMessage(deleteMsgId) {
    console.log('updateNewMessage');
    return {
        type: 'updateDeleteMsg',
        data: deleteMsgId
    };
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 更新新消息
 */
export function updateNewMessage(newSession) {
    console.log('updateNewMessage');
    return {
        type: 'updateNewMessage',
        data: newSession
    };
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 更新NiMStore
 */
export function updateNimStore(nimStore: any,tag:string) {
    console.log(tag+'更新nimStore' + nimStore.userID + '---' + nimStore.sessionList.length)
    save(`nimStore${nimStore.userID}`, nimStore);
    DeviceEventEmitter.emit('nimStoreChange', nimStore);
    return {
        type: 'updateNimStore',
        data: nimStore
    };
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @function: 清空nimStore数据
 */
export function resetNimStore() {
    return {
        type: 'resetNimStore',
        data: {
            userID: null,
            myInfo: {},
            userInfos: {},
            friendFlags: new Map(),
            userSubscribes: {},
            friendslist: [],
            robotslist: [],
            robotInfos: {},
            robotInfosByNick: {},
            blacklist: [],
            mutelist: [],

            teamlist: [],
            teamAttrs: {},
            teamMembers: {},
            muteTeamIds: [],
            teamSettingConfig: {},
            sentReceipedMap: {},
            currReceiptQueryTeamId: null,
            receiptQueryList: [],
            teamMsgReads: [],
            teamMsgReadsDetail: {
                readAccounts: [],
                unreadAccounts: [],
            },

            msgsMap: {},
            sessionList: [],
            sessionMap: {},
            currentSessionId: null,
            currentSessionMsgs: [],
            noMoreHistoryMsgs: false,
            continueRobotAccid: '',

            sysMsgs: [],
            customSysMsgs: [],
            sysMsgUnread: {
                total: 0,
            },
            customSysMsgUnread: 0,

            searchedUsers: [],
            // 缓存需要获取的群组账号
            searchedTeams: [],
        }
    };
}

