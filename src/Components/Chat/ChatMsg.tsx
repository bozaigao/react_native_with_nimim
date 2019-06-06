import React from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
//@ts-ignore
import {chatStyle, RFT, RVW} from '../../Styles/ChatStyle';
import res from './res/index';
import configs from './Config';
import {backoutMsg} from "../../Utils/MsgAction";
import {CachedImage} from "react-native-cached-fast-image";
import {bgColor, commonStyles} from "../../Styles/Style";
import ChatContent from "./ChatContent";

declare let global: any;

// const soundFile = 'https://yx-web.nos-hz.163yun.com/demo%2Freactnative%2Ftest.mp3'; // require('./test.mp3');

const AvatarItem = (props) => {
    let {avatar} = props;

    if (!avatar || !avatar.includes('http')) {
        avatar = configs.defaultUserIcon;
    }
    return (
        <CachedImage
            source={{uri: avatar}}
            style={{
                width: 12 * RVW, height: 12 * RVW, borderRadius: 6 * RVW,
            }}
        />
    );
};


const getThumbnail = (props) => {
    const {msg} = props;
    const account = msg.from;
    let userInfo: any;

    if (props.nimStore.userID === account) {
        // 自己
        userInfo = props.nimStore.myInfo;
    } else {
        userInfo = props.nimStore.userInfos[account];
    }
    let avatar = configs.defaultUserIcon;

    if (userInfo && userInfo.avatar && userInfo.avatar.includes('http')) {
        avatar = userInfo.avatar;
    }
    return avatar;
};


export const ChatLeft = (props) => {
    const {msg} = props;

    const avatar = getThumbnail(props);


    //跳转事件
    function getUsersDone(error, users) {
        console.log(error);
        console.log(users);
        console.log('获取用户资料数组' + (!error ? '成功' : '失败'));
        if (!error) {

            let user = users[0];
            let ext = JSON.parse(user.custom) || {};
            let role = ext.role || ''

            if (role === 'seeker') {
                //用户
                props.navigation.navigate('TalentDetail', {
                    accountId: msg.from
                });
            } else if (role === 'mch') {
                //商户
                props.navigation.navigate('EnterpriseDetail', {
                    mchId: msg.from,
                });
            } else if (role === 'agent') {
                //中介
                props.navigation.navigate('DailiDetail', {
                    agentId: msg.from,
                });
            }
        }
    }

    return (
        <View
            style={[chatStyle.wrapper, chatStyle.left]}
        >
            <TouchableOpacity
                onPress={() => {

                    global.nim.getUsers({
                        accounts: [msg.from],
                        done: getUsersDone
                    })
                }}
            >
                <AvatarItem
                    avatar={avatar}
                />
            </TouchableOpacity>
            <View
                style={[chatStyle.content, chatStyle.contentLeft, bgColor(msg.type === 'image' ? commonStyles.transparent : commonStyles.whiteColor)]}>
                <ChatContent msg={msg} onImgPress={props.onImgPress}/>
            </View>
        </View>
    );
};


/**
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/25
 * @function: 确认是否撤回消息
 */
function confirmBackoutMsg(props, nimStore, msg) {
    if (props) {
        const currentTime = (new Date()).getTime();

        if (currentTime - msg.time > 120 * 1000) {
            return;
        }
        Alert.alert('提示', '只能撤回发送2分钟以内的消息，确认要撤回', [
            {text: '取消'},
            {
                text: '确认撤回', onPress: () => {
                    backoutMsg(props, nimStore, msg);
                }
            },
        ]);
    }
}


export const ChatRight = (props) => {

    const {msg, nimStore} = props;
    const avatar = getThumbnail(props);

    return (
        <View style={[chatStyle.wrapper, chatStyle.right]}>
            {msg.status === 'fail' ?
                <Icon
                    name="exclamation-circle"
                    type="font-awesome"
                    size={5 * RFT}
                    color="#f00"
                    iconStyle={chatStyle.icon}
                /> :
                null
            }
            {msg.status === 'sending' ?

                <CachedImage source={res.loadingMsg} style={chatStyle.icon}/> :
                null
            }
            <TouchableOpacity
                style={[chatStyle.content, chatStyle.contentRight, bgColor(msg.type === 'image' ? commonStyles.transparent : commonStyles.colorTheme)]}
                activeOpacity={1}
                onLongPress={() => {
                    confirmBackoutMsg(props, nimStore, msg);
                }}
            >
                <ChatContent msg={msg} onImgPress={props.onImgPress}/>
            </TouchableOpacity>
            <AvatarItem
                avatar={avatar}
            />
        </View>
    );
};

