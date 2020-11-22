import React, { Component } from 'react';
import * as actionCreators from '../../store/actions/index';
import axios from "../../axios-orders";

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from "react-redux";

export class BurgerBuilder extends Component {

    state = {
        purchasing: false,

    }

    componentDidMount() {
        this.props.onInitIngredients();
    }
   
    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {

        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;  
        let burger = this.props.error ? <p>Ingredients cant be loaded</p> : <Spinner />;

        if (this.props.ingredients) {
            burger = (
            <Aux>
                <Burger ingredients={this.props.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.props.onAddIngredient}
                    ingredientRemoved={this.props.onRemoveIngredient}
                    disabled={disabledInfo}
                    purchaseable={this.props.purchaseable}
                    ordered={this.purchaseHandler}
                    isAuth={this.props.isAuthenticated}
                    price={this.props.price} />
            </Aux>
            );
            orderSummary = <OrderSummary 
              price={this.props.price}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler}
              ingredients={this.props.ingredients}/>
        }

        // if (this.state.loading) {
        //     orderSummary = <Spinner />;

        // }
        return (
            <Aux> 
                <Modal 
                    show={this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }

}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.price,
    purchaseable: state.burgerBuilder.purchaseable,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredient: (ingredientType) =>
        dispatch(actionCreators.addIngredient(ingredientType)),
    onRemoveIngredient: (ingredientType) => 
        dispatch(actionCreators.removeIngredient(ingredientType)),
    onInitIngredients: () => 
        dispatch(actionCreators.initIngredients()),
    onInitPurchase: () => 
        dispatch(actionCreators.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

