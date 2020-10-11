import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false,
    error: false
}

const purchaseInit = (state, action) => {
      return updateObject(state, { purchased: false });  
}

const purchaseSuccess = (state, action) => {
  const newOrder = {
      ...action.orderData,
      purchased: true,
      id: action.id
    }
    return updateObject(state, { 
      loading: false, 
      order: state.orders.concat(newOrder),
      error: false });
}

const fetchOrdersSuccess = (state, action) => {
    return updateObject(state, {
      loading: false, 
      error: false,
      orders: action.orders
    })
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state, action);
    case actionTypes.PURCHASE_BURGER_START:
      return updateObject(state, { loading: true });
    case actionTypes.PURCHASE_BURGER_FAIL:
      return updateObject(state, { loading: false, error: true });
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchaseSuccess(state, action);
    case actionTypes.FETCH_ORDERS_START:
      return updateObject(state, { loading: true });      
    case actionTypes.FETCH_ORDERS_FAIL:
      return updateObject(state, { loading: false, error: true });
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);
    default: 
        return state;  
    }
}

export default reducer;