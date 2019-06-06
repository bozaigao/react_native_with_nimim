/**
 * @filename Chat.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/25
 * @Description: 聊天界面
 */
import React from 'react';
import {DeviceEventEmitter, FlatList, SafeAreaView, Text, View} from 'react-native';
import {chatStyle} from '../../../Styles/ChatStyle';
import {ChatLeft, ChatRight} from '../../../Components/Chat/ChatMsg';
import ChatBox from "../../../Components/Chat/ChatBox";
import {Navigation, NavigationEvents} from "react-navigation";
import {formatDate, getFriendAlias, uuid} from "../../../Utils/DataTool/DataTool";
import {connect} from "react-redux";
import TopHeader from "../../../Components/TopHeader";
import {getHistoryMsgs, getLocalMsgs} from "../../../Utils/MsgAction";
import {
    resetNimStore,
    updateDeleteMessage,
    updateNewMessage,
    updateSessionList
} from "../../../Actions/NimManager/NimManager";
import {checkNetworkAvailable} from "../../../Utils/CheckNetWork";
import {
    absB,
    absL,
    bgColor,
    color,
    commonStyles,
    default as styles,
    fSize,
    hRatio,
    mt,
    padding,
    radiusA,
    wRatio
} from "../../../Styles/Style";
import PhotoViewModal from "./PhotoViewModal";
import {save} from "../../../Utils/Storage";

declare let global: any;


interface Props {
    navigation: Navigation;
    nimStore: any;
    userID: string;
    updateNimStore: any;
    resetNimStore: any;
    //面试邀请消息
    interViewerMsg?: {
        inviteId: string,
        positionDesc: string,
        companyName: string,
        position: any,
    }
}

interface State {
    showMore: boolean;
    refreshing: boolean;
    historyMsgs: any;
    loadmore: boolean;
    showModal: boolean;
    imgUrl: string;
}

class Chat extends React.Component<Props, State> {
    private toAccount: string;
    private scene: string;
    private notScroll: boolean;
    private sessionId: string;
    private to: string;
    private viewRef;
    private endTime;
    private chatListRef;

    constructor(props) {
        super(props);
        this.state = {
            showMore: false,
            refreshing: false,
            historyMsgs: [],
            loadmore: false,
            showModal: false,
            imgUrl: '',
        };
        this.toAccount = '';
        this.scene = '';
        const sessionId = `p2p-${props.navigation.getParam('sessionId', '')}`;

        this.sessionId = sessionId;

        this.scene = 'p2p';
        this.to = this.sessionId.substr(4, this.sessionId.length);

        this.notScroll = false;
        this.endTime = new Date().getTime();
    }

