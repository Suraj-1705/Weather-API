const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector("[weather-container]");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm = document.querySelector("[dataSearchForm]");

const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");

getfromSessionStorage();
// console.log(switchTab);

function switchTab(newTab) {
    if (newTab !== oldTab) {
        console.log('Entering switchTab function');
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        // Hide all containers
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.remove("active");
        errorContainer.classList.remove("active");

        // Show the corresponding container based on the selected tab
        if (newTab === userTab) {
            getfromSessionStorage();
            errorContainer.classList.remove("active");
        } else if (newTab === searchTab) {
            grantAccessContainer.classList.remove("active");
            
            searchForm.classList.add("active");
        }
    }
}

userTab.addEventListener("click", (event) => {
    switchTab(event.currentTarget);
});

searchTab.addEventListener("click", (event) => {
    switchTab(event.currentTarget);
});




// check if cordinates are present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        // if we wont get local coordinates show grant container
        grantAccessContainer.classList.add("active");
    }
    else{
        grantAccessContainer.classList.remove("active");
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        
    }

}

 async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");



    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data =  await response.json();

        // remove loader
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}



function renderWeatherInfo(weatherInfo){

    //firstly we have to fetch elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // console.log(weatherInfo);

    //fetch values from weatherInfo object and put it UI elements
    // using optional chaining elements(?.)
     cityName.innerText = weatherInfo?.name;
     console.log(weatherInfo?.name);
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    
     desc.innerText = weatherInfo?.weather?.[0]?.description;

     const iconCode = weatherInfo?.weather?.[0]?.icon;
     if(iconCode){
        weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     }
     else{
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.remove("active");
         errorContainer.classList.add("active");
     }
    
     temp.innerText = `${weatherInfo?.main?.temp} °C`;
     console.log(weatherInfo?.main?.temp)
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
     console.log(weatherInfo?.wind?.speed);
     humidity.innerText =`${weatherInfo?.main?.humidity} %`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}`;
}


const grantAccessButton = document.querySelector("[data-grantAccess]");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw show an alert for no geolocation support available


    }
}

function showPosition(position){

    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // to show in UI
    fetchUserWeatherInfo(userCoordinates);
} 

grantAccessButton.addEventListener("click", getLocation);




// search form

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName == "")
        return;
    else
        fetchSearchWeatherInfo(cityName);

})
const errorContainer = document.querySelector(".error-container");
function showError(){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    searchForm.classList.remove("active");
    errorContainer.classList.add("active");

}

 async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch (err){
        loadingScreen.classList.remove("active");
        showError();

    }
}





