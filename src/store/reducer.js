import * as actionTypes from "./actions";

const initialState = {
  ingredients: [],
  price: 4,
  purchaseable: false
};

const Ingredient_Prices = {
  salad: 0.5,
  bacon: 0.85,
  cheese: 1.25,
  meat: 2.5,
};

let oldCount = 0;
let updatedCount = 0;
let updatedIngredients = [];
let oldPrice = 0;
let newPrice = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
        oldCount = state.ingredients[action.ingredientType];
        updatedCount = oldCount + 1;
        updatedIngredients = {
            ...state.ingredients
        }
        updatedIngredients[action.ingredientType] = updatedCount;
        const priceAddition = Ingredient_Prices[action.ingredientType];
        oldPrice = state.price;
        newPrice = oldPrice + priceAddition;
      return {
        ...state,
        ingredients: updatedIngredients,
        price: newPrice,
        purchaseable: updatePurchaseState(updatedIngredients)
      };
    case actionTypes.REMOVE_INGREDIENT:
        oldCount = state.ingredients[action.ingredientType];
        if (oldCount <= 0) {
          return state;
        }
        updatedCount = oldCount - 1;
        // Create a constant with the ingredients from state and update it with the new
        // count
        updatedIngredients = {
          ...state.ingredients,
        };
        updatedIngredients[action.ingredientType] = updatedCount;
        const priceDeduction = Ingredient_Prices[action.ingredientType];
        oldPrice = this.state.totalPrice;
        newPrice = oldPrice - priceDeduction;
      return {
        ...state,
        ingredients: updatedIngredients,
        price: newPrice,
        purchaseable: updatePurchaseState(updatedIngredients)
      };
    default: console.log("Got default");
  }
  return state;
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
        this.setState({purchaseable: sum > 0});            
    }

export default reducer;