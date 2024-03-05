import {useEffect, useState} from 'react';
import logo from '../../styles/images/Logo.png';
import FoodPartySection from './FoodPartySection';
import RestaurantsSection from './RestaurantsSection';
import configs from '../../configs';
import {toast} from 'react-toastify';
import { sendRequest, RequestMethods } from '../../utils';

const HomePage = () => {
    const [searchRestaurantNameValue, setSearchRestaurantName] = useState("")
    const [searchFoodNameValue, setSearchFoodName] = useState("")
    const [searchedRestaurants, setSearchedRestaurants] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [numOfPagesSearchResults, setNumOfPagesSearchResults] = useState(0)
    

    useEffect(() => {
        document.title = "Home";
    }, [])

    const search = (pageNum) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: `/search?foodName=${searchFoodNameValue}&restaurantName=${searchRestaurantNameValue}&pageSize=${configs.home_page_size}&pageNum=${pageNum}`,
            errorHandler: (error) => console.log("Search Failed.", error),
            successHandler: (response) => {
                const results = response.data.payload
                if (searchedRestaurants === null) {
                    setSearchedRestaurants(results)
                } else {
                    setSearchedRestaurants(searchedRestaurants.concat(results))
                }
                setIsSearching(false)
                if(results.length === 0) {
                    toast("No more items found.");
                }
                else {
                    toast("Search was successfull.");
                }
            }
        }
        sendRequest(requestArgs)
        setIsSearching(true)
        setNumOfPagesSearchResults(pageNum)
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if((searchRestaurantNameValue === "") && (searchFoodNameValue === "")) {
            toast("Please complete at least one of the fields!")
        }
        else {
            setSearchedRestaurants(null)
            search(1);
        }
    }

    const handleSearchMore = () => {
        search(numOfPagesSearchResults + 1);
    }

    const handleSearchChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        if (name === "searchFoodName") setSearchFoodName(value);
        else setSearchRestaurantName(value);
    }

    return (
        <>  
            <div className="home-container">
                <div className="home-head-bar">
                    <img onClick={() => setSearchedRestaurants(null)} src={logo} className="loghme-logo-home" alt="" />
                    <div className="restaurant-desription-home">
                        The best online food ordering website in the world!
                    </div>
                    <form className="search-bar-home" onSubmit={handleSearchSubmit} noValidate>
                        <button type="submit" className="btn btn-warning">Search</button>
                        <input name="searchRestaurantName" onChange={handleSearchChange} 
                            noValidate type="text" className="btn search-bar-home-restaurant-name" 
                            placeholder="Restaurant Name" value={searchRestaurantNameValue}/>
                        <input name="searchFoodName" onChange={handleSearchChange} 
                            noValidate type="text" className="btn search-bar-home-food-name" 
                            placeholder="Food Name" value={searchFoodNameValue}/>
                    </form>
                    <div className="head-bar-cover"></div>
                </div>
                <FoodPartySection />
                <RestaurantsSection searchedRestaurants={searchedRestaurants} isSearching={isSearching} searchMore={handleSearchMore} />
            </div>
        </>
    )
}

export default HomePage;
