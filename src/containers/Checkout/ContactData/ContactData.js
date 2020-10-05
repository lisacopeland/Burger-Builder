import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from "../../../axios-orders";

import classes from "./ContactData.css";

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        price: 0,
        loading: false
    }

    orderHandler = (event) => {
      event.preventDefault();
      console.log(this.props.ingredients);
      this.setState({ loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Lisa Copeland',
                address: {
                    street: '8617 236th Ave NE',
                    city: 'Redmond',
                    state: 'WA',
                    zip: '98053'
                },
                email: 'maggy@live.com'
            },
            deliveryMethod: 'FedEx'
        }
        axios.post('/orders.json', order)
            .then(response => {
               console.log(response);
               this.setState({
                   loading: false
               });
               this.props.history.push('/');
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false
                });
            });
     
    }

    render () {
        let form = (
          <form>
            <input
              className={classes.Input}
              type="text"
              name="name"
              placeholder="Your Name"
            />
            <input
              className={classes.Input}
              type="text"
              name="email"
              placeholder="Your Email"
            />
            <input
              className={classes.Input}
              type="text"
              name="street"
              placeholder="Your Street"
            />
            <input
              className={classes.Input}
              type="text"
              name="postalCode"
              placeholder="Your Zip code"
            />
            <Button btnType="Success" clicked={this.orderHandler}>
              Order
            </Button>
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