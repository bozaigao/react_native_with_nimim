import React, {Component} from 'react';
import {
    DeviceEventEmitter,
    InteractionManager,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    TouchableOpacityComponent,
    View
} from 'react-native';
import {Navigation, NavigationEvents} from "react-navigation";
import {connect} from "react-redux";
import SessionItem from "../../../Components/Chat/SessionItem";
import styles, {
    absB,
    absR,
    absT,
    bgColor,
    color,
    commonStyles,
    fSize,
    h,
    mt,
    scaleSize,
    w,
    wRatio
} from "../../../Styles/Style";
import {
    resetNimStore,
    updateDeleteMessage,
    updateNewMessage,
    updateNimStore,
    updateSessionList,
} from "../../../Actions/NimManager/NimManager";
import {SwipeListView} from "react-native-swipe-list-view";
import {Toast} from "teaset";
import {debounce, deepClone} from "../../../Utils/DataTool/DataTool";
import {deleteLocalSession} from "../../../Utils/MsgAction";
import {loginNIM} from "../../../Utils/LoginNIM";
//@ts-ignore
import md5 from 'react-native-md5';

declare let global: any;


interface Props {
    navigation: Navigation;
    nimStore: any;
    userID: string;
    updateNimStore: any;
}

interface State {
    showMore: boolean;
    refreshing: boolean;
    sessionList: any[];
}

class MessagePage extends Component<Props, State> {
    private sessionItems;
    private viewRef;
    private onupdatesessionEmitter;

