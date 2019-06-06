/**
 * @filename Tag.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/8/1
 * @Description: 评价标签
 */
import React, {PureComponent} from 'react';
import {Text, View, Alert, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import {color, commonStyles, fSize, lh, ls} from '../../Styles/Style';
import expressionEmoji from "./EmogiDecodeArr";
import {mapMsgType} from "../../Utils/DataTool/DataTool";
//@ts-ignore
import Sound from "react-native-sound";
import res from "./res/index";
import {chatStyle, RFT, RVW} from "../../Styles/ChatStyle";
import {CachedImage} from "react-native-cached-fast-image";
import LottieView from 'lottie-react-native';

declare let global: any;

interface Props {
    msg: any;
    onImgPress: any;
}

interface State {
    loop: boolean;
}

export default class ChatContent extends PureComponent<Props, State> {
    private lottieViewRef;

    constructor(props) {
        super(props);
        this.state = {
            loop: true,
        };
    }

    render() {
        let {msg = {}, onImgPress} = this.props;
        let {loop} = this.state;

        if (msg.type === 'text') {
            let showText = msg.text;
            const showTextArray = [];

            if (/\[[^\]]+\]/.test(showText)) {
                const emojiItems = showText.match(/\[[^\]]+\]/g);

                emojiItems.forEach((item) => {
                    const wordIndex = showText.indexOf(item);

                    if (wordIndex > 0) {
                        showTextArray.push(showText.substr(0, wordIndex));
                        showText = showText.substr(wordIndex);
                    }
                    showTextArray.push(item);
                    showText = showText.substr(item.length);
                });
            }
            if (showText.length > 0) {
                showTextArray.push(showText);
            }
            return (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
                >{
                    showTextArray.map((item, index) => {
                        const id = `${item}${index}`;

                        if (expressionEmoji[item]) {
                            return (<ImageBackground
                                key={id}
                                source={expressionEmoji[item]}
                                style={{
                                    width: 5 * RFT, height: 5 * RFT,
                                }}
                            />);
                        }
                        return <Text key={id}
                                     style={[chatStyle.text, color(msg.flow === 'in' ? commonStyles.chatTextColor : commonStyles.whiteColor), fSize(14),
                                         lh(commonStyles.lineHeight), ls(commonStyles.letterSpacing)]}>{item}</Text>;
                    })
                }
                </View>
            );
        } else if (msg.type === 'image') {
            let viewUrl;

            //图片预加载
            if (msg.preLoad) {
                viewUrl = {uri: Platform.OS === 'ios' ? msg.filePath : `file://${msg.filePath}`};
                const width = 50 * RVW;
                const height = msg.height > 0 ? ((width / msg.width) * msg.height) : 50 * RVW;

                return (<CachedImage
                    source={viewUrl}
                    style={{width, height}} onPress={() => {
                    onImgPress(viewUrl.uri);
                }}/>);
            }
                const {file} = msg;
                const width = 50 * RVW;
                const height = file.h > 0 ? ((width / file.w) * file.h) : 50 * RVW;

                viewUrl = res.loadingImg;

                if (file.pendingUrl) {
                    viewUrl = {uri: file.pendingUrl};
                } else if (file.url) {
                    viewUrl = {uri: file.url};
                    // console.log(viewUrl);
                    viewUrl = {
                        uri: global.nim.viewImageSync({
                            url: file.url, // 必填
                            quality: 75, // 图片质量 0 - 100 可选填
                            thumbnail: { // 生成缩略图， 可选填
                                width: Math.min(file.w, 20 * RVW),
                                mode: 'cover',
                            },
                        }),
                    };
                }
                return (<CachedImage
                    source={viewUrl}
                    style={{width, height}} onPress={() => {
                    onImgPress(viewUrl.uri);
                }}/>);

        } else if (msg.type === 'audio') {
            let duration = 1;

            if (msg.file && msg.file.dur) {
                duration = Math.floor(msg.file.dur / 1000);
            }
            const soundUrl = msg.file.url; // msg.file.ext === 'mp3' ? msg.file.url : msg.file.mp3Url;

            return (
                <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                        if (global.sound) {
                            console.log('播放停止');
                            global.sound.stop(() => {
                                this.setState({loop: false});
                                global.sound.release();
                                global.sound = null;
                            });
                        } else {
                            global.sound = new Sound(soundUrl, null, (error) => {
                                if (error) {
                                    Alert.alert('网络不通');
                                    global.sound.release();
                                    global.sound = null;
                                    return;
                                }
                                this.lottieViewRef && this.lottieViewRef.play();
                                global.sound.play((success) => {
                                    if (!success) {
                                        Alert.alert('文件已损坏');
                                        return;
                                    }
                                    console.log('播放停止');
                                    this.setState({loop: false});
                                    global.sound.release();
                                    global.sound = null;
                                });
                            });
                        }
                    }}
                >
                    <LottieView
                        ref={animation => {
                            this.lottieViewRef = animation;
                        }}
                        resizeMode={'cover'}
                        loop={loop}
                        source={msg.flow === 'in' ? require('./res/other_voice.json') : require('./res/my_voice.json')}
                        style={[{width: 3.5 * RFT}, {height: 3.5 * RFT}]}
                    />
                    <Text
                        style={[color(msg.flow === 'in' ? commonStyles.textBlackColor : commonStyles.whiteColor)]}>{`  ${duration}"`}</Text>
                </TouchableOpacity>
            );
        }
        const showMsg = mapMsgType(msg);

        return (<Text style={chatStyle.text}>[{showMsg}]</Text>
        );
    }
}
