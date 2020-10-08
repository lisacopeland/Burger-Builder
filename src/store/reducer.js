import * as actionTypes from "./actions";

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0
  },
  price: 4,
  purchaseable: false
};

const Ingredient_Prices = {
  salad: 0.5,
  bacon: 0.85,
  cheese: 1.25,
  meat: 2.5,
};

let oldPrice = 0;
let newPrice = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
        const priceAddition = Ingredient_Prices[action.ingredientType];
        oldPrice = state.price;
        newPrice = oldPrice + priceAddition;
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientType]: state.ingredients[action.ingredientType] + 1
        }, 
        price: newPrice,
        purchaseable: updatePurchaseState(state.ingredients)
      };
    case actionTypes.REMOVE_INGREDIENT:
        // Create a constant with the ingredients from state and update it with the new
        // count
        const priceDeduction = Ingredient_Prices[action.ingredientType];
        oldPrice = state.price;
        newPrice = oldPrice - priceDeduction;
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientType]: state.ingredients[action.ingredientType] - 1
        }, 
        price: newPrice,
        purchaseable: updatePurchaseState(state.ingredients)
      };
    default: return state;
  }
};

const updatePurchaseState = (ingredients) => {
        // Take a copy of ingredients object, turn it into an array mapping each element and 
        // using reduce to find the sum of all ingredient quantities

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return (sum > 0) ? true : false;            
    }

export default reducer;