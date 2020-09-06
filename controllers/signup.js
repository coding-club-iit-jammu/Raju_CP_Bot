const User = require('../models/user');

exports.findUser = async (discordId) => {
    let check = await User.findOne({discordId: discordId});
    return check;
}

exports.createUser = async (name, discordId, cfHandle) =>{
    let check = await User.findOne({discordId:discordId});
    if(check){
        return "User already registered!";
    }
    const user = new User({
        name: name,
        discordId: discordId,
        cfHandle: cfHandle
    });
    user.save().then((result)=>{
        if(result){
            return "User Added Successfully.";
        } else {
            return "Error occurred while adding user.";
        }
    }).catch((error)=>{
        let msg = (error.message) ? error.message : "Error occured.";
        return "Error occurred.";
    })
    return "User Added Successfully.";
}