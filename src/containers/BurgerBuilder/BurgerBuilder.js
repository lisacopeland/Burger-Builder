import React, { Component } from 'react';

import axios from '../../axios-orders';

import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';


const Ingredient_Prices = {
    salad: .50,
    bacon: .85,
    cheese: 1.25,
    meat: 2.50
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...props};
    // }

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://lisa-burger-builder.firebaseio.com/ingredients.json')
        .then(response => {
            console.log(response);
            this.setState({
                ingredients: response.data
            });
         })
         .catch(error => {
             this.setState({error: true});
             console.log(error);
         });
    }
   
    updatePurchaseState (ingredients) {
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
    }

    addIngredientHandler = (type) => {
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
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        console.log('Continuing!');
        this.setState({ loading: true});
        const order = {
            ingrediedents: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Lisa Copeland',
                address: {
                    street: '8617 236th Ave NE',
                    city: 'Redmond',
                    state: 'WA',
                    zip: '98053'
                },
                email: 'maggy@live.com'
            },
            deliveryMethod: 'FedEx'
        }
        axios.post('/orders.json', order)
            .then(response => {
               console.log(response);
               this.setState({
                   loading: false,
                   purchasing: false
               });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    purchasing: false
                });
            });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;  
        let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
            </Aux>
            );
            orderSummary = <OrderSummary 
              price={this.state.totalPrice}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler}
              ingredients={this.state.ingredients}/>
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

export default withErrorHandler(BurgerBuilder, axios);

