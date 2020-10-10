import * as actionTypes from './actionTypes';
import axios from "../../axios-orders";

export const addIngredient = (ingredientType) => {
      return {
          type: actionTypes.ADD_INGREDIENT,
          ingredientType: ingredientType
      };
}

export const removeIngredient = (ingredientType) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientType: ingredientType
    }
}

export const initializeBurger = () => {
    return {
        type: actionTypes.INITIALIZE_BURGER
    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const initIngredients = () => {
    return dispatch => {
        axios.get('https://lisa-burger-builder.firebaseio.com/ingredients.json')
        .then(response => {
            console.log(response);
            dispatch(setIngredients(response.data));
         })
         .catch(error => {
             dispatch(fetchIngredientsFailed());
             console.log(error);
         });
    }
}