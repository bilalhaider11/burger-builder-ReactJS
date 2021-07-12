import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

import classes from './Auth.module.css';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig:{
                    type:'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation:{
                    required: true,
                    isEmail: true
                },
                valid:false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig:{
                    type:'password',
                    placeholder: 'Password'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 6
                },
                valid:false,
                touched: false
            }
        },
        isSignUp: true
    };

    componentDidMount(){
        if(this.props.burgerBuilder && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirect();
        }
    }

    submitHandler = event =>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value,this.state.controls.password.value,this.state.isSignUp);
    }

    // checkValidity (value ,rules){
    //     let isValid = true;
        
    //     if(!rules){
    //         return true;
    //     }

    //     if(rules.required){
    //         isValid = value.trim() !== '' && isValid;
    //     }

    //     if(rules.minLength){
    //         isValid = value.length >= rules.minLength && isValid;
    //     }

    //     if(rules.maxLength){
    //         isValid = value.length <= rules.maxLength && isValid;
    //     }

    //     if (rules.isEmail) {
    //         const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    //         isValid = pattern.test(value) && isValid
    //     }

    //     if (rules.isNumeric) {
    //         const pattern = /^\d+$/;
    //         isValid = pattern.test(value) && isValid
    //     }

    //     return isValid;
    // };

    inputChangedHandler = (event,controlName) => {
        const updatedControls = updateObject(this.state.controls,{
            [controlName]: updateObject(this.state.controls[controlName],{
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });
        // const updatedControls = {
        //     ...this.state.controls,
        //     [controlName]: {
        //         ...this.state.controls[controlName],
        //         value: event.target.value,
        //         valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        //         touched: true
        //     }
        // }
        this.setState({controls: updatedControls});
    };

    switchAuthModeHandler = () =>{
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        });
    };
    
    render(){
        const formElementsArray = [];
        for (let key in this.state.controls){
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        };

        let form  = formElementsArray.map(formElement => (
                <Input 
                    key = {formElement.id}
                    elementType = {formElement.config.elementType}
                    elementConfig = {formElement.config.elementConfig}
                    value = {formElement.config.value} 
                    shouldValidate = {formElement.config.validation}
                    invalid = {!formElement.config.valid}
                    touched = {formElement.config.touched}
                    valueType={formElement.id}
                    changed = {(event) => this.inputChangedHandler(event,formElement.id)}/>
            )
        );
        if(this.props.loading){
            form = <Spinner />
        };

        let errorMessage = null;

        if(this.props.error){
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return(            
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>     
                <Button
                    clicked={this.switchAuthModeHandler} 
                    btnType="Danger">SWITCH TO {this.state.isSignUp ? 'SIGNIN': 'SIGNUP'}</Button>           
            </div>
            
        );
    };
};

const mapStateTOProps = state =>{
    return{
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !==null,
        burgerBuilding: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        onAuth: (email,password, isSignUp) => dispatch(actions.auth(email,password,isSignUp)),
        onSetAuthRedirect: () => dispatch(actions.setAuthRedirect('/'))
    };  
};

export default connect(mapStateTOProps,mapDispatchToProps)(Auth);