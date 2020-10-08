import React, { Component } from 'react';

import axios from "../../axios-orders";

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";

class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        console.log(this.props);
        // axios.get('https://lisa-burger-builder.firebaseio.com/ingredients.json')
        // .then(response => {
        //     console.log(response);
        //     this.setState({
        //         ingredients: response.data
        //     });
        //  })
        //  .catch(error => {
        //      this.setState({error: true});
        //      console.log(error);
        //  });
    }
   
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // console.log('Continuing!');

        // const queryParams = [];
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            //search: '?' + queryString
        });
    }

    render () {
        const disabledInfo = {
            ...this.props.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;  
        let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />;

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
                    price={this.props.price} />
            </Aux>
            );
            orderSummary = <OrderSummary 
              price={this.props.price}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler}
              ingredients={this.props.ingredients}/>
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;

        }
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
    ingredients: state.ingredients,
    price: state.price,
    purchaseable: state.purchaseable
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddIngredient: (ingredientType) =>
        dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientType: ingredientType }),
    onRemoveIngredient: (ingredientType) => 
        dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientType: ingredientType }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

