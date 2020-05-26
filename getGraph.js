const fs = require('fs');
const axios = require("axios");
const chartExporter = require("highcharts-export-server");

const API = "http://api19covid.herokuapp.com/daily";

const CasesGraph = async (oldMessage, channel, MessageAttachment) => {
    console.log("scraping data...");
    const response = await axios.get(API);
    console.log("data scraped, now parsing...");
    const rawData = response.data.dailyData;
    const casesData = rawData.map(daily => {
        return {
            y: daily.confirmed,
            x: daily.date
        }
    });
    const deathsData = rawData.map(daily => {
        return {
            y: daily.deaths,
            x: daily.date
        }
    });
    console.log("creating chart...");

    chartExporter.initPool();

    const chartDetails = {
        type: "png",
        options: {
             chart: {
                 type: "line"
             },
             title: {
                 text: "Infected/Deaths Graph"
             },
             xAxis: {
                 type: 'datetime',
                 labels: {
                     formatter: function() {
                         return Highcharts.dateFormat('%b/%e/%Y', this.value);
                     }
                 }
             },
             legend: {
                 layout: 'vertical'
             },
             plotOptions: {
                 series: {
                     label: {
                         connectorAllowed: false
                     }
                 }
             },
             series: [
                 {
                     name: "Number of deaths",
                     color: '#FF0000',
                     data: deathsData
                     ,type: 'line',
                     marker: {
                         enabled: false
                     }
                 },
                 {
                    name: "Number of infected",
                    color: '#0000FF',
                    data: casesData
                    ,type: 'line',
                    marker: {
                        enabled: false
                    }
                }
             ]
        }
     };

     chartExporter.export(chartDetails, (err, res) => {
        // Get the image data (base64)
        // if(oldMessage.deletable) oldMessage.delete();

        // channel.send("", new MessageAttachment(res.data));
        // Filename of the output
        // let outputFile = "bar.png";
        // Save the image to file
        // console.log("saving chart...");
        if(oldMessage.deletable) oldMessage.delete();

        const att = new MessageAttachment(Buffer(res.data, 'base64'));
        console.log("chart created now sending...");
        channel.send("", att);
        console.log("chart sent");

        // fs.writeFile("code.txt", res.data, err => {
        //     if(err) console.log(err);
        //     else console.log("gud");
        // });

        // console.log(new Buffer(res.data, 'base64'));

        // fs.writeFile('test.jpg', Buffer(res.data, 'base64'), err => {chartExporter.killPool();});
        
        
     });     
        
}

module.exports = CasesGraph;