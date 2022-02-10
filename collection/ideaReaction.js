module.exports = async (bot, data) => {

  const fs = require("fs");
  const ideas = JSON.parse(fs.readFileSync("./collection/ideas.json"));

  if(!(data.message_id in ideas)) return;

  const embed = {};
  embed.color = 0x25c059;
  const e = { "embeds": [embed] };

  if(["✅", "❌"].includes(data.emoji.name)){

    if(data.user_id != "557260090621558805"){
      await bot.deleteReactionUser(
        data.channel_id,
        data.message_id,
        data.emoji.name,
        data.user_id
      );
      return;
    }

    const plus = await bot.getReactions(
      data.channel_id,
      data.message_id,
      "👍"
    );
    const minus = await bot.getReactions(
      data.channel_id,
      data.message_id,
      "👎"
    );
    const rating = plus.length - minus.length;

    await bot.deleteAllReactions(
      data.channel_id,
      data.message_id
    );

    let text = ideas[data.message_id][0];
    text += "\n**:star: Rating**\n> " + rating;
    text += "\n**:clock3: Status**\n> " + data.emoji.name + " ";
    if(data.emoji.name == "✅")
      text += "Accepted";
    else
      text += "Rejected";

    embed.description = text;
    embed.footer = { "text": "Posted by " + ideas[data.message_id][1] };
    bot.editMessage(data.channel_id, data.message_id, e);
    delete ideas[data.message_id];

  } else return;

  fs.writeFileSync("./collection/ideas.json", JSON.stringify(ideas));

}