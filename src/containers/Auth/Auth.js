import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from "./Auth.css";
// import axios from "axios";
// import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: "input",
                elementConfig: {
                type: "email",
                placeholder: "Email Address",
                },
                value: "",
                validation: {
                    required: true,
                    // isEmail: true
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: "input",
                elementConfig: {
                type: "password",
                placeholder: "Password",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 7
                },
                valid: false,
                touched: false,
            },                
        },
        isSignup: true
    }

  componentDidMount() {
    if (!this.props.building && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.trim().length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }
    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls, 
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    }
    this.setState({ controls: updatedControls });

  }

  authHandler = (event) => {
    console.log('hi from authHandler, submitting request');
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  };  

  switchAuthModeHandler = () => {
    console.log('hi from switchMode');
    console.log('switchAuthMode:isSignup: ', this.state.isSignup);
    this.setState(prevState => {
        return { isSignup: !prevState.isSignup }
    });
  }

  render() {
    const formsElementArray = [];
    for (let key in this.state.controls) {
        formsElementArray.push({
            id: key,
            config: this.state.controls[key],
        });

    }        
    console.log('Render: isSignup: ', this.state.isSignup);

    let form = formsElementArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => {
              this.inputChangedHandler(event, formElement.id);
            }} />

    ));

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
      <p>{this.props.error.message}</p>
      );
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
        authRedirect = <Redirect to={this.props.authRedirectPath} />
    }

        return (
            <div className={classes.Auth}>
              {authRedirect}
              <div>{this.state.isSignup ? 'Signing Up' : 'Signing In'}</div>
                <form onSubmit={this.authHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                    <Button 
                      clicked={this.switchAuthModeHandler}
                      btnType="Danger"
                      >Switch to {this.state.isSignup ? 'Sign in' : 'Sign up'}</Button>
                </form>
                {errorMessage}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    building: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignup) => 
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: (path) => 
      dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);