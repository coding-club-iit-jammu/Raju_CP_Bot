const fetch = require("node-fetch");
const apiModule = require("./constants");
const API = apiModule.API;

module.exports = {
  /**
   * https://leetcode.com/api/problems/algorithms/
   */
  getLeetcodeProblems: async function () {
    try {
      const response = await fetch(API.problems);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
    }
  },
};
