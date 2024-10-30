import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

/*
Functional component that renders car inventory view.
*/
const SearchCars = () => {
    //stores currently displayed cars
    const [cars, setCars] = useState([]);
    //stores unique car makes for filtering
    const [makes, setMakes] = useState([]);
    //stores unique car models for filtering
    const [models, setModels] = useState([]);
    //stores an object representing dealer details
    const [dealer, setDealer] = useState({"full_name": ""});
    //stores a loading message or an error message
    const [message, setMessage] = useState("Loading Cars....");
    
    const { id } = useParams(); //dealer id
  
    //url to get inventory of the dealer with the specified id.
    let dealer_url = `/djangoapp/get_inventory/${id}`;

    //url to get details of the dealer with the specified id.
    let fetch_url = `/djangoapp/dealer/${id}`;
  
    /*
    Fetches the dealer details and sets dealer state variable.
    */
    const fetchDealer = async ()=>{
        const res = await fetch(fetch_url, {
            method: "GET"
        });
        const retobj = await res.json();
        if(retobj.status === 200) {
            let dealer = retobj.dealer;
            setDealer({"full_name":dealer[0].full_name})
        }
    }

    /*
    Fetches the cars, sets 'cars' state variables, and sets 'makes'
    and 'models' state variables by calling populateMakesAndModels.  
    */
    const fetchCars = async ()=>{
        const res = await fetch(dealer_url, {
            method: "GET"
        });
        const retobj = await res.json();
        
        if(retobj.status === 200) {
            let cars = Array.from(retobj.cars)
            setCars(cars);
            populateMakesAndModels(cars);
        }
    }

    /*
    Takes an array of cars as a parameter and populates the makes and models
    state variables based on unique values from the cars.
    */
    const populateMakesAndModels = (cars)=>{
        let tmpmakes = []
        let tmpmodels = []
        cars.forEach((car)=>{
            tmpmakes.push(car.make)
            tmpmodels.push(car.model)
        })
        setMakes(Array.from(new Set(tmpmakes)));
        setModels(Array.from(new Set(tmpmodels)));
    }

    /*
    This function gets called whenever user changes a selection value.
    It takes an array of cars matching that criteria. It then filters
    the (copy of) the array further according to other selection
    values that are currently set. Sets the 'message' state variable if no
    cars match the criteria. Updates the state variable 'cars' with the 
    filtered cars. 
    */
    const setCarsmatchingCriteria = async(matching_cars)=>{
        let cars = Array.from(matching_cars)
        console.log("Number of matching cars "+cars.length);

        let makeIdx = document.getElementById('make').selectedIndex;
        let modelIdx = document.getElementById('model').selectedIndex;
        let yearIdx = document.getElementById('year').selectedIndex;
        let mileageIdx = document.getElementById('mileage').selectedIndex;
        let priceIdx = document.getElementById('price').selectedIndex;

        if(makeIdx !== 0) {
            let currmake = document.getElementById('make').value;
            cars = cars.filter(car => car.make === currmake);
        }
        if(modelIdx !== 0) {
            let currmodel = document.getElementById('model').value;
            cars = cars.filter(car => car.model === currmodel);
            if(cars.length !== 0) {
                document.getElementById('make').value = cars[0].make;
            }
        }

        if(yearIdx !== 0) {
        let curryear = document.getElementById('year').value;
        cars = cars.filter(car => car.year >= curryear);
            if(cars.length !== 0) {
                document.getElementById('make').value = cars[0].make;
            }
        }

        if(mileageIdx !== 0) {
            let currmileage = parseInt(document.getElementById('mileage').value);
            if(currmileage === 50000) {
                cars = cars.filter(car => car.mileage <= currmileage);
            } else if (currmileage === 100000){
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 50000);
            } else if (currmileage === 150000){
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 100000);
            } else if (currmileage === 200000){
                cars = cars.filter(car => car.mileage <= currmileage && car.mileage > 150000);
            } else {
                cars = cars.filter(car => car.mileage > 200000);
            }
        }

        if(priceIdx !== 0) {
            let currprice = parseInt(document.getElementById('price').value);
            if(currprice === 20000) {
                cars = cars.filter(car => car.price <= currprice);
            } else if (currprice === 40000){
                cars = cars.filter(car => car.price <= currprice && car.price > 20000);
            } else if (currprice === 60000){
                cars = cars.filter(car => car.price <= currprice && car.price > 40000);
            } else if (currprice === 80000){
                cars = cars.filter(car => car.price <= currprice && car.price > 60000);
            } else {
                cars = cars.filter(car => car.price > 80000);
            }
        }

        if(cars.length === 0) {
            setMessage("No matching cars found");
        }

        setCars(cars);
    }

    /*
    Each of the following functions retrieves the value of a dropdown field,
    append the respective parameter to the Dealer URL, performs GET request
    to the server with the updated URL to obtain the filtered car data, and
    updates the 'cars' state variable using the setCarsmatchingCriteria 
    */

    let SearchCarsByMake = async ()=> {
        let make = document.getElementById("make").value;
        dealer_url = dealer_url + "?make="+make;

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})

        const retobj = await res.json();
        
        if(retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByModel = async ()=> {
        let model = document.getElementById("model").value;
        dealer_url = dealer_url + "?model="+model;

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }})

        const retobj = await res.json();
      
        if(retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByYear = async ()=> {
        let year = document.getElementById("year").value;
        if (year !== "all") {
            dealer_url = dealer_url + "?year="+year;
        }

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})

        const retobj = await res.json();
        
        if(retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    let SearchCarsByMileage = async ()=> {
        
        let mileage = document.getElementById("mileage").value;
        if (mileage !== "all") {
            dealer_url = dealer_url + "?mileage="+mileage;
        }    

        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})

        const retobj = await res.json();
        
        if(retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }


    let SearchCarsByPrice = async ()=> {
        let price = document.getElementById("price").value;
        if(price !== "all") {
            dealer_url = dealer_url + "?price="+price;
        }
        
        const res = await fetch(dealer_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})

        const retobj = await res.json();
        
        if(retobj.status === 200) {
            setCarsmatchingCriteria(retobj.cars);
        }
    }

    /*
    Handles the reset of the selection fields (On 'Reset' button click)
    */
    const reset = ()=>{
        const selectElements = document.querySelectorAll('select');

        selectElements.forEach((select) => {
        select.selectedIndex = 0;
        });  
        fetchCars();
    }
  

    useEffect(() => {
        fetchCars();
        fetchDealer();
    },[]); 

    return (
        <div>
        <Header />
        <h1 style={{ marginBottom: '20px'}}>Cars at {dealer.full_name}</h1>
        <div>
        <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Make</span>
        <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="make" id="make" onChange={SearchCarsByMake}>
            {makes.length === 0 ? (
            <option value=''>No data found</option>
            ):(
            <>
            <option disabled defaultValue> -- All -- </option>
            {makes.map((make, index) => (
                <option key={index} value={make}>
                {make}
                </option>
            ))}
            </>
            )        
            }
        </select>
        <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Model</span>
        <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="model" id="model" onChange={SearchCarsByModel}>
        {models.length === 0 ? (
            <option value=''>No data found</option>
        ) : (
            <>
            <option disabled defaultValue> -- All -- </option>
            {models.map((model, index) => (
                <option key={index} value={model}>
                {model}
                </option>
            ))}
            </>
        )}      
        </select>
        <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Year</span>
        <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="year" id="year" onChange={SearchCarsByYear}>
            <option selected value='all'> -- All -- </option>
            <option value='2024'>2024 or newer</option>
            <option value='2023'>2023 or newer</option>
            <option value='2022'>2022 or newer</option>
            <option value='2021'>2021 or newer</option>
            <option value='2020'>2020 or newer</option>
        </select>
        <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Mileage</span>
        <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="mileage" id="mileage" onChange={SearchCarsByMileage}>
            <option selected value='all'> -- All -- </option>
            <option value='50000'>Under 50000</option>
            <option value='100000'>50000 - 100000</option>
            <option value='150000'>100000 - 150000</option>
            <option value='200000'>150000 - 200000</option>
            <option value='200001'>Over 200000</option>
        </select>
        <span style={{ marginLeft: '10px', paddingLeft: '10px'}}>Price</span>
        <select style={{ marginLeft: '10px', marginRight: '10px' ,paddingLeft: '10px', borderRadius :'10px'}} name="price" id="price" onChange={SearchCarsByPrice}>
            <option selected value='all'> -- All -- </option>
            <option value='20000'>Under 20000</option>
            <option value='40000'>20000 - 40000</option>
            <option value='60000'>40000 - 60000</option>
            <option value='80000'>60000 - 80000</option>
            <option value='80001'>Over 80000</option>
        </select>

        <button style={{marginLeft: '10px', paddingLeft: '10px'}} onClick={reset}>Reset</button>

        </div>


        <div style={{ marginLeft: '10px', marginRight: '10px' , marginTop: '20px'}} >
            {cars.length === 0 ? (
            <p style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px' }}>{message}</p>
            ) : (
            <div>
                <hr/>
                {cars.map((car) => (
                <div>
                <div key={car._id}>
                    <h3>{car.make} {car.model}</h3>
                    <p>Year: {car.year}</p>
                    <p>Mileage: {car.mileage}</p>
                    <p>Price: {car.price}</p>
                </div>
                <hr/>
                </div>
                )
            )}

            </div>
            )}
        </div>
        </div>
    );
};

export default SearchCars;