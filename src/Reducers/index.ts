import { combineReducers } from 'redux';
import {NimManager} from "../Actions/NimManager/NimManager";
import nav from "./StackReducer";

export default combineReducers({
    NimManager,
    nav
});
