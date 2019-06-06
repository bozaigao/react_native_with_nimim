/**
 * @filename ChatBox.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @Description: 聊天界面的底部聊天面板
 */
import React, {Component} from 'react';
import {
    DeviceEventEmitter,
    ImageBackground,
    InteractionManager,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ChatAudio from './ChatAudio';
import {chatStyle} from '../../Styles/ChatStyle';
import {Toast} from "teaset";
import {uuid} from "../../Utils/DataTool/DataTool";
import {bgColor, color, commonStyles, default as styles, fSize, h, ml, mt, pt, radiusA, w} from "../../Styles/Style";
import {CachedImage} from "react-native-cached-fast-image";
import {sendAudioMsg, sendCustomMsg, sendImageMsg, sendTextMsg} from "../../Utils/MsgAction";
import {isIphoneX} from "../../Assets/Const";
import Expression from "./Expression";
import ImagePicker from 'react-native-image-picker';
import {ChatItemType} from "../../../App";

let iconSize = 25;

interface Props {
    nimStore: any;
    options: {
        scene: string;
        toAccount: string;
    };
    //录音状态函数回调
    updateRecordState:any;
    ifShowRecordTip:any;
    //发送图片的回调
    sendImgCallback:any;
}

interface State {
    isExtraShown: boolean;
    msgText: string;
    isTextMsg: boolean;
    isEmojiShown: boolean;
}


export const ChatItem = (props) => {

    return (
        <View style={[styles.uac]}>
            <CachedImage source={require('../img/ico_picture.png')}
                         onPress={props.onPress} style={[w(45), h(45)]}/>
            <Text
                style={[fSize(12), color(commonStyles.textGrayColor), mt(6)]}>图片</Text>
        </View>
    );
};


export default class ChatBox extends Component<Props, State> {
    private _scrollTimer;
    private inputText;
    private chatListRefEmitter;
    private chatListRef;
    static defaultProps = {
        options: {
            scene: 'p2p',
            toAccount: '',
        },
        chatListRef: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            msgText: '',
            isTextMsg: true,
            isExtraShown: false,
            isEmojiShown: false,
        };
        this._scrollTimer = null;
        console.log('接受参数', this.props.options);
    }


    componentDidMount() {
        this.chatListRefEmitter = DeviceEventEmitter.addListener('chatListRef', this.onChatListRef);
    }

    onChatListRef = (chatListRef) => {
        this.chatListRef = chatListRef;
    }

    componentWillUnmount() {
        clearTimeout(this._scrollTimer);
        this.chatListRefEmitter && this.chatListRefEmitter.remove();
    }

    showVoice = () => {
        this.setState({
            isTextMsg: false,
            isExtraShown: false,
            isEmojiShown: false,
        });
    }
    hideVoice = () => {
        this.setState({
            isTextMsg: true,

        }, () => {
            this.inputText && this.inputText.focus();
        });
    }
    showEmoji = () => {
        this.setState({
            isEmojiShown: !this.state.isEmojiShown,
            isExtraShown: false,
            isTextMsg: true,
        }, () => {
            if (this.state.isEmojiShown) {
                Keyboard.dismiss();
            } else {
                this.inputText && this.inputText.focus();
            }
        });
        this.scrollToEnd();
    }

    showExtra = () => {
        this.inputText && this.inputText.blur();
        this.setState({
            isExtraShown: !this.state.isExtraShown,
            isEmojiShown: false,
            isTextMsg: true,
        }, () => {
            if (this.state.isExtraShown) {
                Keyboard.dismiss();
            } else {
                this.inputText && this.inputText.focus();
            }
        });
        this.scrollToEnd();
    }

    sendTextMsg = (event) => {
        const {text} = event.nativeEvent;

        console.log('发送消息', text);
        if (text === '') {
            return;
        }
        this.setState({
            msgText: text,
        });
        const options = {
            text,
            scene: this.props.options.scene,
            to: this.props.options.toAccount,
        };

        sendTextMsg(this.props, this.props.nimStore, options);
        // 触发value diff
        InteractionManager.runAfterInteractions(() => {
            // clearTimeout(this._scrollTimer);
            this.setState({
                msgText: '',
            });
            this.scrollToEnd();
            // }, 300);
        });
    }
    sendEmojiMsg = (item) => {
        const options = {
            content: {
                type: 3,
                data: item,
            },
            scene: this.props.options.scene,
            to: this.props.options.toAccount,
        };

        sendCustomMsg(this.props, this.props.nimStore, options);
        this.scrollToEnd();
    }

    sendVoiceMsg = (filePath, duration) => {
        const fileOptions = {
            scene: this.props.options.scene,
            to: this.props.options.toAccount,
            filePath,
            size: 1, // stat.size,
            md5: uuid(),
            dur: Math.round(duration * 1000),
            callback: () => {
                this.scrollToEnd();
            },
        };

        sendAudioMsg(this.props, this.props.nimStore, fileOptions);
    }
    sendImgMsg = () => {
        // this.showExtra();
        const photoOptions = {
            title: '请选择',
            quality: 0.8,
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(photoOptions, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const fileOptions = {
                    scene: this.props.options.scene,
                    to: this.props.options.toAccount,
                    filePath: response.uri,
                    width: response.width,
                    height: response.height,
                    size: 1, // stat.size,
                    md5: uuid(), // MD5(fileData),
                    // pendingUrl: `data:${response.type};base64,${response.data}`,
                    callback: () => {
                        this.scrollToEnd();
                    },
                };

                this.props.sendImgCallback(fileOptions);
                sendImageMsg(this.props, this.props.nimStore, fileOptions);
            }
        });
    }
    sendGeoMsg = () => {
        this.showExtra();
        Toast.message('暂不支持发送地理位置消息');
    }
    sendFileMsg = () => {
        this.showExtra();
        Toast.message('暂不支持发送文件消息');
    }
    scrollToEnd = () => {
        if (this.chatListRef) {
            clearTimeout(this._scrollTimer);
            this._scrollTimer = setTimeout(() => {
                InteractionManager.runAfterInteractions(() => {
                    this.chatListRef&&this.chatListRef.scrollToEnd();
                });
            }, 500);
        }
    }
    renderEmoji = () => {
        let {isEmojiShown, msgText} = this.state;

        if (isEmojiShown) {
            return (<Expression
                onEmojiPress={(uri: { img: number, name: string }) => {
                    if (uri.name.includes('删除')) {
                        let msgTextTmp = this.state.msgText;

                        if (msgTextTmp[msgTextTmp.length - 1] === ']') {
                            this.setState({msgText: msgText.substr(0, msgText.lastIndexOf('['))});

                        } else {
                            this.setState({msgText: msgText.substr(0, msgText.length - 1)});
                        }
                    } else {
                        this.setState({msgText: msgText + uri.name});
                    }
                }}/>);
        }
        return null;
    }
    renderExtra = () => {
        if (this.state.isExtraShown) {
            return (
                <View style={chatStyle.chatItemWraper}>
                    <View style={chatStyle.chatItemRow}>
                        <ChatItem key={1} itemType={ChatItemType.PICTURE} onPress={this.sendImgMsg}/>
                    </View>
                </View>
            );
        }
        return (<View/>);
    }
    renderBox = () => {
        let {msgText, isEmojiShown, isTextMsg,isExtraShown} = this.state;

        return (
            <ImageBackground style={[chatStyle.chatBoxWrapper, pt(isEmojiShown || isExtraShown ? 20 : 0)]}
                             source={require('../img/chatbox_bg.png')}>
                <View style={[chatStyle.chatBox, chatStyle.center]}>
                    <CachedImage source={isTextMsg ? require('../img/ico_message_mic.png') :
                        require('../img/ico_message_keyboard.png')}
                                 style={[w(iconSize), h(iconSize)]}
                                 onPress={() => {
                                     if (isTextMsg) {
                                         this.showVoice();
                                     } else {
                                         this.hideVoice();
                                     }
                                 }}/>
                    {
                        isTextMsg ?
                            <TextInput
                                placeholder={'聊点什么吧!'}
                                style={chatStyle.chatText}
                                blurOnSubmit={false}
                                defaultValue=""
                                value={msgText}
                                underlineColorAndroid="transparent"
                                ref={(ref) => {
                                    this.inputText = ref;
                                }}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        msgText: text,
                                    });
                                }}
                                onFocus={() => {
                                    this.setState({
                                        isExtraShown: false,
                                        isEmojiShown: false,
                                    });
                                    this.scrollToEnd();
                                }}
                            /> :
                            <ChatAudio
                                ifShowRecordTip={this.props.ifShowRecordTip}
                                updateRecordState={this.props.updateRecordState}
                                sendAudio={this.sendVoiceMsg}
                            />

                    }
                    {
                        msgText.length === 0 ?
                            <View style={[styles.udr, styles.uac, styles.ujb]}>
                                <CachedImage
                                    source={isEmojiShown ? require('../img/ico_message_keyboard.png') : require('../img/ico_message_smile.png')}
                                    style={[w(iconSize + 2), h(iconSize + 2)]}
                                    onPress={this.showEmoji}/>
                                <CachedImage source={require('../img/ico_message_add.png')}
                                             style={[w(iconSize), h(iconSize), ml(15)]}
                                             onPress={this.showExtra}/>
                            </View> :
                            <View style={[styles.udr, styles.uac, styles.ujb]}>
                                <CachedImage
                                    source={isEmojiShown ? require('../img/ico_message_keyboard.png') : require('../img/ico_message_smile.png')}
                                    style={[w(iconSize + 2), h(iconSize + 2)]}
                                    onPress={this.showEmoji}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.sendTextMsg({nativeEvent: {text: msgText}})
                                    }}
                                    style={[w(40), h(28), radiusA(3), ml(5), bgColor(commonStyles.colorTheme), styles.uac, styles.ujc]}>
                                    <View style={[styles.uac, styles.udc]}>
                                        <Text style={[color(commonStyles.whiteColor),fSize(14)]}>发送</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                    }
                </View>
                {this.renderExtra()}
                {this.renderEmoji()}
            </ImageBackground>
        );
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={isIphoneX ? 44 : 20}>
                    {this.renderBox()}
                </KeyboardAvoidingView>
            );
        }
        return this.renderBox();
    }
}
