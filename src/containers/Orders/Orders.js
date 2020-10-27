import React, { Component } from "react";
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from '../../components/Order/Order';
import * as actionCreators from '../../store/actions/index';
import { connect } from "react-redux";
import Spinner from '../../components/UI/Spinner/Spinner';
class Orders extends Component {

    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    render () {
        let orders = <Spinner />;
        if (!this.props.loading) {
            orders = (
                this.props.orders.map(order => (
                    <Order 
                    key={order.id}
                    ingredients={order.ingredients} 
                    price={order.price}
                    />
                ))
            );
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    orders: state.orders.orders,
    loading: state.orders.loading,
    error: state.orders.error,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: (token, userId) => 
        dispatch(actionCreators.fetchOrders(token, userId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));