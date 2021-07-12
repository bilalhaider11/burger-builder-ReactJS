import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = ingName => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ingName
    };
};

export const removeIngredient = ingName => {
    return{
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingName
    };
};

export const setIngredient = ingredients => {
    return {
        type: actionTypes.SET_INGREDIENT,
        ingredients: ingredients
    }
}

export const fetchIngredientFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENT_FAILED
    }
}

export const initIngredient = () =>{
    return dispatch => {
            axios.get('https://react-my-burger-68284-default-rtdb.firebaseio.com/ingredients.json')
                .then(response => {
                    dispatch(setIngredient(response.data));
                })
                .catch(error =>{
                    dispatch(fetchIngredientFailed());
                });
    };
};