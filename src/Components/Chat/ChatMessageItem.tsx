/**
 * @filename EvaluateAgentItem.tsx@author 倪涛
 * @QQ 231572762
 * @date 2018/10/18
 * @Description: 评价代理Item类型
 */
import React, {PureComponent} from 'react';
import {Text} from 'react-native';
import {chatStyle} from "../../Styles/ChatStyle";
import {ChatLeft, ChatRight} from "./ChatMsg";
import {Navigation} from "../../../types/react-navigation/index";

interface Props {
    itemData: any;
    onItemPress: any;
    itemHeight: number;
    nimStore: any;
    navigation: Navigation;

}

interface State {
    chooseValue: boolean;
}

interface State {
}

export default class ChatMessageItem extends PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            chooseValue: false
        };
    }

    render() {
        let {itemData} = this.props;

        console.log('聊天item渲染数据', itemData);
        if (itemData.type === 'tip') {
            return <Text style={chatStyle.tip}>{itemData.tip}</Text>;
        } else if (itemData.flow === 'in') {
            return (<ChatLeft
                msg={itemData}
                nimStore={this.props.nimStore}
                navigation={this.props.navigation}
            />);
        } else if (itemData.flow === 'out') {
            return (<ChatRight
                msg={itemData}
                {...this.props}
            />);
        } else if (itemData.type === 'timeTag') {
            return <Text style={chatStyle.timetag}>---- {itemData.text} ----</Text>;
        }
        return null;
    }
}
