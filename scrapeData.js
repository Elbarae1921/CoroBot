const rp = require("request-promise");
const $ = require("cheerio");



const url = "https://www.worldometers.info/coronavirus/";
const selector = "#main_table_countries_today tbody";

const countriesArray = () => {
    return new Promise(resolve => {
        console.log("scraping the page...");
        rp(url)
            .then(html => {
                const data = $(selector, html);
                //console.log(data.get(0).children.filter(x => x.hasOwnProperty('children')).length);
                const countriesData = data.get(0).children.filter(x => x.hasOwnProperty('children')).map(x => {
                    if (!x.children[1].children[0].hasOwnProperty("children")) {
                        return x.children[1].children[0].data.trim();
                    }
                    else {
                        return x.children[1].children[0].children[0].data.trim();
                    }
                });
                console.log("scraping done!");
                resolve(countriesData);
            })
            .catch(err => {
                console.log(err);
            });
    });
    
}

const getDataArray = async () => {
    return new Promise(resolve => {
        const dataArray = [];
        rp(url)
            .then(html => {
                const data = $("#maincounter-wrap span", html);
                dataArray.push(data.get(0).children[0].data.trim());
                dataArray.push(data.get(1).children[0].data.trim());
                dataArray.push(data.get(2).children[0].data.trim());
                resolve(dataArray);
            })
            .catch(err => {
                console.log(err);
            });
    })
    
}

const getCountryDataArray = async country => {
    return new Promise(resolve => {
        rp(url)
            .then(html => {
                const dataArray = [];
                const data = $(selector, html);
                console.log(data.get(0).children.filter(x => x.hasOwnProperty('children')).length);
                const vals = data.get(0).children.filter(x => x.hasOwnProperty('children')).filter(x => {
                    if (!x.children[1].children[0].hasOwnProperty("children")) {
                        if(x.children[1].children[0].data.trim() == country)
                            return true;
                        else
                            return false
                    }
                    else {
                        if(x.children[1].children[0].children[0].data.trim() == country)
                            return true;
                        else
                            return false;
                    }
                });
                //console.log(vals[0].children[11].children[0].data);
                //console.log(`Total Cases : ${vals[0].children[3].children[0].data}\nNew Cases : ${vals[0].children[7].children[0].data}\nTotal Deaths : ${vals[0].children[9].children[0].data}\nNew Deaths : ${vals[0].children[11].children[0].data}\nTotal Recovered ${vals[0].children[13].children[0].data}\nActive Cases : ${vals[0].children[17].children[0].data}\nSerious/Critical Cases : ${vals[0].children[19].children[0].data}`);
                dataArray.push(vals[0].children[3].hasOwnProperty("children") ? vals[0].children[3].children.length > 0 ?  vals[0].children[3].children[0].data : "" : "");
                dataArray.push(vals[0].children[5].hasOwnProperty("children") ? vals[0].children[5].children.length > 0 ?  vals[0].children[5].children[0].data : "" : "");
                dataArray.push(vals[0].children[7].hasOwnProperty("children") ? vals[0].children[7].children.length > 0 ?  vals[0].children[7].children[0].data : "" : "");
                dataArray.push(vals[0].children[9].hasOwnProperty("children") ? vals[0].children[9].children.length > 0 ?  vals[0].children[9].children[0].data : "" : "");
                dataArray.push(vals[0].children[11].hasOwnProperty("children") ? vals[0].children[11].children.length > 0 ?  vals[0].children[11].children[0].data : "" : "");
                dataArray.push(vals[0].children[13].hasOwnProperty("children") ? vals[0].children[13].children.length > 0 ?  vals[0].children[13].children[0].data : "" : "");
                dataArray.push(vals[0].children[15].hasOwnProperty("children") ? vals[0].children[15].children.length > 0 ?  vals[0].children[17].children[0].data : "" : "");
                resolve(dataArray);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const mapCountriesData = async countries => {
    return new Promise(resolve => {
        console.log("scraping the page...");
        rp(url)
            .then(html => {
                const dataMap = new Map();
                const data = $(selector, html);
                var vals = data.get(0).children.filter(x => x.hasOwnProperty('children'));
                var i = 0;
                for(let country of countries)
                {
                    dataMap.set(country, [vals[0].children[13].hasOwnProperty("children") ? vals[0].children[13].children.length > 0 ?  vals[0].children[13].children[0].data : 0 : 0, vals[0].children[7].hasOwnProperty("children") ? vals[0].children[7].children.length > 0 ?  vals[0].children[7].children[0].data : 0 : 0, vals[0].children[11].hasOwnProperty("children") ? vals[0].children[11].children.length > 0 ?  vals[0].children[11].children[0].data : "" : ""]);
                    /*vals[0].children[3].children
                    vals[0].children[7].children
                    vals[0].children[11].children
                    vals[0].children[13].children
                    vals[0].children[15].children*/
                    i++;
                }
                console.log("scraping done!");
                resolve(dataMap);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const getOldData = async () => {
    return new Promise(async resolve => {
        console.log("retrieving the countries...");
        const countries = await countriesArray();
        console.log("countires retrieved!");
        console.log("retrieving countries data...");
        const CollectionArray = await mapCountriesData(countries);
        console.log("data retrieved!");
        resolve(CollectionArray);
    });
}

const getNewCasesArray = async oldData => {
    return new Promise(async resolve => {
        const countries = await countriesArray();
        const newData = await mapCountriesData(countries); 
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
    })
}
getCountryDataArray("Morocco");
module.exports = {
    countriesArray: countriesArray,
    getDataArray: getDataArray,
    getCountryDataArray: getCountryDataArray,
    getOldData: getOldData,
    getNewCasesArray: getNewCasesArray
}