const axios = require('axios');
const API = 'https://api19covid.herokuapp.com';



const countriesArray = async () => {
    console.log("fetching the data...");
    try {
        const res = await axios.get(`${API}/countries`);
        return res.data.countries;
    }
    catch (error) {
        console.log(`Fetching countries array failed: ${error}`);
        return [];
    }
    
}

const getData = async () => {
    try {
        const res = await axios.get(API);
        return res.data;
    } 
    catch (error) {
        console.log(`Fetching world data failed: ${error}`);
        return {};
    }
}

const getCountryData = async country => {
    try {
        const res = await axios.get(`${API}/${country}`);
        return res.data;
    } 
    catch (error) {
        console.log(`Fetching country data failed: ${error}`);
        return {};
    }
}

const mapCountriesData = async () => {
    try {
        const res = await axios.get(`${API}/map`);
        const map = new Map(res.data);
        return map;    
    } 
    catch (error) {
        console.log(`Fetching mapped countries data failed: ${error}`);
        return new Map();
    }
}

const getNewCasesArray = async oldData => {
    return new Promise(async resolve => {
        const newData = await mapCountriesData(); 
        const ChangedCases = new Map();
        for(let [key, value] of oldData)
        {
            var newValue = newData.get(key);
            if(parseInt(newValue[0].replace(/,/g, "")) > parseInt(value[0].replace(/,/g, "")))
                ChangedCases.set(key, `${(parseInt(newValue[0].replace(/,/g, "")) - parseInt(value[0].replace(/,/g, ""))).toString()} new case(s)`);
            
            if(parseInt(newValue[1].replace(/,/g, "")) > parseInt(value[1].replace(/,/g, "")))
                ChangedCases.set(key, `${(parseInt(newValue[1].replace(/,/g, "")) - parseInt(value[1].replace(/,/g, ""))).toString()} new death(s)`);
            
            if(parseInt(newValue[2].replace(/,/g, "")) > parseInt(value[2].replace(/,/g, "")))
                ChangedCases.set(key, `${(parseInt(newValue[2].replace(/,/g, "")) - parseInt(value[2].replace(/,/g, ""))).toString()} new recovery(ies)`);
        } 
        resolve(ChangedCases);
    });
}

module.exports = {
    countriesArray,
    getData,
    getCountryData,
    getNewCasesArray,
    mapCountriesData
}