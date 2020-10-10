import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  price: 4,
  error: false,
  purchaseable: false
};

const Ingredient_Prices = {
  salad: 0.5,
  bacon: 0.85,
  cheese: 1.25,
  meat: 2.5,
};

const reducer = (state = initialState, action) => {
  let newIngredients;
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      newIngredients = {
          ...state.ingredients,
          [action.ingredientType]: state.ingredients[action.ingredientType] + 1
        };
      return updateObject(state, 
        {ingredients: newIngredients,
         price: state.price + Ingredient_Prices[action.ingredientType],
         purchaseable: updatePurchaseState(state.ingredients)});
    case actionTypes.REMOVE_INGREDIENT:
      newIngredients = {
          ...state.ingredients,
          [action.ingredientType]: state.ingredients[action.ingredientType] - 1
        };
      return updateObject(state, {
         ingredients: newIngredients,
         price: state.price - Ingredient_Prices[action.ingredientType],
         purchaseable: updatePurchaseState(state.ingredients)});
    case actionTypes.SET_INGREDIENTS: 
      return updateObject(state, {
          ...state,
          ingredients: action.ingredients,
          price: 4,
          error: false,
          purchaseable: updatePurchaseState(state.ingredients)});
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, {
        error: true
      });
    case actionTypes.INITIALIZE_BURGER:
      return updateObject(state, {
        ingredients: {
          salad: 0,
          bacon: 0,
          cheese: 0,
          meat: 0
        },
        price: 4,
        purchaseable: false            
      });
    default: return state;
  }
};

const updatePurchaseState = (ingredients) => {
        // Take a copy of ingredients object, turn it into an array mapping each element and 
        // using reduce to find the sum of all ingredient quantities

        if (ingredients) {
          const sum = Object.keys(ingredients)
              .map(igKey => {
                  return ingredients[igKey];
              })
              .reduce((sum, el) => {
                  return sum + el;
              }, 0);
          return (sum > 0) ? true : false;            
        } else {
          return false;
        }
    }

export default reducer;