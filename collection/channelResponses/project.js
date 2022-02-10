module.exports = async (bot, message) => {

  const fs = require("fs");

  const name = message.member.nick ?? message.author.username;

  const embed = {};
  embed.color = 0x25c059;
  const e = { "embeds": [embed] };

  const all = message.content.split("\n");


  async function format(er){
    await bot.deleteMessage(message.channel_id, message.id);
    embed.description = er;
    const m = await bot.sendMessage(message.channel_id, e);
    setTimeout(async () => {
      await bot.deleteMessage(m.channel_id, m.id);
    }, 5000);
  }

  const ref = message.message_reference?.message_id;
  if(ref){

    const rating = parseInt(all[0]?.trim());
    const comment = all.slice(1).join("\n").trim();

    if(isNaN(rating)){
      format("Wrong format! No rating!");
      return;
    }
    if((rating > 10) || (rating < 0)){
      format("Wrong format! Rating must be from 0 to 10!");
      return;
    }

    const projects = JSON.parse(fs.readFileSync("./collection/projects.json"));


    const d = projects[ref];
    const text = d[0];
    let rate = d[1];
    let com = d[2];
    const was = d[3];
    const author = d[4];

    if(was.includes(message.author.id)){
      format("Error! You have already given a rating!");
      return;
    }

    was.push(message.author.id);
    if(comment){
      com += "\n> " + name + " (" + rating + "): " +
             comment.split("\n").join("\n> ");
    }

    rate += rating;

    embed.description = text + (rate / was.length).toFixed(2) +
                        "\n**:speech_left: Comments**" +
                        (com.length ? com : "\n> None");
    embed.footer = { "text": "Posted by " + author };

    await bot.deleteMessage(message.channel_id, message.id);
    await bot.editMessage(message.channel_id, ref, e);

    projects[ref] = [text, rate, com, was, author];
    fs.writeFileSync("./collection/projects.json", JSON.stringify(projects));

  } else {
    const links = message.attachments.map(
      a => "[" + a.content_type.split("/")[0] + "](" + a.url + ")"
    ).join(", ");

    const header = all[0]?.trim();
    const url = all[1]?.trim();
    const desc = all.slice(2).join("\n").trim();

    if(!header){
      format("Wrong format! No header!");
      return;
    }
    if(!url){
      format("Wrong format! No link!");
      return;
    }
    if(!desc){
      format("Wrong format! No description!");
      return;
    }

    const text = "**:goggles: [" + header + "](" + url + ")**" +
                 (desc.length ? "\n> " : "") +
                 desc.split("\n").join("\n> ") +
                 "\n**:frame_photo: Attachments**\n" +
                 (links.length ? "> " : "> None") + links +
                 "\n**:star: Rating**\n> ";

    embed.description = text + "None\n**:speech_left: Comments**\n> None";
    embed.footer = { "text": "Posted by " + name };

    await bot.deleteMessage(message.channel_id, message.id);
    const m = await bot.sendMessage(message.channel_id, e);

    const projects = JSON.parse(fs.readFileSync("./collection/projects.json"));
    projects[m.id] = [text, 0, "", [], name];
    fs.writeFileSync("./collection/projects.json", JSON.stringify(projects));
  }
}
