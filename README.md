# CoroStats
My first discord bot

Basically a bot that fetches covid-19 stats from the worldometers.com/coronavirus website.



<h3>Commands example</h3>

Returns an embedded message with covid-19 stats worldwide<pre>?corona stats</pre>
Returns an embedded message with covid-19 stats in the provided country<pre>?corona stats {country}</pre>

<br/><br/>


The bot might stop functionning correctly if the website got redesigned, it already did many times, but it doesn't take much to get it back up and running.

Definitely not the best bot out there for this kind of thing, but it gets the job done :)

<h2>How to run the bot?</h2>

(Presuming you already have NodeJS and npm installed)

First you'll need to create your own discord bot [here](https://discordapp.com/developers/applications). When you've created the bot add it to your server (might need admin privilege for some misc commands), make sure you copy the token because you'll need it.

Back to our project. After you've cloned this repo and stored it somewhere in your computed, open a cmd and navigate to the project, then run `npm install` which might take a few minutes.

After it's done, go to the .env file and put there the token you copied earlier.

Now you're all set, all you have to do is run `node bot.js` and watch the bot go.
