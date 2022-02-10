(async () => {

  // requiring without cache
  // made for requiring commands and applying edits without restarting the bot
  function require_(module){
    delete require.cache[require.resolve(module)];
    return require(module);
  }

  const fs = require("fs");
  const token = fs.readFileSync(".token", "UTF-8");

  const ds = require("./lib/ds.js");
  const bot = new ds.Bot(token);

  const me = await bot.user();
  console.log("Logging in as " + me.username + "...");

  const channels = {
    "930227979546673153": "project",
    "930227317912010802": "complain",
    "930226927988523078": "idea"
  };

  bot.events["READY"] = async data => {
    console.log("Bot logged in!");
    bot.setStatus({
      "status" : "online",
      "since" : 0,
      "afk" : false,
      "activities" : [{
        "name" : "in your eyes",
        "type" : 3
      }]
    });

  }

  bot.events["MESSAGE_CREATE"] = async data => {
    if(!(data.channel_id in channels)) return;
    if(me.id == data.author.id) return;
    require_(
      "./collection/channelResponses/" + channels[data.channel_id]
    )(bot, data);
  }

  bot.events["MESSAGE_REACTION_ADD"] = async data => {
    if(channels[data.channel_id] != "idea") return;
    if(me.id == data.user_id) return;
    require_("./collection/ideaReaction")(bot, data);
  }

  bot.events["GUILD_MEMBER_ADD"] = async data => {
    await bot.addUserRole(data.guild_id, data.user.id, "930426100943826987");
  }

  // logging in with intents: members, messages, reactions
  bot.login((1 << 1) + (1 << 9) + (1 << 10));

})();