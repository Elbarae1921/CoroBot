const { Client, MessageEmbed } = require('discord.js');
const { config } = require("dotenv");

const rp = require("request-promise");
const $ = require("cheerio");

const Corona = require("./scrapeData");

const client = new Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
});

var oldData;

Corona.getOldData().then(data => {
    oldData = data;
});

const dataListener = async () => {
    console.log(oldData);
    var changedCases = await Corona.getNewCasesArray(oldData);
    var guild = client.guilds.cache.get('688106273467662438');
    var channel = guild.channels.cache.get('689207932927213579');
    var changed = false;
    for (let [key, value] of changedCases) {
        changed = true;
        channel.send(new MessageEmbed()
            .setTimestamp()
            .setColor(guild.me.displayHexColor)
            .setFooter("worldometers.info", client.user.displayAvatarURL)
            .setDescription(`${value} new case(s) in ${key}`)
        );
    }
    if (changed)
        oldData = await Corona.getOldData();
}

client.on("ready", () => {

    client.user.setPresence({
        activity: {
            name: "Coronavirus spread throughout the world lmao",
            type: "WATCHING"
        }
    });

    console.log(`I'm online, and my name is ${client.user.username}`);

    setInterval(() => {
        var guild = client.guilds.cache.get('688106273467662438');
        guild.channels.cache.get('688106274323431451').send("A daily reminder that Safwane is gay");
    }, 1000 * 60 * 60 * 24);

    setInterval(dataListener, 1000 * 60 * 2);
});

