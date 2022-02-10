module.exports = async (bot, message) => {

  const name = message.member.nick ?? message.author.username;
  const content = message.content;

  const embed = {};
  embed.color = 0x25c059;
  const e = { "embeds": [embed] };


  async function format(er){
    await bot.deleteMessage(message.channel_id, message.id);
    embed.description = er;
    const m = await bot.sendMessage(message.channel_id, e);
    setTimeout(async () => {
      await bot.deleteMessage(m.channel_id, m.id);
    }, 5000);
  }

  const links = message.attachments.map(
    a => "[" + a.content_type.split("/")[0] + "](" + a.url + ")"
  ).join(", ");

  if(!links){
    format("Wrong format! No attachments!");
    return;
  }

  const all = message.content.split("\n");
  const header = all[0]?.trim();
  const desc = all.slice(1).join("\n").trim();

  if(!header){
    format("Wrong format! No header!");
    return;
  }
  if(!desc){
    format("Wrong format! No description!");
    return;
  }

  const text = "**:scroll: " + header + "**\n> " +
               desc.split("\n").join("\n> ") +
               "\n**:frame_photo: Attachments**\n" +
               links;

  embed.description = text;
  embed.footer = { "text": "Posted by " + name };

  await bot.deleteMessage(message.channel_id, message.id);
  const m = await bot.sendMessage(message.channel_id, e);

}