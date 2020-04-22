module.exports =  {
    convertEpochToDate: async function(epoch) {
        new Date(epoch * 1000).toString();
    },
};