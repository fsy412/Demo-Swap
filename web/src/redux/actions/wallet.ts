import * as constants from "../constant"

export interface IAction<T> {
    type: string;
    payload: T;
}

export const updateBalance = () => async (dispatch, getState) => {
    const store = getState();
    dispatch({
        type: constants.SET_BALANCE,
        payload: 0,
    });
};

export const initialize : () => IAction<null> = () => ({
    type: constants.SET_BALANCE,
    payload: null,
});

export const logout: () => IAction<null> = () => ({
    type: constants.SET_BALANCE,
    payload: null,
});
