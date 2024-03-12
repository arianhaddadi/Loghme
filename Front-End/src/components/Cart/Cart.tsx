import React, { useEffect, useState } from 'react';
import Spinner from "../utils/Spinner.tsx";
import {connect} from 'react-redux';
import {fetchCart, fetchUserInfo, fetchOrders} from "../../actions/index.ts";
import { sendRequest, RequestMethods } from '../../utils/request.ts';
import { ActionCreator, Cart as CartType, CartItem, Notification, Nullable, RequestArguments, User, Order } from '../../utils/types';
import { RootState } from '../../app/store.ts';
import { CartState } from '../../reducers/CartReducer.ts';

interface CartProps {
    fetchCart: ActionCreator<CartType>,
    fetchUserInfo: ActionCreator<User>,
    fetchOrders: ActionCreator<Order[]>,
    type?: string,
    cart: CartState
}


const Cart = (props: CartProps) => {

    const [isProcessing, setIsProcessing] = useState<boolean>(props.cart === null)
    const [notification, setNotification] = useState<Nullable<Notification>>(() => {
        if (props.cart === null || !props.cart.empty) {
            return null;
        }
      
        return {
            status: "none",
            message: "Cart is empty.",
        };
    });

    useEffect(() => {
        if(props.cart === null) props.fetchCart();
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

    const addItem = (foodName: string, restaurantId: string, isFoodPartyFood: boolean) => {
        const requestArgs: RequestArguments =  {
            method: RequestMethods.PUT,
            url: `/carts?foodName=${foodName}&restaurantId=${restaurantId}&quantity=${1}&isFoodPartyFood=${isFoodPartyFood}`,
            errorHandler: (error) => console.log("Adding Item to Cart Failed.", error),
            successHandler: (response) => {
                if(response.data.successful) {
                    props.fetchCart();
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

    const deleteItem = (foodName: string, restaurantId: string, isFoodPartyFood: boolean) => {
        const requestArgs: RequestArguments =  {
            method: RequestMethods.DELETE,
            url: `/carts?foodName=${foodName}&restaurantId=${restaurantId}&isFoodPartyFood=${isFoodPartyFood}`,
            errorHandler: (error) => console.log("Deleting Item from Cart Failed.", error),
            successHandler: () => {
                props.fetchCart();
                setIsProcessing(false)
            }    
        }
        sendRequest(requestArgs)
        setIsProcessing(true)
    }

    const finalizeOrder = () => {
        const requestArgs: RequestArguments =  {
            method: RequestMethods.POST,
            url: `/carts`,
            errorHandler: (error) => console.log("Finalizing Order Failed.", error),
            successHandler: (response) => {
                if(response.data.successful) {
                    props.fetchCart();
                    props.fetchUserInfo();
                    props.fetchOrders();
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

    const calculateTotalCartPrice = (cartItems: CartItem[]) => {
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
                            <i onClick={() => addItem(food.name, restaurantId, food.count !== undefined)} className="flaticon-plus plus-logo"></i>
                            <div>{elem.quantity}</div>
                            <i onClick={() => deleteItem(food.name, restaurantId, food.count !== undefined)} className="flaticon-minus minus-logo"></i>
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

const mapStateToProps = (state: RootState) => {
    return {
        cart: state.cart,
    }
}

export default connect(mapStateToProps, {fetchCart, fetchUserInfo, fetchOrders})(Cart);