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
            value = value.map(x => parseInt(x.replace(/[, ]/g, "")));

            var newValue = newData.get(key).map(x => parseInt(x.replace(/[, ]/g, "")));

            if(newValue[0] > value[0])
                ChangedCases.set(key, `${newValue[0] - value[0]} new case(s)`);
            
            if(newValue[1] > value[1])
                ChangedCases.set(key, `${newValue[1] - value[1]} new death(s)`);
            
            if(newValue[2] > value[2])
                ChangedCases.set(key, `${newValue[2] - value[2]} new recovery(ies)`);
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