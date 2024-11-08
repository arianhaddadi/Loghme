import {useEffect, useRef, useState} from 'react';
import Modal from '../utils/Modal.tsx';
import Spinner from "../utils/Spinner.tsx";
import {connect} from 'react-redux';
import {fetchOrders, fetchUserInfo} from "../../actions";
import {RequestMethods, sendRequest} from '../../utils/request.ts';
import {ActionCreator, CartItem, Notification, Nullable, Order, RequestArguments, User} from '../../utils/types';
import {RootState} from '../../app/store.ts';
import {OrdersState} from '../../reducers/OrdersReducer.ts';
import {UserState} from '../../reducers/UserReducer.ts';

interface ProfilePageProps {
    fetchOrders: ActionCreator<Order[]>,
    fetchUserInfo: ActionCreator<User>
    orders: OrdersState,
    user: UserState
}


const ProfilePage = (props: ProfilePageProps) => {
    const [visibleOrder, setVisibleOrder] = useState<Nullable<Order>>(null)
    const [creditsNotification, setCreditsNotification] = useState<Nullable<Notification>>(null)
    const [creditsLoading, setCreditsLoading] = useState<boolean>(false)
    const [creditsInputValue, setCreditsInputValue] = useState<string>("")

    const ordersUpdater = useRef<Nullable<NodeJS.Timeout>>(null)


    useEffect(() => {
        document.title = "Profile";
        props.fetchOrders();
        props.fetchUserInfo();
        ordersUpdater.current = setInterval(props.fetchOrders, 30 * 1000)

        return () => {
            clearInterval(ordersUpdater.current!)
        }
    }, [])

    const renderPersonalInfoItem = (info: string, iconClass: string) => {
        return (
            <div className="personal-info-item">
                <div>{info}</div>
                <i className={iconClass}></i>
            </div>
        );
    }

    const addCredit = () => {
        if (creditsInputValue === "") {
            setCreditsNotification({
                status: "error",
                message: "Input is empty!",
            })
        } else if (isNaN(parseFloat(creditsInputValue))) {
            setCreditsInputValue("")
            setCreditsNotification({
                status: "error",
                message: "Input must be a number",
            })
        } else if (parseFloat(creditsInputValue) < 0) {
            setCreditsInputValue("")
            setCreditsNotification({
                status: "error",
                message: "Reducing balance is not allowed!"
            })
        } else {
            const requestArgs: RequestArguments = {
                method: RequestMethods.PUT,
                url: `/credits?amount=${creditsInputValue}`,
                errorHandler: (error) => console.log("Adding Credit Failed.", error),
                successHandler: () => {
                    setCreditsLoading(false)
                    setCreditsInputValue("")
                    setCreditsNotification({
                        status: "success",
                        message: "Your balance was increased successfully!"
                    })
                    props.fetchUserInfo();
                }
            }
            sendRequest(requestArgs)
            setCreditsLoading(true)
            setCreditsNotification(null)
        }
    }

    const renderCreditsNotification = () => {
        if (creditsNotification) {
            return (
                <div className={`credits-notification ${creditsNotification.status}`}>
                    {creditsNotification.message}
                </div>
            )
        }
    }

    const renderCreditsSpinner = () => {
        if (creditsLoading) {
            return (
                <Spinner additionalClassName="credits-spinner col-12"/>
            )
        }
    }

    const renderCreditsTab = () => {
        return (
            <div className="tab">
                <input id="credit-tab" name="tabgroup" type="radio"/>
                <label htmlFor="credit-tab">
                    Add Balance
                </label>
                <div className="row credit-content">
                    <button onClick={addCredit} type="button" className="btn btn-primary add-credit-button col-3">
                        Add
                    </button>
                    <input className="credit-input btn col-8" value={creditsInputValue}
                           onChange={(event) => setCreditsInputValue(event.target.value)} placeholder="Balance to add"/>
                    {renderCreditsNotification()}
                    {renderCreditsSpinner()}
                </div>
            </div>
        )
    }

    const renderOrderStatusButton = (deliveryStatus: string) => {
        if (deliveryStatus === "DELIVERY_ON_ITS_WAY") {
            return (
                <div className="btn-success on-the-way-button">
                    Delivery on its way
                </div>
            )
        } else if (deliveryStatus === "SEARCHING_FOR_DELIVERY") {
            return (
                <div className="btn-info">
                    Searching for delivery
                </div>
            )
        } else {
            return (
                <div className="btn-warning">
                    View Bill
                </div>
            )
        }
    }

    const viewOrder = (order: Order) => {
        setVisibleOrder(order)
    }

    const renderOrdersRows = () => {
        if (props.orders === null) {
            return (
                <Spinner additionalClassName="orders-spinner"/>
            );
        } else {
            if (props.orders.length === 0) {
                return (
                    <div className="no-orders">
                        No orders to show
                    </div>
                )
            }
            return props.orders.map((elem, index) => {
                return (
                    <div key={index} onClick={() => viewOrder(elem)} className="order">
                        <div className="order-index">{index + 1}</div>
                        <div className="order-restaurant-name">
                            {elem.cart.restaurant.name}
                        </div>
                        <div className="order-status">
                            {renderOrderStatusButton(elem.status)}
                        </div>
                    </div>
                )
            })
        }
    }

    const renderOrderItems = (cartItems: CartItem[]) => {
        return cartItems.map((elem, index) => {
            return (
                <div key={index} className="order-modal-item">
                    <div className="index">
                        {index + 1}
                    </div>
                    <div className="food-name">
                        {elem.food.name}
                    </div>
                    <div className="quantity">
                        {elem.quantity}
                    </div>
                    <div className="price">
                        {elem.food.price}
                    </div>
                </div>
            );
        });
    }

    const calculateOrderPrice = (cartItems: CartItem[]) => {
        let price = 0;
        for (let i = 0; i < cartItems.length; i++) {
            price += cartItems[i].food.price * cartItems[i].quantity;
        }
        return price;
    }

    const renderOrderInfo = (order: Order) => {
        return (
            <div onClick={(event) => event.stopPropagation()} className="order-modal">
                <div className="order-modal-restaurant-name">
                    {order.cart.restaurant.name}
                </div>
                <hr/>
                <div className="order-modal-items-table">
                    <div className="order-modal-items-table-head">
                        <div className="index">
                            Index
                        </div>
                        <div className="food-name">
                            Name
                        </div>
                        <div className="quantity">
                            Quantity
                        </div>
                        <div className="price">
                            Price
                        </div>
                    </div>
                    {renderOrderItems(order.cart.cartItems)}
                    <div className="order-modal-price">
                        <b>
                            Total Price:{calculateOrderPrice(order.cart.cartItems)} Dollars
                        </b>
                    </div>
                </div>
            </div>
        )
    }

    const closeOrderModal = () => {
        setVisibleOrder(null)
    }

    const renderOrderModal = () => {
        if (visibleOrder) {
            return (
                <Modal close={closeOrderModal} render={() => renderOrderInfo(visibleOrder)}/>
            )
        }
    }

    const handleClickOnOrdersTab = () => {
        props.fetchOrders();
        setCreditsNotification(null);
    }

    const renderOrdersTab = () => {
        return (
            <div className="tab">
                <input id="orders-tab" name="tabgroup" type="radio" defaultChecked/>
                <label htmlFor="orders-tab" onClick={handleClickOnOrdersTab}>
                    Orders
                </label>
                <div className="orders-content">
                    {renderOrdersRows()}
                </div>
            </div>
        );
    }

    const renderProfileInfo = () => {
        if (props.user) {
            const user = props.user;
            return (
                <>
                    <div className="username">
                        <i className="flaticon-account name-logo"></i>
                        <b>
                            {user.name + " " + user.familyName}
                        </b>
                    </div>
                    <div className="personal-info">
                        {renderPersonalInfoItem(user.phoneNumber, "flaticon-phone")}
                        {renderPersonalInfoItem(user.email, "flaticon-mail")}
                        {renderPersonalInfoItem(`${user.credit} Dollars`, "flaticon-card")}
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <div className="head-bar profile">
                {renderProfileInfo()}
            </div>
            <div className="tabs">
                {renderCreditsTab()}
                {renderOrdersTab()}
            </div>
            {renderOrderModal()}
        </>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        orders: state.orders,
        user: state.user,
    }
}


export default connect(mapStateToProps, {fetchOrders, fetchUserInfo})(ProfilePage);