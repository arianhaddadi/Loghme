import { useEffect, useState } from 'react';
import Spinner from "../utils/Spinner";
import {connect} from 'react-redux';
import {fetchAndStoreCart, fetchAndStoreUserInfo, fetchAndStoreOrders} from "../../actions";
import { sendRequest, RequestMethods } from '../../utils';


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
        const requestArgs = {
            method: RequestMethods.PUT,
            url: `/carts?foodName=${foodName}&restaurantId=${restaurantId}&quantity=${1}&isFoodPartyFood=${isFoodPartyFood}`,
            errorHandler: (error) => console.log("Adding Item to Cart Failed.", error),
            successHandler: (response) => {
                if(response.data.successful) {
                    props.fetchAndStoreCart();
                }
                else {
                    setNotification({
                        status: "error",
                        message: response.data.message
                    })
                }
                setIsProcessing(false)
            }    
        }
        sendRequest(requestArgs)
        setIsProcessing(true)
    }

    const deleteItem = (foodName, restaurantId, isFoodPartyFood) => {
        const requestArgs = {
            method: RequestMethods.DELETE,
            url: `/carts?foodName=${foodName}&restaurantId=${restaurantId}&isFoodPartyFood=${isFoodPartyFood}`,
            errorHandler: (error) => console.log("Deleting Item from Cart Failed.", error),
            successHandler: () => {
                props.fetchAndStoreCart();
                setIsProcessing(false)
            }    
        }
        sendRequest(requestArgs)
        setIsProcessing(true)
    }

    const finalizeOrder = () => {
        const requestArgs = {
            method: RequestMethods.POST,
            url: `/carts`,
            errorHandler: (error) => console.log("Finalizing Order Failed.", error),
            successHandler: (response) => {
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
            }    
        }
        sendRequest(requestArgs)
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