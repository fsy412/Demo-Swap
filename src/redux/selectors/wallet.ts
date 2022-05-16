import { createSelector } from 'reselect';

export const selectWalletState = state => state.wallet;

export const selectPublicKeyHash = createSelector(
    selectWalletState,
    walletState => walletState.key
);

export const selectBalance = createSelector(selectWalletState, walletState => walletState.balance);
