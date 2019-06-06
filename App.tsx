/**
 * @filename App.tsx
 * @author 何晏波
 * @QQ 1054539528
 * @date 2019/1/30
 * @Description: 项目入口文件
*/

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from 'redux';
import rootReducers from './src/Reducers/index';
import {middleware} from './src/Scence/index';
import ReduxNavigation from './src/index';

const store = createStore(rootReducers, applyMiddleware(thunk, middleware));


type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <Provider store={store}>
                <ReduxNavigation />
            </Provider>
        );
    }
}

export enum ChatItemType {
    PICTURE,
}

/**
 * 网易云心用户资料Model
 */

export interface NimUserInfo {
    nick?: string; //用户昵称
    avatar?: string; //头像地址
    sign?: string; //签名
    gender?: string; //性别
    email?: string; //邮箱
    birth?: string; //生日
    tel?: string; //电话
    custom?: string; //自定义用户属性
    done?: any; //更新成功后的回调
}
