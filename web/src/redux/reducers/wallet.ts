import * as constants from "../constant"

const defaultState = {
    account: "",
    balance: 0,
}

const INITIAL_STATE = defaultState

export default function reducerWallet(state = INITIAL_STATE, action) {
    console.log('*** wallet reducer action', action)
    switch (action.type) {
        case constants.SET_BALANCE:
            return { ...action.payload }
        default:
            return state
    }
}