client.on("message", async message => {
    const prefix = "?";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") {
        const msg = await message.channel.send("🏓 Pinging...");

        msg.edit(`🏓 pong \`${Math.floor(msg.createdAt - message.createdAt)}ms\``);
    }

    if (cmd == "whoisgay") {
        message.channel.send(`<@217359303286325249>`);
    }

    if (cmd == "say") {
        if (message.deletable) message.delete();

        if (args.length < 1) return message.reply("Nothing to say?").then(m => m.delete({ timeout: 5000 }));

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setAuthor(message.author.username, message.author.avatarURL());

            message.channel.send(embed);
        }
        else {
            message.channel.send(args.join(" "));
        }
    }

    if (cmd === "corona") {

        if(args[0] === "whatis") {
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`What is coronavirus?`)
                .setTimestamp()
                .setFooter("wikipedia.org", client.user.displayAvatarURL)
                .setDescription("Coronaviruses are a group of related viruses that cause diseases in mammals and birds. In humans, coronaviruses cause respiratory tract infections that can be mild, such as some cases of the common cold (among other possible causes, predominantly rhinoviruses), and others that can be lethal, such as SARS, MERS, and COVID-19. Symptoms in other species vary: in chickens, they cause an upper respiratory tract disease, while in cows and pigs they cause diarrhea. There are yet to be vaccines or antiviral drugs to prevent or treat human coronavirus infections.")
            message.channel.send(reply);
        }
        else if(args[0] === "symptoms") {
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`Watch for symptoms`)
                .setTimestamp()
                .setFooter("cdc.gov", client.user.displayAvatarURL)
                .setDescription("Reported illnesses have ranged from mild symptoms to severe illness and death for confirmed coronavirus disease 2019 (COVID-19) cases.")
                .addField("The following symptoms may appear 2-14 days after exposure.", ">>> Fever\nCough\nShortness of breath");
            message.channel.send(reply);
        }
        else if(args[0] === "prevent") {
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`Take steps to protect yourself`)
                .setTimestamp()
                .setFooter("cdc.gov", client.user.displayAvatarURL)
                .setDescription("The best way to prevent illness is to avoid being exposed to this virus.")
                .addFields({ name: "Clean your hands often", value: ">>> **Wash your hands** often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing.\nIf soap and water are not readily available, **use a hand sanitizer that contains at least 60% alcohol**. Cover all surfaces of your hands and rub them together until they feel dry.\n**Avoid touching your eyes, nose, and mouth** with unwashed hands."}, {name: "Avoid close contact", value: ">>> **Avoid close contact** with people who are sick.\n**Put distance between yourself and other people** if COVID-19 is spreading in your community. This is especially important for people who are at higher risk of getting very sick."});
            message.channel.send(reply);
        }
        else if(args[0] === "cure") {
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`COVID-19 treatments?`)
                .setTimestamp()
                .setFooter("who.int", client.user.displayAvatarURL)
                .setDescription("There is no specific medicine to prevent or treat coronavirus disease (COVID-19). People may need supportive care to help them breathe.")
            message.channel.send(reply);
        }
        else if(args[0] === "stats")
        {
            if(args.length > 1) {
                const countries = await Corona.countriesArray();
                console.log(countries);

                if (countries.includes(args[1])) {
                    const data = await Corona.getCountryDataArray(args[1]);
                    var cases = data[0].replace(/ /g, "") == " " ? "" : `> ${data[0]}`;
                    cases += data[1].replace(/ /g, "") == "" ? " " : ` (${data[1]})`;
                    var deaths = data[2].replace(/ /g, "") == " " ? "" : `> ${data[2]}`;
                    deaths += data[3].replace(/ /g, "") == "" ? " " : ` (${data[3]})`;
                    var recovered = data[4].replace(/ /g, "") == " " ? "" : `> ${data[4]}`;
                    var active = data[5].replace(/ /g, "") == "" ? " " : `> ${data[5]}`;
                    var serious = data[6].replace(/ /g, "") == "" ? " " : `> ${data[6]}`;
                    const reply = new MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`Coronavirus stats in ${args[1]}`)
                        .setTimestamp()
                        .setFooter("worldometers.info", client.user.displayAvatarURL)
                        .addFields([{ name: "Total Cases:", value: cases }, { name: "Total Deaths:", value: deaths }, { name: "Total Recovered:", value: recovered }, { name: "Active Cases:", value: active }, { name: "Serious/Critical Cases:", value: serious }]);
                    message.channel.send(reply);
                }
                else {
                    message.reply("either that country is safe, or it doesn't exist 🤔");
                }
            }
            else {
                const data = await Corona.getDataArray();
                const reply = new MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setTitle("Coronavirus stats worldwide")
                    .setTimestamp()
                    .setFooter("worldometers.info", client.user.displayAvatarURL)
                    .addFields([{ name: "Coronavirus Cases:", value: "> "+data[0] }, { name: "Deaths:", value: "> "+data[1] }, { name: "Recovered:", value: "> "+data[2] }]);
                message.channel.send(reply);
            }
        }
        else {
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle("Coronavirus command")
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL)
                .addFields([{ name: "?corona", value: "shows help on how to use the command" }, { name: "?corona whatis", value: "what is coronavirus?" }, { name: "?corona symptoms", value: "a list of possible symptoms" }, { name: "?corona prevent", value: "how to prevent the covid-19" }, { name: "?corona cure", value: "news about the covid-19 cure" }, { name: "?corona stats", value: "covid-19 statistics (cases/deaths/recoveries) worldwide" }, { name: "?corona stats [country]", value: "detailed statistics on the covid-19 spreading in the given country" }]);
            message.channel.send(reply);
        }

        /*const countries = await Corona.countriesArray();
        console.log(countries);

        if (countries.includes(args[0])) {
            const data = await Corona.getCountryDataArray(args[0]);
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle(`Coronavirus stats in ${args[0]}`)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL)
                .addFields([{ name: "Total Cases:", value: `${data[0]} (${data[1]})` }, { name: "Total Deaths:", value: `${data[2]} (${data[3]})` }, { name: "Total Recovered:", value: data[4] }, { name: "Active Cases:", value: data[5] }, { name: "Serious/Critical Cases:", value: data[6] }]);
            message.channel.send(reply);
        }
        else {
            message.reply("either that country is safe, or it doesn't exist 🤔");
        }
        const data = await Corona.getDataArray();
            const reply = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setTitle("Coronavirus stats worldwide")
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL)
                .addFields([{ name: "Coronavirus Cases:", value: data[0] }, { name: "Deaths:", value: data[1] }, { name: "Recovered:", value: data[2] }]);
            message.channel.send(reply);*/
    }

    if (cmd === "help") {        
        const help = new MessageEmbed()
            .setColor()
            .setTitle("CoroBot commands")
            .setFooter(client.user.username, client.user.displayAvatarURL)
            .setAuthor(client.user.username, client.user.avatarURL())
            .addFields(
                {name: "?ping", value: "checks bot responsivness"},
                {name: "?say (embed) [text to say]", value: "tells the bot what text to say, embed is optional"},
                {name: "?corona", value: "type ?corona for more information on the command"}
            );
        message.channel.send(help);
    }
});

client.login(process.env.TOKEN);