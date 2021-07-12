import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliry/Auxiliry';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandle';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';



export class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false
    }

     componentDidMount(){
         this.props.onInitIngredient();
    //     axios.get('https://react-my-burger-68284-default-rtdb.firebaseio.com/ingredients.json')
    //         .then(response => {
    //             this.setState({ingredients: response.data});
    //         })
    //         .catch(error =>{
    //             this.setState({error: true});
    //         });
     }

    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
         return sum > 0;
       // this.setState( { purchasable: sum > 0 } );
    }

   // addIngredientHandler = ( type ) => {
   //     const oldCount = this.state.ingredients[type];
   //     const updatedCount = oldCount + 1;
   //     const updatedIngredients = {
   //         ...this.state.ingredients
   //     };
   //     updatedIngredients[type] = updatedCount;
   //     const priceAddition = INGREDIENT_PRICES[type];
   //     const oldPrice = this.state.totalPrice;
   //     const newPrice = oldPrice + priceAddition;
   //     this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
   //     this.updatePurchaseState(updatedIngredients);
   // }

   // removeIngredientHandler = ( type ) => {
   //     const oldCount = this.state.ingredients[type];
   //     if ( oldCount <= 0 ) {
   //         return;
   //     }
   //     const updatedCount = oldCount - 1;
   //     const updatedIngredients = {
   //         ...this.state.ingredients
   //     };
   //     updatedIngredients[type] = updatedCount;
   //     const priceDeduction = INGREDIENT_PRICES[type];
   //     const oldPrice = this.state.totalPrice;
   //     const newPrice = oldPrice - priceDeduction;
   //     this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
   //     this.updatePurchaseState(updatedIngredients);
   // }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true});
        }
        else{
            this.props.onSetAuthRedirect('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
       // const queryParams = [];
       // for (let i in this.state.ingredients){
       //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
       // }
       // queryParams.push('price=' + this.state.totalPrice);
       // const queryString = queryParams.join('&');

       // this.props.history.push({
       //     pathname: '/checkout',
       //     search: '?' + queryString
       // });
       this.props.onInitPurchase();
       this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // {salad: true, meat: false, ...}

        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdd}
                        ingredientRemoved={this.props.onIngredientRemove}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth = {this.props.isAuthenticated}
                        price={this.props.price} />
                </Aux>
            );

            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />;
        };

        //if(this.state.loading){
        //    orderSummary = <Spinner/>;
        //};

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !=null
	}
};

const mapDispatchTOProps = dispatch => {
	return {
		onIngredientAdd: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredient: () => dispatch(actions.initIngredient()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirect: (path) => dispatch(actions.setAuthRedirect(path))
	}
};

export default connect(mapStateToProps,mapDispatchTOProps)(withErrorHandler(BurgerBuilder,axios));
