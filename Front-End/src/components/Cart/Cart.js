import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import configs from '../../configs';
import {connect} from 'react-redux';
import {fetchAndStoreCart, fetchAndStoreUserInfo, fetchAndStoreOrders} from "../../actions";

const Cart = (props) => {

    const [isProcessing, setIsProcessing] = useState(props.cart !== null ? false : true)
    const [notification, setNotification] = useState(() => {
        if (props.cart === null || !props.cart.empty) {
            return null;
        }
      
        return {
            status: "none",
            message: "Cart is empty.",
        };
    });

    useEffect(() => {
        if(props.cart === null) props.fetchAndStoreCart();
    }, [])

    useEffect(() => {
        if (props.cart && props.cart.empty) {
            setNotification({
                status: "none",
                message: "Cart is empty.",
            })
        }
        setIsProcessing(false)
    }, [props.cart])

    const addItem = (foodName, restaurantId, isFoodPartyFood) => {
        axios.put(`${configs.server_url}/carts?foodName=${foodName}&restaurantId=${restaurantId}&quantity=${1}&isFoodPartyFood=${isFoodPartyFood}`, {},
                 { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            if(response.data.successful) {
                props.fetchAndStoreCart();
            }
            else {
                setNotification({
                    status:"error",
                    message:response.data.message
                })
            }
            setIsProcessing(false)
        });
        setIsProcessing(true)
    }

    const deleteItem = (foodName, restaurantId, isFoodPartyFood) => {
        axios.delete(`${configs.server_url}/carts?foodName=${foodName}&restaurantId=${restaurantId}&isFoodPartyFood=${isFoodPartyFood}`,
                     { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}, {})
        .then(() => {
            props.fetchAndStoreCart();
            setIsProcessing(false)
        });
        setIsProcessing(true)
    }

    const finalizeOrder = () => {
        axios.post(`${configs.server_url}/carts`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then((response) => {
            if(response.data.successful) {
                props.fetchAndStoreCart();
                props.fetchAndStoreUserInfo();
                props.fetchAndStoreOrders();
                setNotification({
                    status: "success",
                    message: "Your order was successfully placed."
                })
            }
            else {
                setNotification({
                    status: "error",
                    message: "Your balance is not enough!"
                })
            }
            setIsProcessing(false)
        });
        setIsProcessing(true)
        setNotification(null)
    }

    const calculateTotalCartPrice = (cartItems) => {
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
            price += cartItems[i].food.price * cartItems[i].quantity;
        }
        return price;
    }

    const renderCartItems = () => {
        const restaurantId = props.cart.restaurant.id;

        return props.cart.cartItems.map((elem, index) => {
            const food = elem.food;
            return (
                <div key={index} className="cart-item ">
                    <div className="cart-item-name-quantity">
                        <div className="cart-item-name">{food.name}</div>
                        <div className="cart-item-quantity">
                            <i onClick={() => addItem(food.name, restaurantId, food.count === undefined ? false : true)} className="flaticon-plus plus-logo"></i>
                            <div>{elem.quantity}</div>
                            <i onClick={() => deleteItem(food.name, restaurantId, food.count === undefined ? false : true)} className="flaticon-minus minus-logo"></i>
                        </div>
                    </div>
                    <div className="cart-item-price">{food.price} Dollars</div>
                    <hr />
                </div>
            )
        })
    }

    const renderCartContent = () => {
        const cart = props.cart;

        if(cart === null || cart.empty) {
            return;
        }
        else {
            return (    
                <>
                    <div className="cart-items">
                        {renderCartItems()}
                    </div>
                    <div className="cart-total-price">
                        Total Sum: <b> {calculateTotalCartPrice(cart.cartItems)} Dollars</b>
                    </div>
                    <button onClick={finalizeOrder} className="submit-button btn">Finalize Order</button>
                </>
            )
        }
    }

    const renderSpinner = () => {
        if(isProcessing) {
            return (
                <Spinner additionalClassName="everywhere-cart-spinner"/>
            )
        }
    }

    const renderNotification = () => {
        if(notification) {
            return (
                <div className={`cart-notification ${notification.status}`}>
                    {notification.message}
                </div>
            )
        }
    }

    return (
        <div onClick={(event) => event.stopPropagation()} className={`cart-container ${props.type !== undefined ? `${props.type}` : ""}`}>
            <div className="cart">
                <div className="cart-title">
                    Cart
                    <hr />
                </div>
                {renderCartContent()}
                {renderSpinner()}
                {renderNotification()}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        cart:state.cart,
    }
}

export default connect(mapStateToProps, {fetchAndStoreCart, fetchAndStoreUserInfo, fetchAndStoreOrders})(Cart);