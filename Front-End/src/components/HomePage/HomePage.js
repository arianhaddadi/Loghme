import React from 'react';
import {connect} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';
import axios from 'axios';
import PropTypes from 'prop-types';
import logo from '../../images/Logo.png';
import {convertEnglishNumbersToPersian, styleTime} from "../../utilities";
import Spinner from "../Spinner/Spinner";
import {fetchAndStoreFoodPartyInformation, fetchAndStoreRestaurants, clearRestaurants} from '../../actions';
import Modal from '../Modal/Modal';
import FoodModal from '../Food/Food';
import NavigationBar from '../NavigationBar/NavigationBar';
import FoodPartyItem from './FoodPartyItem';
import RestaurantItem from './RestaurantItem';

class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFoodModal: false,
            searchRestaurantName: "",
            searchFoodName: "",
            searchedRestaurants:null,
            pageNum:1,
            searchPageNum:1,
            pageSize:12,
            visible:10,
            isLoadingMore:false,
            numOfRestaurants:0,
            restaurantsFullyLoaded:false,
            searchedRestaurantsFullyLoaded:false,
            isSearching:false
        };
        this.foodPartyTimer = null;
        this.nextState = null;
    }

    componentDidMount = () => {
        document.title = "Home";
        this.props.fetchAndStoreFoodPartyInformation();
        this.props.fetchAndStoreRestaurants(this.state.pageSize, this.state.pageNum);
    }

    componentWillUnmount = () => {
        clearInterval(this.foodPartyTimer);
        this.props.clearRestaurants();
    }

    downCountTimer = () => {
        let {minutes, seconds} = this.state.timer;
        if(minutes !== 0 || seconds !== 0) {
            if(seconds === 0) {
                seconds = 59;
                minutes -= 1;
            }
            else {
                seconds -= 1;
            }
            this.setState({
                timer:{
                    minutes:minutes,
                    seconds:seconds
                }
            });
        }
        else {
            clearInterval(this.foodPartyTimer);
            this.foodPartyTimer = null;
            this.props.fetchAndStoreFoodPartyInformation();
        }
    }

    componentDidUpdate = () => {
        if(this.foodPartyTimer === null && this.props.foodPartyRestaurants !== null) {
            this.setState({
                timer:{
                    minutes:this.props.foodPartyTimer.minutes,
                    seconds:this.props.foodPartyTimer.seconds
                }
            })
            this.foodPartyTimer = setInterval(this.downCountTimer, 1000);
        }
        if (this.state.numOfRestaurants !== this.props.restaurants.length) {
            if (this.nextState !== null) {
                this.setState(this.nextState);
                this.nextState = null;
            }
            this.setState({
                numOfRestaurants:this.props.restaurants.length,
                restaurantsFullyLoaded:this.props.restaurants.length - this.state.numOfRestaurants < this.state.pageSize ? true : false
            })
        }
        else if(this.state.newSearchResults) {
            if (this.nextState !== null) {
                this.setState(this.nextState);
                this.nextState = null;
            }
            this.setState({
                newSearchResults:false
            })
        }
    }

    orderFoodPartyFood = (restaurant, food) => {
        this.foodPartyItemToShow = {
            restaurant:restaurant,
            food:food
        };
        this.setState({showFoodModal:true});
    }
    
    renderFoodPartyItems = () => {
        if(this.props.foodPartyRestaurants !== null) {
            if(this.props.foodPartyRestaurants.length === 0) {
                return (
                    <div className="no-food-party-restaurants-notification">
                        رستورانی برای جشن غذا وجود ندارد.
                    </div>
                );
            }
            else {
                let foodpartyItems = [];
                const foodPartyRestaurants = this.props.foodPartyRestaurants;
                for (let i = 0; i < foodPartyRestaurants.length; i++) {
                    foodpartyItems = foodpartyItems.concat(foodPartyRestaurants[i].foodPartyMenu.map(
                    (elem, index) => {
                        return (
                            <FoodPartyItem key={`${i}` + index} orderFood={this.orderFoodPartyFood} restaurant={foodPartyRestaurants[i]} item={elem} />
                        )
                    }))
                }
                return foodpartyItems;
            }
        }
        else {
            return (
                <Spinner additionalClassName="food-party-spinner"/>
            )
        }
    }

    viewRestaurantPage = (restaurantId) => {
        this.props.history.push(`/restaurants/${restaurantId}`);
    }

    renderRestaurants = () => {
        if(this.props.restaurants.length !== 0 && (this.state.isSearching === false || (this.state.searchedRestaurants !== null))) {
            let restaurantsToShow = this.state.searchedRestaurants === null ? this.props.restaurants : this.state.searchedRestaurants;
            return restaurantsToShow.map((elem, index) => {
                return (
                    <RestaurantItem key={index} item={elem} viewRestaurantPage={this.viewRestaurantPage} />
                )
            });
        }
        else if (this.props.restaurants.length === 0) {
            return (
                <Spinner additionalClassName=" " />
            )
        }
    }

    loadMore = () => {
        if (this.state.searchedRestaurants === null) {
            this.props.fetchAndStoreRestaurants(this.state.pageSize, this.state.pageNum + 1);
            this.setState({pageNum:this.state.pageNum + 1, isLoadingMore:true});
        }
        else {
            this.search(this.state.pageSize, this.state.searchPageNum + 1)
            this.setState({
                searchPageNum: this.state.searchPageNum + 1, isLoadingMore:true
            })
        }
    }

    renderLoadingMoreSpinner = () => {
        if (this.state.isLoadingMore) {
            this.nextState = {
                isLoadingMore:false
            }
            return (
                <Spinner additionalClassName="loading-more-spinner" />
            )
        }
    }

    renderShowMoreButton = () => {
        if ((this.props.restaurants.length !== 0 && this.state.restaurantsFullyLoaded === false && this.state.searchedRestaurants === null) 
            || (this.state.searchedRestaurants !== null && this.state.searchedRestaurantsFullyLoaded === false)) {

            return (
                <>
                    <button onClick={this.loadMore} className="submit-button btn show-more-button">نمایش بیشتر</button>
                    {this.renderLoadingMoreSpinner()}
                </>
            )
        }
        else if (this.state.searchedRestaurants !== null && this.state.searchedRestaurants.length === 0) {
            return (
                <p>!نتیجه ای یافت نشد</p>
            )
        }
    }
    
    renderRestaurantsSection = () => {
        return (
            <div className="restaurants-home">
                <div className="home-title">
                    رستوران ها
                </div>
                <hr className="home-title-hr"/>
                <div className="restaurants-home-items">
                    {this.renderRestaurants()}
                </div>
                {this.renderShowMoreButton()}
            </div>
        )
    }

    renderFoodPartyTimer = () => {
        if(this.props.foodPartyRestaurants !== null && this.foodPartyTimer !== null) {
            return (
                <div className="food-party-home-timer">
                    زمان باقی مانده: {convertEnglishNumbersToPersian(styleTime(this.state.timer.minutes))}:{convertEnglishNumbersToPersian(styleTime(this.state.timer.seconds))}
                </div>
            )
        }
    }

    renderFoodPartySection = () => {
        return (
            <div className="food-party-home">
                <div className="home-title">
                     جشن غذا!
                </div>
                <hr className="home-title-hr"/>
                {this.renderFoodPartyTimer()}
                <div className="food-party-home-items">
                    {this.renderFoodPartyItems()}
                </div>
            </div>
        )
    }

    closeFoodPartyModal = () => {
        this.props.fetchAndStoreFoodPartyInformation();
        this.setState({showFoodModal:false});
    }

    showFoodPartyModal = () => {
        return (
            <FoodModal isFoodParty item={this.foodPartyItemToShow} />
        )
    }

    renderFoodPartyModal = () => {
        if(this.state.showFoodModal) {
            return (
                <Modal close={this.closeFoodPartyModal} render={this.showFoodPartyModal} />
            )
        }
    }

    search = (pageSize, pageNum) => {
        axios.get(`http://ie.etuts.ir:30735/search?foodName=${this.state.searchFoodName}&restaurantName=${this.state.searchRestaurantName}&pageSize=${pageSize}&pageNum=${pageNum}`,
                 { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}})
            .then(response => {
                this.setState({
                    searchedRestaurants:(this.state.searchedRestaurants === null || pageNum === 1) ? response.data.list : this.state.searchedRestaurants.concat(response.data.list),
                    isSearching:false,
                    isLoadingMore:false,
                    searchedRestaurantsFullyLoaded:response.data.list.length < this.state.pageSize || response.data.list.length === 0,
                    newSearchResults:true
                })
                if(response.data.list.length === 0 && this.state.searchedRestaurants === null) {
                    toast("!موردی یافت نشد");
                }
                else {
                    toast("!جست و جو موفقیت آمیز بود");
                }
            }
        )
        this.setState({
            isSearching:true,
            isLoadingMore:this.state.searchedRestaurants !== null
        })
    }

    handleSearchSubmit = (event) => {
        event.preventDefault();
        if((this.state.searchRestaurantName === "") && (this.state.searchFoodName === "")) {
            toast("!فیلد های جست و جو را تکمیل کنید")
        }
        else {
            if (this.state.searchPageNum !== 1) {
                this.setState({
                    searchPageNum:1,
                    searchedRestaurants:null
                })
            }
            this.search(this.state.pageSize, 1);
        }
    }

    handleSearchChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    render() {
        return (
            <>  
                <NavigationBar hideLogo browserHistory={this.props.history}/>
                <ToastContainer autoClose={5000} />
                <div className="home-container">
                    <div className="home-head-bar">
                        <img onClick={() => this.setState({searchedRestaurants:null})} src={logo} className="loghme-logo-home" alt="" />
                        <div className="restaurant-desription-home">
                            اولین و بزرگ ترین وب سایت آنلاین سفارش غذا در دانشگاه تهران
                        </div>
                        <form className="search-bar-home" onSubmit={this.handleSearchSubmit} noValidate>
                            <button type="submit" className="btn btn-warning">جست و جو</button>
                            <input name="searchRestaurantName" onChange={this.handleSearchChange} 
                                noValidate type="text" className="btn search-bar-home-restaurant-name" 
                                placeholder="نام رستوران" value={this.state.searchRestaurantName}/>
                            <input name="searchFoodName" onChange={this.handleSearchChange} 
                                noValidate type="text" className="btn search-bar-home-food-name" 
                                placeholder="نام غذا" value={this.state.searchFoodName}/>
                        </form>
                        <div className="head-bar-cover"></div>
                    </div>
                    {this.renderFoodPartySection()}
                    {this.renderRestaurantsSection()}
                </div>
                {this.renderFoodPartyModal()}
            </>
        )
    }
}

HomePage.propTypes = {
    foodPartyTimer:PropTypes.object,
    foodPartyRestaurants:PropTypes.array,
    restaurants:PropTypes.array,
    history:PropTypes.object.isRequired,
    location:PropTypes.object.isRequired,
    match:PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        foodPartyTimer:state.foodPartyTimer,
        foodPartyRestaurants:state.foodPartyRestaurants,
        restaurants:state.restaurants,
    }
}


export default connect(mapStateToProps, {fetchAndStoreFoodPartyInformation, fetchAndStoreRestaurants, clearRestaurants})(HomePage);