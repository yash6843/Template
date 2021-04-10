const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const config = require("../../botconfig/config.json");
const color = require("../../botconfig/colors.json");
const sourcebin = require('sourcebin');
const db = require('quick.db');

module.exports = {    
    name: "ev",
    category: "owner", 
    cooldown: 0, 
    usage: "g!eval",
      description: "Evalutes the Value", 

    
  run: async (client, message, args, user, text, prefix) => {


const notowner = new MessageEmbed()
.setAuthor("Only the bot owner can use this command", message.author.displayAvatarURL())
.setColor("RED")
const owners_id = ["703600921837568080","482212265316188163"];
if (!owners_id.includes(message.author.id))
     return message.channel.send(notowner);  const args2 = message.content.split(" ").slice(1);

    const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    
    try {
      const code = args2.join(" ");
      let evaled = eval(code);
const lmao = message.content.slice("".length).trim().split(/ +/);
lmao.shift().toLowerCase().split(" ")[0]
 const { inspect } = require("util");

if (typeof evaled !== "string") {
                evaled = inspect(evaled, {
                    depth: 0
                });
            }
const output = clean(evaled)

if(output.length > 1024) {
const bin = await sourcebin.create(
    [
        {
            content: output,
            language: 'Javascript',
            name: 'Output'
        },
    ],
    {
        title: 'Output',
        description: `${message.author.tag}`,
    },
);
message.channel.send({
  embed: {
title: "EVALUATION!",
color: "GREEN",
timestamp: new Date(),
fields: [ {
  name: "📥 Input 📥",
  value: `\`\`\`js\n${lmao.join(" ")}\`\`\``
},
{
  name: `📤 Output 📤`,
  value: `[**Output**](${bin.url})`
}
],
footer: {
  text: `${client.user.username} | Output : Success!`,
  icon_url: `${client.user.displayAvatarURL()}`
}
  }
})



} else {
       const eval2 = new MessageEmbed()
       .setTitle("EVALUATION!")
       .setColor("GREEN")
       .addField(":inbox_tray: Input :inbox_tray:", `\`\`\`js\n${lmao.join(" ")}\`\`\``)
       .addField(":outbox_tray: Output :outbox_tray:", `\`\`\`js\n${output}\`\`\``)
       .setFooter(`${client.user.username} | Output : Success!`,` ${client.user.displayAvatarURL()}`)
       .setTimestamp()
      
    // msg.channel.send(clean(evaled));
      message.channel.send(eval2)
}


    } catch (err) {
      const lmao = message.content.slice("".length).trim().split(/ +/);
lmao.shift().toLowerCase().split(" ")[0]
const erur = new MessageEmbed()
       .setTitle("EVALUATION!")
       .setColor("RED")
       .addField(":inbox_tray: Input :inbox_tray:", `\`\`\`js\n${lmao.join(" ")}\`\`\``)
       .addField("📛 Error 📛", ` \`\`\`xl\n${clean(err)}\n\`\`\``)
        .setFooter(`${client.user.username} | Output : Error!`, `${client.user.displayAvatarURL()}`)
       .setTimestamp()
message.channel.send(erur);

    }

}
    
}