import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import MessagePage from '../Page/MainPage/MessagePage/index';
//@ts-ignore
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers';
import Chat from "../Page/MainPage/MessagePage/Chat";

const middleware = createReactNavigationReduxMiddleware('root', state => state.nav);

const RootNavigator = createStackNavigator(
    {
        MessagePage: { screen: MessagePage },
        Chat: { screen: Chat },
    },
    {
        initialRouteName: 'MessagePage', // 默认显示界面，
        mode: 'card', // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'none' // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    }
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
const mapStateToProps = state => ({
    state: state.nav
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator, middleware };
