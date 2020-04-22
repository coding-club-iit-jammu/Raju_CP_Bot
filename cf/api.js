const fetch = require("node-fetch");
const api_module = require('./constants');
const API = api_module.API;

module.exports = {
    /**
     * http://codeforces.com/api/help/methods#user.info
     * @param {array<string>} handles user handles
     */
    get_user: async function(handles) {
        const params = handles.join(';');
        try {
            const response = await fetch(API.user + params);
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    },
}