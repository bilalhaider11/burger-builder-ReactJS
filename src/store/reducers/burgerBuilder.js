import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const initialState = {
	ingredients: null,
    totalPrice: 3,
	error: false,
	building: false
};

const INGREDIENT_PRICES = {
    salad: 0.4,
    cheese: 0.3,
    meat: 1.7,
    bacon: 0.9
};

const addIngredient= (state,action) =>{
	const updateIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1};
	const updateIngredients = updateObject(state.ingredients,updateIngredient);
	const updatedState = {
		ingredients: updateIngredients,
		totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
		building: true
	};
	return updateObject(state,updatedState);
};

const removeIngredient = (state,action) =>{
	const updateIng = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1};
	const updateIngs = updateObject(state.ingredients,updateIng);
	const updatedSt = {
		ingredients: updateIngs,
		totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
		building: true
	};
	return updateObject(state,updatedSt);
};

const setIngredient = (state,action) =>{
	return updateObject(state,{
		ingredients: {
			salad: action.ingredients.salad,
			bacon: action.ingredients.bacon,
			cheese: action.ingredients.cheese,
			meat: action.ingredients.meat
		},
		totalPrice: 3,
		error: false,
		building: false
	});
};

const fetchIngredientFailed = (state,action) => {
	return updateObject(state,{error: true});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENT: return addIngredient(state,action);
		case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state,action);
		case actionTypes.SET_INGREDIENT: return setIngredient(state,action);
		case actionTypes.FETCH_INGREDIENT_FAILED: return fetchIngredientFailed(state,action);
		default: return state;
	};
};

export default reducer;

