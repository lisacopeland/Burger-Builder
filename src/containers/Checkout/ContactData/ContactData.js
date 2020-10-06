import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from "../../../axios-orders";
import Input from '../../../components/UI/Input/Input';
import classes from "./ContactData.css";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: false,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street Address",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      city: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "City",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      state: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "State",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zip: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Zip",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 10,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            {
              value: "fastest",
              displayValue: "Fastest",
            },
            {
              value: "cheapest",
              displayValue: "Cheapest",
            },
          ],
        },
        validation: {},
        value: "fastest",
        valid: true,
        touched: false
      },
    },
    price: 0,
    loading: false,
    formIsValid: false
  };

  orderHandler = (event) => {
    event.preventDefault();
    console.log(this.props.ingredients);
    this.setState({ loading: true });
    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData,
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  };

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

  inputChangedHandler = (event, inputIdentifier) => {
    console.log(event.target.value);
    const updatedOrderForm = {
      ...this.state.orderForm,
    };
    const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    console.log(updatedFormElement);
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputId in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputId].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formsElementArray = [];
    for (let key in this.state.orderForm) {
      formsElementArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formsElementArray.map((formElement) => (
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
            }}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;