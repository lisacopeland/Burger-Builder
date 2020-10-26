import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  price: 4,
  error: false,
  purchaseable: false,
  building: false
};

const Ingredient_Prices = {
  salad: 0.5,
  bacon: 0.85,
  cheese: 1.25,
  meat: 2.5,
};

const addIngredient = (state, action) => {
      const newIngredients = updateObject(state.ingredients, { [action.ingredientType]: state.ingredients[action.ingredientType] + 1});
      return updateObject(state, 
        {
         ingredients: newIngredients,
         price: state.price + Ingredient_Prices[action.ingredientType],
         purchaseable: updatePurchaseState(state.ingredients),
         building: true
        });
}

const removeIngredient = (state, action) => {
      const newIngredients = updateObject(state.ingredients, { [action.ingredientType]: state.ingredients[action.ingredientType] - 1});
      return updateObject(state, 
        {
         ingredients: newIngredients,
         price: state.price - Ingredient_Prices[action.ingredientType],
         purchaseable: updatePurchaseState(state.ingredients),
         building: true
        });
}

const setIngredients = (state, action) => {
      return updateObject(state, {
          ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
          },
          price: 4,
          error: false,
          building: false,
          purchaseable: updatePurchaseState(state.ingredients)});
}

const initBurger = (state, action) => {
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
}

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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: 
      return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, { error: true });
    case actionTypes.INITIALIZE_BURGER:
      return initBurger(state, action);
    default: return state;
  }
};

export default reducer;