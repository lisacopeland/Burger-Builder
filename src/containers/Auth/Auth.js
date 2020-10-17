import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from "./Auth.css";
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
      console.log('checking minlength of ' + rules.minLength);
      isValid = value.trim().length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.trim().length <= rules.maxLength && isValid;
    }
    console.log('check validity returning ' + isValid);
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
    event.preventDefault();

    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value;
    }

  };  

  render() {
    const formsElementArray = [];
    for (let key in this.state.controls) {
        formsElementArray.push({
            id: key,
            config: this.state.controls[key],
        });

    }        
    console.log('formElements: ', formsElementArray);

    const form = formsElementArray.map(formElement => (
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

    ))
        return (
            <div className={classes.Auth}>
                <form onSubmit={this.authHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
            </div>
        );
    }
}

export default Auth;