    componentDidMount() {
        // checkNetworkAvailable(() => {
        //     this.initNimLocalData();
        // },()=>{
        //     get(this.sessionId, (historyMsgs) => {
        //         if (historyMsgs) {
        //             Toast.message(JSON.stringify(historyMsgs));
        //             this.setState({historyMsgs});
        //         }
        //     });
        // });
        this.initNimLocalData();
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/11/16
     * @function: 初始化聊天本地的数据
     */
    initNimLocalData = () => {
        let session = this.props.navigation.getParam('session', null);

        if (global.nim) {
            global.nim.setCurrSession(this.sessionId);

            //消息已读回执
            // if (global.nim && session) {
            //     global.nim.sendMsgReceipt({
            //         msg: session.lastMsg,
            //         done: (error, obj) => {
            //             console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
            //         }
            //     });
            // }

            //从本地realm数据库中获取聊天数据
            getLocalMsgs(
                this.props,
                this.sessionId,
                {
                    done: (msgs) => {
                        console.log('获取的消息', msgs);
                        this.setState({
                            historyMsgs: this.sortMsgs(msgs),
                        }, () => {
                            save(this.sessionId, this.state.historyMsgs)
                        });
                    }
                },
            );
        }
    }

    componentWillUnmount() {
        //恢复消息未读数统计
        if (global.nim) {
            global.nim.resetCurrSession();
        }
    }

    scrollToEnd = (animated = false) => {
        if (this.notScroll) {
            return;
        }
        this.chatListRef && this.chatListRef.scrollToEnd({animated});
    }

    loadMore = () => {

        if (this.state.historyMsgs[0] && this.state.historyMsgs[0].time) {
            this.endTime = this.state.historyMsgs[0].time;
        } else if (this.state.historyMsgs[1] && this.state.historyMsgs[1].time) {
            this.endTime = this.state.historyMsgs[1].time;
        }
        this.setState({
            refreshing: true,
        });
        const {scene, to} = this;

        getHistoryMsgs(
            scene,
            to,
            (msgs) => {
                this.setState({
                    refreshing: false,
                });
                if (!msgs || msgs.length <= 0) {
                    return;
                }
                const currHistoryMsgs = this.sortMsgs(msgs);

                this.state.historyMsgs.forEach((item) => {
                    currHistoryMsgs.push(item);
                });
                this.setState({
                    loadmore: true,
                    historyMsgs: currHistoryMsgs,
                }, () => {
                    save(this.sessionId, this.state.historyMsgs)
                });
            },
            {
                reverse: false,
                asc: true,
                endTime: this.endTime,
            }
        );
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/10/25
     * @function: 根据时间进行消息排序
     */
    sortMsgs = (origMsgs) => {
        const msgLen = origMsgs.length;
        const msgs = [];
        let origMsgsTmp;

        if (msgLen > 0) {
            origMsgsTmp = origMsgs.sort((a, b) => a.time - b.time);
            let lastMsgTime = 0;

            origMsgsTmp.forEach((msg) => {
                if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                    msgs.push({
                        type: 'timeTag',
                        text: formatDate(msg.time, false),
                        key: uuid(),
                    });
                    lastMsgTime = msg.time;
                }
                msgs.push(msg);
            });
        }
        return msgs;
    }

    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/10/25
     * @function: 获取会话名称
     */
    sessionName = (defaultNick) => {
        const {sessionId} = this;
        const {userInfos} = this.props.nimStore;

        if (/^p2p-/.test(sessionId)) {
            const user = sessionId.replace(/^p2p-/, '');

            this.toAccount = user;
            this.scene = 'p2p';
            if (user === this.props.userID) {
                return '我的电脑';
            }
            const userInfo = userInfos[user] || {};
            let alias = getFriendAlias(userInfo);

            return (alias ? alias : defaultNick);
        } else if (/^team-/.test(sessionId)) {
            const team = sessionId.replace(/^team-/, '');

            this.toAccount = team;
            this.scene = 'team';
            return '群会话';
        }
        return sessionId;
    }

    renderItem = ((item) => {
        const msg = item.item;

        if (msg.type === 'tip') {
            return (<View style={[styles.uSelfCenter, bgColor('rgb(216,216,216)'), radiusA(3), styles.uac,
                styles.udc, padding([2, 5, 2, 5]), mt(10)]}>
                <Text style={[fSize(12), color(commonStyles.whiteColor)]}>{msg.tip}</Text>
            </View>);
        } else if (msg.flow === 'in') {
            return (<ChatLeft
                onImgPress={(url) => {
                    this.setState({showModal: true, imgUrl: url});
                }}
                msg={msg}
                nimStore={this.props.nimStore}
                navigation={this.props.navigation}
            />);
        } else if (msg.flow === 'out') {
            return (<ChatRight
                {...this.props}
                onImgPress={(url) => {
                    this.setState({showModal: true, imgUrl: url});
                }}
                msg={msg}
                nimStore={this.props.nimStore}
                navigation={this.props.navigation}
            />);
        } else if (msg.type === 'timeTag') {
            return (
                <View style={[wRatio(100), styles.uac, styles.udc, mt(10)]}>
                    <View
                        style={[styles.uac, styles.udc, radiusA(4), bgColor('rgb(216,216,216)'), padding([2, 3, 2, 3])]}>
                        <Text style={chatStyle.timetag}>{msg.text}</Text>
                    </View>
                </View>);
        }
        return null;
    });

    componentWillReceiveProps(nextProps) {
        //只更新当前会话的聊天信息，对消息进行过滤
        if (nextProps.newSession && nextProps.newSession.id === this.sessionId) {
            this.messageStateUpdate(nextProps);
        }
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2019/1/16
     * @function: 更新消息的发送状态处理、对图片预加载做处理、新消息直接追加、消息撤回删除旧消息
     */
    messageStateUpdate = (nextProps) => {
        let {historyMsgs} = this.state;
        let msgHasDel = false;

        if (historyMsgs.length > 0) {
            //图片发送做了预加载处理，这里用发送成功的图片替换预加载显示的图片
            if (nextProps.newSession.lastMsg.type === 'image') {
                for (let i = 0; i < historyMsgs.length; i++) {
                    //只有音频、图片文件才有md5属性
                    if (historyMsgs[i].type === 'image' &&
                        historyMsgs[i].file.md5 === nextProps.newSession.lastMsg.file.md5) {
                        msgHasDel = true;
                        historyMsgs.splice(i, 1, nextProps.newSession.lastMsg);
                        this.setState({historyMsgs});
                        break;
                    }
                }
            } else {
                for (let i = 0; i < historyMsgs.length; i++) {
                    //更新消息发送状态(pendding、success)
                    if (historyMsgs[i].idClient &&
                        historyMsgs[i].idClient === nextProps.newSession.lastMsg.idClient &&
                        nextProps.newSession.lastMsg.type !== 'image') {
                        msgHasDel = true;
                        historyMsgs.splice(i, 1, nextProps.newSession.lastMsg);
                        this.setState({historyMsgs}, () => {
                            save(this.sessionId, historyMsgs);
                        });
                    }
                }

                for (let i = 0; i < historyMsgs.length; i++) {
                    //消息撤回,删除消息
                    if (nextProps.deleteMsgId) {
                        if (historyMsgs[i].idClient === nextProps.deleteMsgId) {
                            msgHasDel = true;
                            historyMsgs.splice(i, 1);
                            this.setState({historyMsgs: historyMsgs}, () => {
                                save(this.sessionId, historyMsgs)
                            });
                            break;
                        }
                    }
                }
            }

            //新消息直接追加
            if (!msgHasDel) {
                this.setState({historyMsgs: historyMsgs.concat(nextProps.newSession.lastMsg)}, () => {
                    save(this.sessionId, historyMsgs);
                });
            }
        } else {
            this.setState({historyMsgs: historyMsgs.concat(nextProps.newSession.lastMsg)}, () => {
                save(this.sessionId, historyMsgs);
            });
        }

    }


    render() {
        const {navigation, nimStore} = this.props;
        let nick = navigation.getParam('nick', '');
        let {showModal, imgUrl, historyMsgs} = this.state;

        return (
            <SafeAreaView style={[styles.uf1, bgColor(commonStyles.whiteColor)]}>
                <View
                   style={[{flex: 1}, bgColor(commonStyles.pageDefaultBackgroundColor)]}>
                    <TopHeader title={`@${this.sessionName(nick)}`} navigation={navigation}/>
                    <NavigationEvents
                        onWillFocus={() => {

                        }}
                    />
                    <FlatList
                        data={historyMsgs}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                        ref={(ref) => {
                            this.chatListRef = ref;
                            DeviceEventEmitter.emit('chatListRef', ref);
                        }}
                        onContentSizeChange={() => {
                            if (!this.state.loadmore) {
                                this.scrollToEnd()
                            }
                        }}
                        onRefresh={() => {
                            checkNetworkAvailable(() => {
                                this.loadMore()
                            })
                        }}
                        refreshing={this.state.refreshing}
                    />
                    <ChatBox
                        {...this.props}
                        sendImgCallback={(fileOptions) => {
                            //先预加载图片
                            let imgMessage = {
                                ...fileOptions,
                                preLoad: true,
                                from: nimStore.userID,
                                type: 'image',
                                flow: 'out',
                                status: 'sending',
                                file: {md5: fileOptions.md5}
                            };

                            this.setState({historyMsgs: historyMsgs.concat(imgMessage)});
                        }
                        }
                        updateRecordState={(updateRecordingState: string) => {
                            this.viewRef && this.viewRef.updateRecordingState(updateRecordingState)
                        }}
                        ifShowRecordTip={(state: boolean) => {
                            if (state) {
                                this.viewRef && this.viewRef.showRecordingTip();
                            } else {
                                this.viewRef && this.viewRef.hideRecordingTip();
                            }
                        }
                        }
                        nimStore={this.props.nimStore}
                        options={{
                            scene: this.scene,
                            toAccount: this.toAccount,
                        }}
                    />
                    <PhotoViewModal
                        url={imgUrl}
                        onPress={() => {
                            this.setState({showModal: false});
                        }}
                        showModal={showModal}/>
                </View>
            </SafeAreaView>
        );
    }
}

let mapStateToProps = state => ({
        nimStore: state.NimManager.nimStore,
        newSession: state.NimManager.newSession,
        deleteMsgId: state.NimManager.deleteMsgId,
    }),
    mapDispatchToProps = dispatch => {
        return Object.assign({
            resetNimStore() {
                dispatch(resetNimStore());
            },
            updateNewMessage(nimStore) {
                dispatch(updateNewMessage(nimStore));
            },
            updateDeleteMessage(nimStore) {
                dispatch(updateDeleteMessage(nimStore));
            },
            updateSessionList(nimStore) {
                dispatch(updateSessionList(nimStore));
            },
        });
    };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
