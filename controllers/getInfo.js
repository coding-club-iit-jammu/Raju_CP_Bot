const User = require('../models/user');

exports.getUser = async (discordId) =>{
    let check = await User.findOne({discordId:discordId});
    if(check){
        return check;
    }
    return "You do not exist in our records! Please use the command !user-add.";
}