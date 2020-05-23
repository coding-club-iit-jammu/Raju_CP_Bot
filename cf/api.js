const fetch = require("node-fetch");
const api_module = require('./constants');
const API = api_module.API;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    /**
     * https://codeforces.com/apiHelp/methods#user.status
     * @param {handle, from, count, tout}  
     */
    get_user_status: async function(handle, from, count, tout) {
        // perform fetch only after timout ms
        await timeout(tout);
        try {
            const response = await fetch(API.user_status + handle + "&from=" + from 
                                    + "&count=" + count);
            const json = response.json();
            return json;
        } catch (error) {
            console.log(error);
        }
    },

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
        try {
            const response = await fetch(API.problem + tags);
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    },
    /**
    * https://leetcode.com/api/problems/algorithms/
    */
    get_problem_leetcode: async function() {
        try {
            const response = await fetch(API.leetcode);
            const json = await response.json();
            // console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    },

}