require('dotenv').config()
//Modules
const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");
const prefix = process.env.prefix
const db = require('quick.db');
const mongoose = require('mongoose');
mongoose.connect(process.env.mongo, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Connected to MongoDB :D'))
const fs = require("fs"); //this package is for reading files and getting their inputs
const { options } = require("superagent");
const client = new Client({
  disableEveryone: true, //disables, that the bot is able to send @everyone
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
}); //creating the client with partials, so you can fetch OLD message

client.commands = new Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Collection(); //an collection for all your command-aliases
const cooldowns = new Collection(); //an collection for cooldown commands of each user
client.categories = fs.readdirSync("./commands/"); //categories

["command"].forEach(handler => {
    require(`./handlers/command`)(client);
}); //this is for command loading in the handler file, one fireing for each cmd
const eventhandler = require("./handlers/events");
eventhandler(client); //this is for event handling

client.on("message", async message => {

   if (message.author.bot) return; // if the message  author is a bot, return aka ignore the inputs
  if (!message.guild) return; //if the message is not in a guild (aka in dms), return aka ignore the inputs
  if (!message.content.startsWith(prefix)) return; //if the message does not starts with the prefix, return, so only commands are fired!

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g); //creating the argumest (each space == 1 arg)
  const cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1

  if (cmd.length === 0) return; //if no cmd, then return
  let command = client.commands.get(cmd); //get the command from the collection
  if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
  if (command) {

    if (!cooldowns.has(command.name)) {
      //if its not in the cooldown, set it too there
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now(); //get the current time
    const timestamps = cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^

    if (timestamps.has(message.author.id)) {
      //if the user is on cooldown
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again

      if (now < expirationTime) {
        //if he is still on cooldown
        const timeLeft = (expirationTime - now) / 1000; //get the lefttime
        return message.channel.send({
       embed: {
         color: "#cd0919",
         author: {
           name:`Please wait ${timeLeft.toFixed(
             1
             )} more second(s) before reusing the ${command.name} command. Cooldown!!`,
           icon_url: message.author.displayAvatarURL({ dynamic:true })
         },
		 footer: {
			 text: "Preventing Bot Abuse",
			 url: client.user.displayAvatarURL()
		 }
         
       }      
     })
      
      }
    } 
    timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
    try {
      command.run(
        client,
        message,
        args,
        message.author,
        args.join(" "),
        prefix
      );
    } catch (error) {
      console.log(error);
      return message.reply(
        "Something went wrong while running the: `" +
          command.name +
          "` command"
      );
    }
  } //if the command is not found send an info msg

    });
    client.login(process.env.token)