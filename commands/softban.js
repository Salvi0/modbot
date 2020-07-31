const util = require('../lib/util.js');

exports.command = async (message, args, database, bot) => {
  if(!await util.isMod(message.member) && !message.member.hasPermission('KICK_MEMBERS')) {
    await message.react(util.icons.error);
    return;
  }

  let userId = util.userMentionToId(args.shift());
  if (!userId) {
    await message.react(util.icons.error);
    await message.channel.send("Please provide a user (@Mention or ID)!");
    return;
  }
  let member = await message.guild.members.fetch(userId);

  if (!member) {
    await message.react(util.icons.error);
    await message.channel.send("User not found or not in guild!");
    return;
  }

  if (member.user.bot) {
    await message.react(util.icons.error);
    await message.channel.send("You cant interact with bots!");
    return;
  }

  //highest role check
  if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0 || await util.isMod(member)){
    await message.react(util.icons.error);
    await message.channel.send("You dont have the Permission to softban that Member!");
    return;
  }

  let reason = args.join(' ') || 'No reason provided.';
  let now = Math.floor(Date.now()/1000);

  let insert = await database.queryAll("INSERT INTO moderations (guildid, userid, action, created, reason, moderator, active) VALUES (?,?,?,?,?,?,?)",[message.guild.id, userId, 'softban', now, reason, message.author.id,false]);

  try {
    await member.send(`You were softbanned from \`${message.guild.name}\` | ${reason}`);
  } catch (e) {
  }
  await message.guild.members.ban(userId,{days: 7, reason: `${message.author.username}#${message.author.discriminator} | `+reason});
  await message.guild.members.unban(userId,`Softban`);

  await util.chatSuccess(message, message, member.user, reason, "softbanned");
  await util.logMessageModeration(message, message, member.user, reason, insert, "Softban");
}

exports.names = ['softban'];