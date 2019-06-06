import React, {Component} from 'react';
import {AppNavigator} from './Scence/index';
import {NativeModules} from "react-native";
import {connect} from "react-redux";
//@ts-ignore
import {NavigationActions} from "react-navigation";

interface Props {
    dispatch: any;
    nav: any;
    updateNimStore: any;
    updateAgentInfo: any;
}

interface State {
    appState: any;
    appResume: boolean;
}

class ReduxNavigation extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            appResume: false,
            appState: ''
        }
    }


    render() {

        return (<AppNavigator/>);

    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});


const mapDispatchToProps = dispatch => {
    return Object.assign({
        dispatch
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxNavigation);

