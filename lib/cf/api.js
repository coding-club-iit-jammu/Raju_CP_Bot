const fetch = require("node-fetch");
const apiModule = require("./constants");
const API = apiModule.API;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  /**
   * https://codeforces.com/apiHelp/methods#user.status
   * @param {handle, from, count, timeOut}
   */
  getUserStatus: async function (handle, from, count, timeOut) {
    // perform fetch only after timout ms
    await timeout(timeOut);
    try {
      const response = await fetch(
        API.user_status + handle + "&from=" + from + "&count=" + count
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * https://codeforces.com/apiHelp/methods#user.rating
   * @param {handle}
   */
  getUserRating: async function (handle) {
    try {
      const response = await fetch(API.user_rating + handle);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * https://codeforces.com/api/help/methods#user.info
   * @param {array<string>} handles user handles
   */
  getUser: async function (handles) {
    const params = handles.join(";");
    try {
      const response = await fetch(API.user + params);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * https://codeforces.com/api/help/methods#contest.list
   */
  getContests: async function () {
    try {
      const response = await fetch(API.contest);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * https://codeforces.com/api/help/methods#problemset.problems
   * @param {array<string>} tags problem tags
   */
  getCfProblem: async function (tags) {
    try {
      const response = await fetch(API.problem + tags);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },
};
