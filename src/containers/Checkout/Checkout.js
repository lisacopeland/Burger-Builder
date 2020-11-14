import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import * as actionCreators from '../../store/actions/index';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
class Checkout extends Component {

  componentWillMount() {
    this.props.onInitPurchase();
  }

  checkoutCancelledHandler = () => {
      this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
      this.props.history.replace('/checkout/contact-data');
  };

  render() {
    let summary = <Redirect to="/" />
    if (this.props.ingredients) {
      const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ingredients}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route 
            path={this.props.match.path + '/contact-data'} 
            component={ContactData}/>
        </div>
      );
    }
    return summary
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    purchased: state.orders.purchased,
    price: state.burgerBuilder.price // I am not using this
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitPurchase: () => 
        dispatch(actionCreators.purchaseInit()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);