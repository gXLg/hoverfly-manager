module.exports = async (bot, message) => {
  const name = message.member.nick ?? message.author.username;
  const content = message.content;

  const links = message.attachments.map(
    a => "[" + a.content_type.split("/")[0] + "](" + a.url + ")"
  ).join(", ");

  const text = "**:bulb: Idea**" +
               (content.length ? "\n> " : "") +
               content.split("\n").join("\n> ") +
               "\n**:frame_photo: Attachments**\n" +
               (links.length ? "> " : "> None") + links;

  const embed = {};
  embed.description = text;
  embed.color = 0x25c059;
  embed.footer = { "text": "Posted by " + name };

  const e = { "embeds": [embed] };

  await bot.deleteMessage(message.channel_id, message.id);
  const m = await bot.sendMessage(message.channel_id, e);
  await bot.react(m.channel_id, m.id, "✅");
  await bot.react(m.channel_id, m.id, "👍");
  await bot.react(m.channel_id, m.id, "👎");
  await bot.react(m.channel_id, m.id, "❌");

  const fs = require("fs");
  const ideas = JSON.parse(fs.readFileSync("./collection/ideas.json"));
  ideas[m.id] = [text, name];
  fs.writeFileSync("./collection/ideas.json", JSON.stringify(ideas));
}
