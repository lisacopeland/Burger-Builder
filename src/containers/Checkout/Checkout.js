import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
//import * as actions from '../../store/actions/index';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
class Checkout extends Component {

  // componentWillMount() {
  //   this.props.onInitPurchase();
  // }

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

// This is not needed but I am going to leave it in
// const mapDispatchToProps = (dispatch) => {
//   return {
//     onInitPurchase: () => {
//       dispatch(actions.purchaseBurgerInit());
//     }
//   };
// };

export default connect(mapStateToProps)(Checkout);