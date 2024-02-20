import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import configs from '../../configs';

import {connect} from 'react-redux';
import {fetchAndStoreCart, fetchAndStoreUserInfo, fetchAndStoreOrders} from "../../actions";

class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.nextState = null;
        this.state = {
            isLoading:this.props.cart !== null ? false : true,
            notification:this.props.cart === null ? null : this.props.cart.empty ? {
                status:"none",
                message:"Cart is empty."
            } : null};
    }

    componentDidMount = () => {
        if(this.props.cart === null) {
            this.nextState = {
                isLoading:false,
                notification:null
            }
            this.props.fetchAndStoreCart();
        }
    }

    componentDidUpdate = () => {
        const notification = this.state.notification;
        if(this.nextState !== null) {
            this.setState(this.nextState);
            const finalized = this.nextState.finalized;
            this.nextState = null;
            if(this.props.cart !== null && this.props.cart.empty && finalized !== true) {
                this.setState({
                    notification: {
                        status:"none",
                        message:"Cart is empty."
                    }
                })
            }
        }
        else if(this.props.cart !== null && this.props.cart.empty === false && notification !== null && 
                (notification.status === "none" || notification.status === "success")) {
            this.setState({
                    notification:null,
                    isLoading:false
                })
        }
        else if(this.props.cart !== null && this.props.cart.empty && notification === null) {
            this.setState({
                notification: {
                    status:"none",
                    message:"Cart is empty."
                }
            })
        }
    } 

    
    addItem = (foodName, restaurantId, isFoodPartyFood) => {
        axios.put(`${configs.server_url}/carts?foodName=${foodName}&restaurantId=${restaurantId}&quantity=${1}&isFoodPartyFood=${isFoodPartyFood}`, {},
                 { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}})
        .then(response => {
            if(response.data.successful) {
                this.props.fetchAndStoreCart();
                this.nextState = {
                    isLoading:false,
                    notification:null
                };
            }
            else {
                this.setState({
                    isLoading:false,
                    notification: {
                        status:"error",
                        message:response.data.message
                    }
                })
            }
        });
        this.setState({isLoading:true, notification:null});
    }

    deleteItem = (foodName, restaurantId, isFoodPartyFood) => {
        axios.delete(`${configs.server_url}/carts?foodName=${foodName}&restaurantId=${restaurantId}&isFoodPartyFood=${isFoodPartyFood}`,
                     { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}, {})
        .then(() => {
            this.props.fetchAndStoreCart();
            this.nextState = {
                notification:null,
                isLoading:false
            };
        });
        this.setState({isLoading:true, notification:null});
    }

    finalizeOrder = () => {
        axios.post(`${configs.server_url}/carts`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}})
        .then((response) => {
            if(response.data.successful) {
                this.props.fetchAndStoreCart();
                this.props.fetchAndStoreUserInfo();
                this.props.fetchAndStoreOrders();
                this.nextState = {
                    isLoading:false,
                    finalized:true,
                    notification:{
                        status:"success",
                        message:"Your order was successfully placed."
                    }
                };
            }
            else {
                this.setState({
                    isLoading:false,
                    notification:{
                        status:"error",
                        message:"Your balance is not enough!"
                    }
                })
            }

        });
        this.setState({
            isLoading:true,
            notification:null
        });
    }

    calculateTotalCartPrice = (cartItems) => {
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
            price += cartItems[i].food.price * cartItems[i].quantity;
        }
        return price;
    }

    renderCartItems = () => {
        const restaurantId = this.props.cart.restaurant.id;

        return this.props.cart.cartItems.map((elem, index) => {
            const food = elem.food;
            return (
                <div key={index} className="cart-item ">
                    <div className="cart-item-name-quantity">
                        <div className="cart-item-name">{food.name}</div>
                        <div className="cart-item-quantity">
                            <i onClick={() => this.addItem(food.name, restaurantId, food.count === undefined ? false : true)} className="flaticon-plus plus-logo"></i>
                            <div>{elem.quantity}</div>
                            <i onClick={() => this.deleteItem(food.name, restaurantId, food.count === undefined ? false : true)} className="flaticon-minus minus-logo"></i>
                        </div>
                    </div>
                    <div className="cart-item-price">{food.price} Dollars</div>
                    <hr />
                </div>
            )
        })
    }

    renderCartContent = () => {
        if(this.props.cart === null) {
            return;
        }

        const cart = this.props.cart;
        if(cart.empty) {
            return;
        }
        else {
            return (    
                <>
                    <div className="cart-items">
                        {this.renderCartItems()}
                    </div>
                    <div className="cart-total-price">
                        Total Sum: <b> {this.calculateTotalCartPrice(cart.cartItems)} Dollars</b>
                    </div>
                    <button onClick={this.finalizeOrder} className="submit-button btn">Finalize Order</button>
                </>
            )
        }
    }

    renderSpinner = () => {
        if(this.state.isLoading) {
            return (
                <Spinner additionalClassName="everywhere-cart-spinner"/>
            )
        }
    }

    renderNotification = () => {
        if(this.state.notification !== null) {
            return (
                <div className={`cart-notification ${this.state.notification.status}`}>
                    {this.state.notification.message}
                </div>
            )
        }
    }

    render() {
        return (
            <div onClick={(event) => event.stopPropagation()} className={`cart-container ${this.props.type !== undefined ? `${this.props.type}` : ""}`}>
                <div className="cart">
                    <div className="cart-title">
                        Cart
                        <hr />
                    </div>
                    {this.renderCartContent()}
                    {this.renderSpinner()}
                    {this.renderNotification()}
                </div>
            </div>
        );
    }
}

Cart.propTypes = {
    cart:PropTypes.object,
    type:PropTypes.string
}

const mapStateToProps = (state) => {
    return {
        cart:state.cart,
    }
}

export default connect(mapStateToProps, {fetchAndStoreCart, fetchAndStoreUserInfo, fetchAndStoreOrders})(Cart);