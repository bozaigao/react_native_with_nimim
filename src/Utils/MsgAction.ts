import {formatDate, getFriendAlias, simpleClone, uuid} from "./DataTool/DataTool";
import {Toast} from "teaset";
import Api from '../Api/HttpUrl';

declare let global: any;

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/24
 * @function: 获取云端的历史记录消息
 */
export function getHistoryMsgs(scene, to, done, options) {
    if (global.nim) {
        global.nim.getHistoryMsgs({
            scene,
            to,
            ...options,
            limit: 10,
            done(error, obj) {
                if (error) {
                    Toast.message('请检查网络');
                    return;
                }
                if (done instanceof Function) {
                    done(obj.msgs);
                }
            },
        });
    }
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/26
 * @function: 获取本地会话消息
 */
export function getLocalSessions(lastSessionId: string, limit: number, done: any) {
    if (global.nim) {
        global.nim.getLocalSessions({
            lastSessionId: lastSessionId,
            limit: 10,
            done
        });
    }
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/11/16
 * @function: 发送消息的回执
 */
export function sendMsgReceipt(msg: any) {
    console.log('会话', msg);
    if (global.nim) {
        global.nim.sendMsgReceipt({
            msg,
            done: (error) => {
                console.log('发送消息的回执', error.message);
            },
        });
    }
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 获取本地的历史聊天数据
 */
export function getLocalMsgs(props, sessionId, options) {
    const {done} = options;

    if (global.nim) {
        global.nim.getLocalMsgs({
            sessionId,
            limit: 10,
            end: Infinity,
            desc: true,
            done: (err, obj) => {
                if (err) {
                    console.log(err);
                }
                if (done instanceof Function) {
                    done(obj.msgs);
                }
            },
        });
    }
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 发送普通文本信息
 */
export function sendTextMsg(props, nimStore, options) {
    let nimStoreTmp = nimStore;

    if (global.nim) {
        const {
            scene, to, text,
        } = options;

        const msg = global.nim && global.nim.sendText({
            scene,
            to,
            text,
            done: (error, newMsg) => {
                if (error) {
                    if (error.code === Api.NetworkState.NO_FOUND) {
                        Toast.message('用户不存在');
                    } else {
                        Toast.message('请检查网络');
                    }

                    newMsg.status = 'fail';
                }
                replaceSessionMsg(props, nimStoreTmp, {
                    sessionId: newMsg.sessionId,
                    idClient: newMsg.idClient,
                    msg: newMsg,
                });
            },
        });

        appendSessionMsg(props, nimStoreTmp, msg);
    }
}


export function sendCustomMsg(props, nimStore, options) {
    let nimStoreTmp = nimStore;

    if (global.nim) {
        const {scene, to, content} = options;

        const msg = global.nim.sendCustomMsg({
            scene,
            to,
            content: JSON.stringify(content),
            done: (error, newMsg) => {
                if (error) {
                    if (error.code === Api.NetworkState.NO_FOUND) {
                        Toast.message('用户不存在');
                    } else {
                        Toast.message('请检查网络');
                    }

                    newMsg.status = 'fail';
                }
                replaceSessionMsg(props, nimStoreTmp, {
                    sessionId: newMsg.sessionId,
                    idClient: newMsg.idClient,
                    msg: newMsg,
                });
            },
        });

        appendSessionMsg(props, nimStoreTmp, msg);
    } else {
        return {
            type: 'updateNimStore',
            data: null
        };
    }
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 往会话中追加聊天数据
 */
export function appendSessionMsg(props, nimStore, msg) {
    let nimStoreTmp = nimStore;

    const {sessionId} = msg;
    const tempMsgs = [];

    // if (nimStore.msgsMap[sessionId]) {
    //   nimStore.msgsMap[sessionId].push(msg);
    // }
    if (sessionId === nimStoreTmp.currentSessionId) {

        const msgLen = nimStoreTmp.currentSessionMsgs.length;

        if (msgLen > 0) {
            const lastMsgTime = nimStoreTmp.currentSessionMsgs[msgLen - 1].time;

            if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                tempMsgs.push({
                    type: 'timeTag',
                    text: formatDate(msg.time, false),
                    key: uuid(),
                });
            }
        } else {
            tempMsgs.push({
                type: 'timeTag',
                text: formatDate(msg.time, false),
                key: uuid(),
            });
        }
        tempMsgs.push(msg);
        nimStoreTmp.currentSessionMsgs = nimStoreTmp.currentSessionMsgs.concat(tempMsgs);
        console.log('------------->appendSessionMsg');
        props.updateNimStore(nimStoreTmp);
    }
}


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 发送语音消息
 */
export function sendAudioMsg(props, nimStore, options) {
    let nimStoreTmp = nimStore;

    if (global.nim) {
        global.nim.previewFile({
            type: 'audio',
            filePath: options.filePath,
            uploadprogress(obj) {

            },
            done: (error, {name, url, ext}) => {
                const file = {
                    name,
                    url,
                    dur: options.dur,
                    md5: options.md5,
                    size: options.size,
                    ext,
                };
                const {scene, to} = options;

                if (!error) {
                    const msg = global.nim.sendFile({
                        type: 'audio',
                        scene,
                        to,
                        file,
                        done: (err, newMsg) => {
                            if (error) {
                                if (error.code === Api.NetworkState.NO_FOUND) {
                                    Toast.message('用户不存在');
                                } else {
                                    Toast.message('请检查网络');
                                }

                                newMsg.status = 'fail';
                            }
                            // newMsg.file.pendingUrl = prevMsg.file.pendingUrl;
                            replaceSessionMsg(props, nimStoreTmp, {
                                sessionId: newMsg.sessionId,
                                idClient: newMsg.idClient,
                                msg: newMsg,
                            });
                            console.log(err.message);
                        },
                    });

                    appendSessionMsg(props, nimStoreTmp, msg);
                    if (options.callback instanceof Function) {
                        options.callback();
                    }
                }
            },
        });
    }
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 发送图片消息
 */
export function sendImageMsg(props, nimStore, options) {
    let nimStoreTmp = nimStore;

    if (global.nim) {
        // 本地的图片先显示了，并转菊花
        options.type = 'image';
        const prevMsg = generateFakeMsg(nimStoreTmp, options);

        appendSessionMsg(props, nimStoreTmp, prevMsg);
        if (options.callback instanceof Function) {
            options.callback();
        }
        global.nim.previewFile({
            type: 'image',
            filePath: options.filePath,
            uploadprogress(obj) {

            },
            done: (error, {name, url, ext}) => {
                const file = {
                    name,
                    url,
                    w: options.width,
                    h: options.height,
                    md5: options.md5,
                    size: options.size,
                    ext,
                };
                const {scene, to} = options;

                if (!error) {
                    const msg = global.nim.sendFile({
                        type: 'image',
                        scene,
                        to,
                        file,
                        done: (err, newMsg) => {
                            if (error) {
                                if (error.code === Api.NetworkState.NO_FOUND) {
                                    Toast.message('用户不存在');
                                } else {
                                    Toast.message('请检查网络');
                                }

                                newMsg.status = 'fail';
                            }
                            // newMsg.file.pendingUrl = prevMsg.file.pendingUrl;
                            replaceSessionMsg(props, nimStoreTmp, {
                                sessionId: newMsg.sessionId,
                                idClient: newMsg.idClient,
                                msg: newMsg,
                            });
                            console.log(err.message);
                        },
                    });
                    // 替换本地假消息
                    const tempMsg = simpleClone(msg);

                    // tempMsg.file.pendingUrl = prevMsg.file.pendingUrl;
                    replaceSessionMsg(props, nimStoreTmp, {
                        sessionId: msg.sessionId,
                        idClient: msg.idClient,
                        idClientFake: prevMsg.idClientFake,
                        msg: tempMsg,
                    });
                    if (options.callback instanceof Function) {
                        options.callback();
                    }
                }
            },
        });
    }
}


function generateFakeMsg(nimStoreTmp, options) {
    const {
        scene, to, type, pendingUrl,
    } = options;

    const msg = {
        sessionId: `${scene}-${to}`,
        scene,
        from: nimStoreTmp.userID,
        to,
        flow: 'out',
        type,
        file: {
            pendingUrl,
            w: options.width,
            h: options.height,
        },
        idClientFake: uuid(),
        status: 'sending',
        time: (new Date()).getTime(),
    };

    return msg;
}


export function replaceSessionMsg(props, nimStoreTmp, obj) {
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
            props.updateNimStore(nimStoreTmp);
        }
    }
}

export function deleteLocalSession(props, nimStore, sessionId,to, callback) {
    let nimStoreTmp = nimStore;

    if (global.nim) {
        global.nim.deleteLocalSession({
            id: sessionId,
            done: (error) => {
                if (error) {
                    return;
                }
                nimStoreTmp.sessionList = global.nim.cutSessionsByIds(nimStore.sessionList, [sessionId]);
                props.updateNimStore(nimStoreTmp);
                if (callback) {
                    callback();
                }
                //本地删除成功后同时删除服务器端的会话
                global.nim.deleteSession({
                    scene: 'p2p',
                    to,
                    done: (error, obj)=>{
                        console.log(error);
                        console.log(obj);
                        if (error){
                            Toast.message(JSON.stringify(error));
                        }
                        console.log('删除服务器上的会话' + (!error?'成功':'失败'));
                    }
                });
            },
        });
    }
}

/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/23
 * @function: 消息撤回
 */
export function backoutMsg(props, nimStore, msg) {
    let nimStoreTmp = nimStore;

    props.updateDeleteMessage(msg.idClient);
    if (global.nim) {
        global.nim.deleteMsg({
            msg,
            done: (error) => {
                onBackoutMsg(props, nimStoreTmp, error, msg);
            },
        });
    }
}

export function onBackoutMsg(props, nimStoreTmp, error, msg) {
    if (error) {
        console.log(error);
        return;
    }
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
    if (global.nim) {
        global.nim.sendTipMsg({
            isLocal: true,
            scene: msg.scene,
            to: toAccount,
            tip,
            time: msg.time,
            done: (tipErr, tipMsg) => {
                if (tipErr) {
                    console.log(tipErr);
                    return;
                }
            },
        });
    }
}


