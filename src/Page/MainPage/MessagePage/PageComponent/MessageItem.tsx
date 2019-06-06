/**
 * @filename MessageItem.tsx@author 何晏波
 * @QQ 1054539528
 * @date 2018/7/31
 * @Description: 求职列表item
 */
import React, {PureComponent} from 'react';
import {
    absR,
    absT,
    bb,
    bdColor,
    bgColor,
    color,
    commonStyles,
    default as styles,
    fSize,
    h,
    hRatio,
    ml,
    mt,
    pl,
    pr,
    radiusA,
    scaleSize,
    w,
    width,
    wRatio
} from '../../../../Styles/Style';
import {Text, TouchableHighlight, View} from 'react-native';
import {Navigation} from "react-navigation";
import {CachedImage} from "react-native-cached-fast-image";
import configs from '../../../../Components/Chat/Config';
import {Toast} from "teaset";

interface Props {
    onItemPress: any;
    itemHeight?: number;
    navigation?: Navigation;
    itemData: any;
    nimStore: any;
}


interface State {
}

export default class MessageItem extends PureComponent<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        let {itemData, onItemPress, itemHeight} = this.props, noticeText;

        if (itemData.id.includes('system')) {
            // noticeText = '职卓小秘书';
            if (itemData.lastMsg) {
                let obj = JSON.parse(itemData.lastMsg.content)

                noticeText = obj['content'];
            }
        } else if (itemData.lastMsg && itemData.lastMsg.type === 'tip') {
            noticeText = `[${itemData.lastMsg.tip}]`;
        } else if (itemData.lastMsg && itemData.lastMsg.type === 'text') {
            noticeText = itemData.lastMsg.text;
        } else if (itemData.lastMsg && itemData.lastMsg.type === 'image') {
            noticeText = '[图片]';
        } else if (itemData.lastMsg && itemData.lastMsg.type === 'audio') {
            noticeText = '[语音]';
        }

        if (itemData.lastMsg) {

            return (
                <TouchableHighlight
                    underlayColor={commonStyles.sessionItemBg}
                    style={[
                        styles.uf1,
                        wRatio(100),
                        styles.uac,
                        styles.ujb,
                        styles.udr,
                        bb(0.5),
                        bdColor(commonStyles.dividerColor),
                        h(itemHeight),
                    ]}
                    onPress={
                        () => {
                            onItemPress(itemData, itemData.name);
                        }}
                >
                    <View
                        style={[styles.uac, styles.udr, hRatio(100), wRatio(100), bgColor(commonStyles.whiteColor), pl(16),
                            pr(16)]}>
                        <View>
                            <CachedImage
                                source={{uri: itemData.avatar}}
                                style={[w(45), h(45), radiusA(22.25)]}
                            />
                            {
                                itemData.unread > 0 && itemData.id.includes('system') ?
                                    <View
                                        style={[w(9), h(9), bgColor(commonStyles.redColor), styles.upa, absT(0), absR(0), radiusA(4.5)]}/> :
                                    null
                            }
                        </View>
                        <View style={[ml(20)]}>
                            <View style={[styles.udr, styles.uac, styles.ujb, {width: width - scaleSize(100)}]}>
                                <Text style={[fSize(15), color(commonStyles.textBlackColor)]}>
                                    {itemData.id.includes('system') ? '职卓小秘书' : itemData.name}
                                </Text>
                                <Text style={[fSize(12), color(commonStyles.textWathetBlueColor)]}>
                                    {itemData.updateTimeShow}
                                </Text>
                            </View>
                            <View style={[mt(5), styles.udr, styles.uac, styles.ujb, {width: width - scaleSize(100)}]}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        h(20),
                                        wRatio(90),
                                        styles.utxvc,
                                        fSize(13),
                                        color(commonStyles.tabBottomTextInActiveColor),
                                    ]}
                                >
                                    {noticeText}
                                </Text>
                                {
                                    itemData.unread > 0 && !itemData.id.includes('system') ?
                                        <View
                                            style={[w(itemData.unread >= 99 ? 27 : 18), h(18), radiusA(9), bgColor(commonStyles.redColor), styles.ujc, styles.uac]}>
                                            <Text
                                                style={[color(commonStyles.whiteColor), fSize(8)]}>{itemData.unread >= 99 ? `${99}+` : `${itemData.unread}`}</Text>
                                        </View> :
                                        null
                                }
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        }
        return null;
    }


    /**
     * @author 何晏波
     * @QQ 1054539528
     * @date 2018/10/26
     * @function: 获取用户头像
     */
    getThumbnail = (session) => {
        if (session) {
            Toast.message(session.avatar);
            const account = session.to;
            let userInfo: any = {};

            if (this.props.nimStore.userID === account) {
                // 自己
                userInfo = this.props.nimStore.myInfo;
            } else {
                userInfo = this.props.nimStore.userInfos[account];

            }
            let avatar = configs.defaultUserIcon;

            if (userInfo && userInfo.avatar && userInfo.avatar.includes('http')) {
                avatar = userInfo.avatar;
            }
            return avatar;
        }
        return configs.defaultUserIcon;

    };
}

