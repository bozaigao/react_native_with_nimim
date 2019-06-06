/**
 * @filename ChatAudio.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2018/10/22
 * @Description: 语音聊天
 */
import React from 'react';
import {View, Text, PanResponder, Alert, PermissionsAndroid, InteractionManager, Platform} from 'react-native';
//@ts-ignore
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {chatStyle} from '../../Styles/ChatStyle';

declare let global: any;

const holdRecordText = '按住 说话';
const releaseRecordText = '松开 结束';
const abortRecordText = '滑动取消语音发送';

interface Props {
    sendAudio: any;
    updateRecordState: any;
    ifShowRecordTip: any;
}

interface State {
    audioPath: string;
    currentTime: number;
    recording: boolean;
    stoppedRecording: boolean;
    needSend: boolean;
    hasPermission: boolean | string;
    recordText: string;
}

export default class ChatAudio extends React.Component<Props, State> {
    private _panResponder;
    private _scrollTimer;
    private pageY: number;
    private cheHuiPageY: number;
    //是否可以发送语音
    private canSendAudio: boolean;
    static defaultProps = {
        sendAudio() {
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            needSend: false,
            recordText: holdRecordText,
            currentTime: 0.0,
            recording: false,
            stoppedRecording: false,
            audioPath: `${AudioUtils.DocumentDirectoryPath}/nim_voice.aac`,
            hasPermission: false,
        };
        this.canSendAudio = true;
        this._panResponder = {};
        this.pageY = 0;
        this.cheHuiPageY = 0;
    }

    componentDidMount() {
        const that = this;
        let {updateRecordState, ifShowRecordTip} = this.props;

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (event) => {
                this.pageY = event.nativeEvent.pageY;
                console.log('-------->录音初始位置', this.pageY);
                that.startRecord();
                updateRecordState('recording');
                ifShowRecordTip(true);
                this.canSendAudio = true;
                this.cheHuiPageY = 0;
            },
            onPanResponderMove: (event) => {
                console.log('--------->录音初始位置', this.pageY);
                if (this.pageY - event.nativeEvent.pageY > 100) {
                    if (!this.cheHuiPageY) {
                        this.cheHuiPageY = event.nativeEvent.pageY;
                    }
                    if (this.cheHuiPageY && this.cheHuiPageY - event.nativeEvent.pageY > 50) {
                        this.canSendAudio = false;
                        ifShowRecordTip(false);
                    }
                    updateRecordState('chehui');
                } else {
                    updateRecordState('recording');
                }
                console.log(event.nativeEvent);
            },
            onPanResponderRelease: () => {
                console.log('结束录音');
                that.endRecord();
                ifShowRecordTip(false);
            },
            onPanResponderTerminate: () => {
                that.endRecord();
                ifShowRecordTip(false);
            },
        });


        this.checkRecordingPermission().then((hasPermission) => {
            console.log('checkRecordingPermission');
            this.setState({hasPermission});

            if (!hasPermission) {
                return;
            }

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: data.currentTime});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios' &&
                    this.canSendAudio) {
                    this.finishedRecording(data.status === 'OK', data.audioFileURL);
                }
            };
        });
    }

    componentWillUnmount() {
        clearTimeout(this._scrollTimer);
    }

    startRecord = () => {
        console.log('startRecord');
        if (this.state.recording) {
            console.log('Already recording!');
            return Promise.resolve();
        }

        if (!this.state.hasPermission) {
            console.log('Can\'t record, no permission granted!');
            return Promise.resolve();
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({
            needSend: false,
            recording: true,
            recordText: releaseRecordText,
        });

        return AudioRecorder.startRecording();
    }
    abortRecord = () => {
        if (!this.state.recording) {
            console.log('Can\'t abort, not recording!');
            return Promise.resolve();
        }
        this.setState({
            needSend: false,
            stoppedRecording: true,
            recording: false,
            recordText: abortRecordText,
        });
        return AudioRecorder.stopRecording();
    }
    endRecord = () => {
        const that = this;

        console.log('endRecord');
        if (!this.state.recording) {
            this.setState({
                recordText: holdRecordText,
            });
            return Promise.resolve();
        }
        this.setState({
            needSend: true,
            stoppedRecording: true,
            recording: false,
            recordText: holdRecordText,
        });
        if (Platform.OS === 'android' &&
            this.canSendAudio) {
            return AudioRecorder.stopRecording().then((filePath) => {
                this.finishedRecording(true, filePath);
            });
        }
        AudioRecorder.stopRecording();
        return Promise.resolve();
    }

    checkRecordingPermission() {
        if (Platform.OS === 'ios') {
            return Promise.resolve(true);
        } else if (Platform.OS === 'android') {
            const rationale = {
                title: 'Microphone Permission',
                message: 'AudioExample needs access to your microphone so you can record audio.',
            };

            return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
                .then((result) => {
                    console.log('Permission result:', result);
                    return (result || result === PermissionsAndroid.RESULTS.GRANTED);
                });
        }
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 44100.0,
            Channels: 1,
            AudioQuality: 'Medium', // 'Low' 'High'
            AudioEncoding: 'aac',
            OutputFormat: 'aac_adts',
            AudioEncodingBitRate: 32000,
        });
    }

    finishedRecording(didSucceed, filePath) {
        if (!didSucceed) {
            Alert.alert('语音录制失败');
            return;
        } else if (this.state.currentTime < 2) {
            Alert.alert('不能发送时间小于2秒的语音');
            return;
        } else if (this.state.currentTime > 120) {
            Alert.alert('不能发送时间大于2分钟的语音');
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            if (this.state.needSend && (this.props.sendAudio instanceof Function)) {
                this.props.sendAudio(filePath, this.state.currentTime);
            }
        });
    }

    render() {
        return (
            <View
                style={chatStyle.chatBtn}
                {...this._panResponder.panHandlers}
            >
                <Text style={chatStyle.chatBtnText}>{this.state.recordText}</Text>
            </View>
        );
    }
}
