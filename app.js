// imports/initializations
const {Client, Intents, Interaction} = require('discord.js');
const { readFile, readSync } = require('fs');
const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const fs = require('fs');
const express = require('express');
const app = express();
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const config = require("./config.json");


// handle slash commands (right now only /joke)
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName == 'joke') {
        var joke = "failed";
        let index = Math.floor(Math.random() * 204);
        let data = fs.readFileSync('./jokes.json');
        let jokes = JSON.parse(data).jokes;
        joke = jokes[index];
        interaction.reply(joke);
    }
})

// handle messages
client.on("messageCreate", async message => {
    if (message.author.bot == false) {
        let lowerString = message.content.toLowerCase();
        let string = message.content;
        console.log(message.author.username + ": " + string);
        let erorCount = 0;
        let erorLocations = [];
        let index = 0;

        /**
         * Begin er/or detection
        */

        // count er's and or's
        while (lowerString != "") {
            if (lowerString.length > 1) {
                if (lowerString.startsWith("er") 
                    || lowerString.startsWith("or")) {
                    erorCount++;
                }
            }
            lowerString = lowerString.substring(1);
        }

        // find er and or locations
        lowerString = message.content.toLowerCase();
        while (erorCount != 0) {
            if ((lowerString.charAt(index) == 'e' 
                || lowerString.charAt(index) == 'o') 
                && lowerString.charAt(index + 1) == 'r') {
                if (index != 0) {
                    if (lowerString.charAt(index - 1) != ' ') {
                        if (index <= lowerString.length - 3) {
                            if (lowerString.charAt(index + 2) == ' ') {
                                erorLocations.push(index);
                                erorCount--;
                            } else {
                                erorCount--;
                            }
                        } else {
                            erorLocations.push(index);
                            erorCount--;
                        }
                    } else {
                        erorCount--;
                    }
                } else {
                    erorCount--;
                }
            }
            index++;
        }
        // find full er/or words
        let outstring = "";
        while (erorLocations.length > 0) {
            let location = erorLocations.pop();
            let spaceIndex = location;
            while (string[spaceIndex] != ' ' && spaceIndex >= 0) {
                spaceIndex--;
            }
            let word = string.substring(spaceIndex + 1, location + 2);
            // don't output if the matched word is for. that is obnoxious
            if (word != 'for') {
                outstring += word + "? I barely know her!\n";
            }
        }
        if (outstring.length > 0) {
            outstring = outstring.substring(0, outstring.length - 1);
            await message.reply(outstring)
		        .catch(e => {
			        console.log(e);
		        });
        }

        /**
         * Begin I'm detection
         */
        string = message.content;
        for (let i = 0; i < string.length; i++) {
            // replace weird ios characters with normal characters
            if (string.charCodeAt(i) == 8217) {
                string = string.substring(0, i) + "'" + string.substring(i + 1, string.length);
            } else if (string.charAt(i) == "\"") {
                string = string.substring(0, i) + "''" + string.substring(i + 1, string.length);
            } else if (string.charCodeAt(i) == 8221) {
                string = string.substring(0, i) + "''" + string.substring(i + 1, string.length);
            } else if (string.charAt(i) == "`") {
                string = string.substring(0, i) + "'" + string.substring(i + 1, string.length);
            }
        }

        // remove double-single quotes
        while (string.indexOf('\'\'') >= 0) {
            string = string.substring(0, string.indexOf('\'\'')) + string.substring(string.indexOf('\'\'') + 1);
        }

        // detect I'm and other variations
        index = 0;
        while (string.length > 1) {
            let lowerString = string.toLowerCase();
            if (lowerString.startsWith("i'm")
                || lowerString.startsWith("im") 
                || lowerString.startsWith("i am")) {
                    if (lowerString.startsWith("im")) {
                        if (string.length > 2) {
                            if (string.charAt(2) == " ") {
                                let match = false;
                                if (index != 0) {
                                    let letter = message.content.charAt(index - 1).toLowerCase();
                                    if (letter.charCodeAt(0) >= 97 
                                        && letter.charCodeAt(0) <= 122) {
                                            string = string.substring(1);
                                            index++;
                                    } else {
                                        match = true;
                                    }
                                } else {
                                    match = true;
                                }
                                if (match == true) {
                                    let outString = "";
                                    string  = string.substring(2);
                                    while (string.charAt(0) != '.' 
                                        && string.charAt(0) != ',' 
                                        && string.charAt(0) != '?' 
                                        && string.charAt(0) != "!" 
                                        && string != "") {
                                        outString += string.charAt(0);
                                        if (string.length != 1) {
                                            string = string.substring(1);
                                        } else {
                                            break;
                                        }
                                    }
                                    await message.reply("Hi" + outString + "! I'm Dad Bot!")
                                        .catch(e => {
                                            console.log(e);
                                        });
                                    return;
                                }
                            } else {
                                string = string.substring(1);
                                index++;
                            }
                        } else {
                            let match = false;
                            let letter = message.content.charAt(index - 1).toLowerCase();
                            if (letter.charCodeAt(0) >= 97 
                                && letter.charCodeAt(0) <= 122) {
                                    string = string.substring(1);
                                    index++;
                            } else {
                                match = true;
                            }
                            if (match == true) {
                                await message.reply("Hi ! I'm Dad Bot!")
                                    .catch(e => {
                                        console.log(e);
                                    });
                                return;
                            } else {
                                string = string.substring(1);
                                index++;
                            }
                        }
                    } else {
                        if (string.charAt(2) == 'm' 
                        || string.charAt(2) == 'M') {
                            if (string.length == 3) {
                                await message.reply("Hi ! I'm Dad Bot!")
                                    .catch(e => {
                                        console.log(e);
                                    });
                                return;
                            }
                            string = string.substring(3);
                        } else {
                            if (string.length == 4) {
                                await message.reply("Hi ! I'm Dad Bot!")
                                    .catch(e => {
                                        console.log(e);
                                    });
                                return;
                            }
                            string = string.substring(4);
                        }
                        let outString = "";
                        while (string.charAt(0) != '.' 
                            && string.charAt(0) != ',' 
                            && string.charAt(0) != '?' 
                            && string.charAt(0) != "!" 
                            && string != "") {
                            outString += string.charAt(0);
                            if (string.length != 1) {
                                string = string.substring(1);
                            } else {
                                break;
                            }
                        }
                        await message.reply("Hi" + outString + "! I'm Dad Bot!")
                            .catch(e => {
                                console.log(e);
                            });
                        return;
                    }
            } else {
                string = string.substring(1);
                index++;
            }
        }
    }
});

// HTTP GET endpoint that can be used to tell if the bot is online
app.get('/', (req, res) => {
    res.send("Alive");
})

// start HTTP server
app.listen(process.env.PORT || 8081, () => {
    console.log("Started listening");
})

// bot login
client.login(config.token);
