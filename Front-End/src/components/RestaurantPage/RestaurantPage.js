import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Cart from '../Cart/Cart';
import Modal from '../Modal/Modal';
import FoodModal from '../Food/Food';
import NavigationBar from '../NavigationBar/NavigationBar';
import RestaurantMenuItem from '../RestaurantPage/RestaurantMenuItem';
import {fetchAndStoreCart, fetchAndStoreRestaurant} from '../../actions';

class RestaurantPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {foodModalIsOpen:false};
    }

    componentDidMount = () => {
        document.title = "Restaurant";
        this.props.fetchAndStoreRestaurant(this.props.match.params.id);
    }

    orderFood = (food, restaurant) => {
        this.foodToShow = {
            food:food,
            restaurant:restaurant
        }
        this.setState({foodModalIsOpen:true});
    }

    renderMenuItems = () => {
        const menu = this.props.restaurant.menu;
        if (menu === null || menu.length === 0) {
            return (
                <div className="no-restaurant-items">
                    غذایی برای نمایش وجود ندارد.
                </div>
            )
        }
        else {
            return menu.map((elem, index) => {
                return (
                    <RestaurantMenuItem key={index} item={elem} orderFood={this.orderFood} restaurant={this.props.restaurant} />
                )
            })
        }
    }

    renderContent = () => {
        if(this.props.restaurant === null || this.props.restaurant.id !== this.props.match.params.id) return;
        return (
            <>
                <div className="rest-title-logo">
                    <img src={this.props.restaurant.logo} className="rest-logo" alt="" />
                    <div className="rest-title"> <b>{this.props.restaurant.name}</b> </div>
                </div>
                <div className="menu-title-container">
                    <div className="menu-title">
                        <b>
                            منوی غذا
                        </b>
                    </div>
                    <hr />
                </div>
                <div className="menu-cart">
                    <div className="menu-list">
                        {this.renderMenuItems()}
                    </div>
                    <div className="dashed-border">
                        <div></div>
                    </div>
                    <Cart />
                </div>
            </>
        );
    }

    closeFoodModal = () => {
        this.props.fetchAndStoreCart();
        this.setState({foodModalIsOpen:false});
    }

    openFoodModal = () => {
        return (
            <FoodModal isFoodParty={false} item={this.foodToShow} />
        );
    }

    renderFoodModal = () => {
        if(this.state.foodModalIsOpen) {
            return (
                    <Modal close={this.closeFoodModal} render={this.openFoodModal} />
            );
        }
    }

    render() {
        return (
            <>
                <NavigationBar browserHistory={this.props.history}/>
                <div className="restaurant-container">
                    <div className="head-bar"></div>
                    {this.renderContent()}
                </div>
                {this.renderFoodModal()}
            </>
        )
    }
}

RestaurantPage.propTypes = {
    restaurant:PropTypes.object,
    history:PropTypes.object.isRequired,
    location:PropTypes.object.isRequired,
    match:PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        restaurant:state.restaurant,
    }
}


export default connect(mapStateToProps, {fetchAndStoreCart, fetchAndStoreRestaurant})(RestaurantPage);