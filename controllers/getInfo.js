const User = require('../models/user');

exports.getUser = async (discordId) =>{
    let check = await User.findOne({discordId:discordId});
    if(check){
        return check;
    }
    return "You do not exist in our records! Please use the command !user-add.";
}

exports.getAllUsers = async () => {
    let users = await User.find();
    let list_of_users = [];
    for (const user of users) {
        let cur_user = {
            'name': user.name,
            'handle': user.cfHandle
        }
        list_of_users.push(cur_user);
    }
    return list_of_users;
}