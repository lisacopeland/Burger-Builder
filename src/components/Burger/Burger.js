import React from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    console.log(props);
    // Object.keys returns an array of the keys (in this case the ingredients passed down 
    // in props) .map performs an operation on each element, named igKey. we then turn each 
    // of those elements into an array with the number of elements of each ingredient, 
    // i.e. if props.ingredient is cheese: 2 return an array with two elements and then
    // map it and return a BurgerIngredient with a key consisting of the ingredient plus 
    // the index, then we use reduce to find out how many ingredients we have

    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }        
    console.log(transformedIngredients);
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default withRouter(burger);