    constructor(props) {
        super(props);
        this.sessionItems = {};
        this.state = {
            sessionList: [],
            showMore: true,
            refreshing: true,
        }
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/10/26
     * @function: 获取会话信息
     */
    getSession() {
        let {sessionList} = this.props.nimStore;

        for (let i = 0; i < sessionList.length; i++) {
            sessionList[i]['key'] = i + 1;
        }
        const list = [];
        let sessionIds = [];

        if (sessionList) {
            for (let i = 0; i < sessionList.length; i += 1) {
                sessionList[i]['key'] = i + 1;
                list.push(sessionList[i]);
                if (sessionList[i].to) {
                    sessionIds.push(sessionList[i].to);
                }
            }
        }
        if (sessionIds.length !== 0) {
            if (global.nim) {
                global.nim.getUsers({
                    accounts: sessionIds,
                    done: this.getUsersDone
                });
            }
        }
        return list;
    }


    //获取用户类型
    getUsersDone = (error, users) => {
        console.log(error);
        console.log(users);
        console.log('更新后的用户资料', this.props.nimStore);
        //更新最近会话的用户信息
        this.updateUserInfos(users);
        console.log('获取用户资料数组' + (!error ? '成功' : '失败'));
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/12/12
     * @function: 更新最近会话的用户信息
     */
    updateUserInfos = (users) => {
        let usersTmp = users;

        if (!Array.isArray(users)) {
            usersTmp = [users];
        }
        usersTmp.forEach((user) => {
            const tempAccount = user.account;

            if (tempAccount) {
                const userInfo = this.props.nimStore.userInfos[tempAccount];

                if (userInfo) {
                    this.props.nimStore.userInfos[tempAccount] = Object.assign(userInfo, user);
                } else {
                    this.props.nimStore.userInfos[tempAccount] = user;
                }
            }
        });
        this.props.updateNimStore(this.props.nimStore);
    }


    itemCell = (data, rowMap) => {
        console.log('聊天数据', data);
        return (
            <SessionItem
                nimStore={this.props.nimStore}
                sendMsgReceipt={() => {
                }}
                deleteLocalSession={() => {
                }}
                ref={(child) => {
                    this.sessionItems[data.item.id] = child;
                }}
                session={data.item}
                onItemPress={(session, nick) => {
                    if (global.nim) {
                        //系统消息
                        if (session.id.includes('system')) {
                            let sessionId = session.id.substr(4, data.item.id.length);

                            this.props.navigation.navigate('SysNoticePage', {
                                sessionId,
                                nick,
                                session
                            });
                        }
                        //普通用户消息
                        else {
                            let sessionId = session.id.substr(4, data.item.id.length);

                            this.props.navigation.navigate('Chat', {
                                sessionId,
                                nick,
                                session
                            });
                        }

                    } else {
                        Toast.message('您还没有登录，请先登录');
                        debounce(500, () => {
                            this.props.navigation.navigate('LoginPage');
                        })
                    }

                }}
            />
        );
    }

    render() {
        let {sessionList} = this.state;

        return (
            <SafeAreaView style={[styles.uf1, bgColor(commonStyles.whiteColor)]}>
                <View style={[styles.uf1, bgColor(commonStyles.dividerColor)]}>
                    <StatusBar barStyle={'dark-content'} backgroundColor={commonStyles.whiteColor}/>
                    <NavigationEvents
                        onWillFocus={() => {
                            StatusBar.setBarStyle('dark-content');
                            if (Platform.OS === 'android') {
                                StatusBar.setBackgroundColor(commonStyles.whiteColor);
                            }
                            InteractionManager.runAfterInteractions(() => {
                                //退出聊天界面的时候如果音频还在播放则停止播放并且销毁
                                if (global.sound) {
                                    global.sound.stop(() => {
                                        global.sound.release();
                                        global.sound = null;
                                    });
                                }
                                this.nimAutoLogin();
                            });
                        }}
                    />
                    {
                        (Platform.OS === 'ios' && Platform.Version < 11) ?
                            <View style={[h(20), bgColor(commonStyles.whiteColor)]}/> :
                            null
                    }
                    <View
                        style={[
                            styles.uac,
                            wRatio(100),
                            h(commonStyles.headHeight),
                            bgColor(commonStyles.whiteColor),
                            styles.ujc,
                            styles.uac
                        ]}
                    >
                        <Text style={[fSize(18), color(commonStyles.textBlackColor)]}>消息</Text>
                    </View>
                    <View style={[styles.uf1, mt(3)]}>
                        <SwipeListView
                            disableRightSwipe={true}
                            useFlatList
                            data={sessionList}
                            renderItem={this.itemCell}
                            renderHiddenItem={(data, rowMap) => (
                                <View
                                    style={[styles.uac, h(83), styles.uf1, styles.udr, styles.ujb, bgColor(commonStyles.pageDefaultBackgroundColor)]}>
                                    <TouchableOpacity
                                        style={[styles.uac, absB(0), styles.ujc, styles.upa, absT(0), w(85), bgColor('red'), absR(0)]}
                                        onPress={_ => this.deleteRow(data, rowMap, data.item.key)}
                                    >
                                        <Text style={color(commonStyles.whiteColor)}>删除</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            leftOpenValue={0}
                            rightOpenValue={scaleSize(-87)}
                            previewRowKey={'0'}
                            previewOpenValue={scaleSize(-40)}
                            previewOpenDelay={3000}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow = async (data, rowMap, rowKey) => {
        this.closeRow(rowMap, rowKey);

        deleteLocalSession(this.props, this.props.nimStore, data.item.id, data.item.to, () => {
            //清除消息indicator数量提示
            if (global.nim) {
                global.nim.setCurrSession(data.item.id);
                global.nim.resetCurrSession();
            }
            //刷新最近会话列表信息
            this.initSessionList();
        });
    }

    componentWillReceiveProps(nextProps) {
        let sessionList = this.getSession();

        if (sessionList.length !== 0) {
            this.setState({sessionList});
        }
    }

    componentDidMount() {
        this.initSessionList();

        this.onupdatesessionEmitter = DeviceEventEmitter.addListener('onupdatesession', (flag) => {
            this.getSessionList();
        });
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2019/1/13
     * @function: 初始化最近聊天会话数据
     */
    initSessionList = () => {
        let {sessionList} = this.props.nimStore;

        for (let i = 0; i < sessionList.length; i++) {
            sessionList[i]['key'] = i + 1;
        }
        //这里有个注意点，那就是当用户初次安装应用realm数据库还为空时，网易云信返回的sessionList的会话里面是没有lastMsg字段的，所以以此作为判定条件
        if (sessionList) {
            this.setState({
                sessionList,
            });
        }
    }

    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/11/19
     * @function: 网易云信自动登录初始化实例
     */
    nimAutoLogin = () => {
        if (global.nim) {
            console.log('网易云信自动登录');
            global.nim.connect();
            this.getSessionList();
        } else {
            console.log('网易云信初始化登录');
            this.nimLogin();
        }
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/10/23
     * @function: 网易云登录
     */
    nimLogin = () => {
        //4b4dd8321b0b11e98a8f00e04c6820ed
        //411be9a7247511e98a8f00e04c6820ed
        let accountId = '4b4dd8321b0b11e98a8f00e04c6820ed';
        //@ts-ignore

        loginNIM(this.props, deepClone(this.props.nimStore), accountId, md5.hex_md5(accountId), () => {
            this.getSessionList();
            this.props.navigation.navigate('Chat', {
                sessionId: '411be9a7247511e98a8f00e04c6820ed',
                nick: 'A'
            });
        });
    };


    componentWillUnmount() {
        this.onupdatesessionEmitter.remove();
    }

    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/11/2
     * @function: 获取最近会话列表
     */
    getSessionList = () => {
        let sessionList = this.getSession();

        this.setState({sessionList});
    }
}


let mapStateToProps = state => ({
        nimStore: state.NimManager.nimStore,
        sessionList: state.NimManager.sessionList,
    }),
    mapDispatchToProps = dispatch => {
        return Object.assign({
            resetNimStore() {
                dispatch(resetNimStore());
            },
            updateNimStore(nimStore, tag) {
                dispatch(updateNimStore(nimStore, tag));
            },
            updateNewMessage(nimStore) {
                dispatch(updateNewMessage(nimStore));
            },
            updateDeleteMessage(nimStore) {
                dispatch(updateDeleteMessage(nimStore));
            },
            updateSessionList(nimStore) {
                dispatch(updateSessionList(nimStore));
            }
        });
    };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessagePage);

