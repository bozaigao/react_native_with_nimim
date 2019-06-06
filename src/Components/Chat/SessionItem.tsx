import React, {Component} from 'react';
import {Alert, Animated} from "react-native";
import {RVW} from "../../Styles/ChatStyle";
import config from './Config';
import MessageItem from "../../Page/MainPage/MessagePage/PageComponent/MessageItem";

interface Props {
    onItemPress: any;
    session: any;
    sendMsgReceipt: any;
    deleteLocalSession: any;
    nimStore:any;
}

interface State {
    isDeleteBarShown: boolean;
    positionLeft: any;
}

export default class SessionItem extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            isDeleteBarShown: false,
            positionLeft: new Animated.Value(0),
        };
    }

    deleteSession = () => {
        Alert.alert('提示', '确认删除会话？', [
            {
                text: '取消', onPress: () => {
                    this.setState({isDeleteBarShown: false});
                }
            },
            {
                text: '确认删除', onPress: () => {
                    this.props.deleteLocalSession(this.props.session.id);
                }
            },
        ]);
        Animated.timing(
            this.state.positionLeft,
            {
                toValue: 0,
                duration: 0,
            },
        ).start();
    }
    showDeleteBar = () => {
        if (this.state.isDeleteBarShown) {
            return;
        }
        Animated.timing(
            this.state.positionLeft,
            {
                toValue: -20 * RVW,
                duration: 100,
            },
        ).start();
        this.setState({
            isDeleteBarShown: true,
        });
    }
    hideDeleteBar = () => {
        if (!this.state.isDeleteBarShown) {
            return;
        }
        Animated.timing(
            this.state.positionLeft,
            {
                toValue: 0,
                duration: 100,
            },
        ).start();
        this.setState({
            isDeleteBarShown: false,
        });
    }

    render() {
        const item = this.props.session;
        let {onItemPress} = this.props;

        if (!item.avatar) {
            item.avatar = config.defaultUserIcon;
        }

        return (<MessageItem itemData={item} itemHeight={83} onItemPress={(session,nick) => {
            onItemPress(session,nick);
        }} nimStore={this.props.nimStore}/>);
    }
}

