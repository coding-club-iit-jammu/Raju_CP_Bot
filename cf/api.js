const fetch = require("node-fetch");
const api_module = require('./constants');
const API = api_module.API;

module.exports = {
    /**
     * https://codeforces.com/api/help/methods#user.info
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
    /**
     * https://codeforces.com/api/help/methods#contest.list
     */
    get_contest: async function() {
        try {
            const response = await fetch(API.contest);
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * https://codeforces.com/api/help/methods#problemset.problems
     * @param {array<string>} tags problem tags
     */
    get_problem: async function(tags) {
        let params = "";
        if (tags.length) {
            params = tags.split(' ').join(';');
        }
        try {
            const response = await fetch(API.problem + params);
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    },
}