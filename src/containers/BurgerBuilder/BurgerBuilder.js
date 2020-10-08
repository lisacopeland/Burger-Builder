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

/* const Ingredient_Prices = {
    salad: .50,
    bacon: .85,
    cheese: 1.25,
    meat: 2.50
}
 */
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
   
/*     updatePurchaseState (ingredients) {
        // Take a copy of ingredients object, turn it into an array mapping each element and 
        // using reduce to find the sum of all ingredient quantities

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0});            
    } */

/*     addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
        // Create a constant with the ingredients from state and update it with the new 
        // count 
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = Ingredient_Prices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( 
            { ingredients: updatedIngredients, 
              totalPrice : newPrice } );
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) { 
            return;
        }
        const updatedCount = oldCount -1;
        // Create a constant with the ingredients from state and update it with the new 
        // count 
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = Ingredient_Prices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( 
            { ingredients: updatedIngredients, 
              totalPrice : newPrice } ); 
        this.updatePurchaseState(updatedIngredients);            
    } */

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        console.log('Continuing!');

        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
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

