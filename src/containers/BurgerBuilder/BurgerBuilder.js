import React, { Component } from 'react';
 
import Aux from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const Ingredient_Prices = {
    salad: 0.5,
    bacon: 1.7,
    cheese: 0.85,
    meat: 2
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...props};
    // }

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4
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
    }

    removeIngredientHandler = (type) => {
        
    }

    render () {
        return (
            <Aux> 
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}/>
            </Aux>
        );
    }

}

export default BurgerBuilder;

