import axios from 'axios';
import * as actionTypes from './actionTypes';

// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    console.log('hi from action success!');
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAI1rwi1W1KC2zPmRPyRG3zkhmnLCXQOvM';

        if (!isSignup) {
            authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAI1rwi1W1KC2zPmRPyRG3zkhmnLCXQOvM';
        }
        axios.post(authUrl, authData)
           .then(response => {
               console.log('dispatching Success: ' + response.data.idToken, response.data.localId);
               dispatch(authSuccess(response.data.idToken, response.data.localId));
               dispatch(checkAuthTimeout(response.data.expiresIn));
           })
           .catch(err => {
               console.log(err);
               dispatch(authFail(err.response.data.error));
           })
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}