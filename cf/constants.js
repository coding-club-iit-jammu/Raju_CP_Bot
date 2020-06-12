module.exports =  {
    API: {
        user: 'http://codeforces.com/api/user.info?handles=',
        problem: 'https://codeforces.com/api/problemset.problems?tags=',
        contest: 'https://codeforces.com/api/contest.list?gym=false',
        user_status: 'https://codeforces.com/api/user.status?handle=',
        user_rating: 'https://codeforces.com/api/user.rating?handle=',
        leetcode: 'https://leetcode.com/api/problems/algorithms/',
    },
    RANK_COLOR: {
        newbie: [128, 128, 128],
        pupil: [35, 145, 35],
        specialist: [37, 180, 171],
        expert: [0, 0, 255],
        candidate_master: [170, 0, 170],
        master: [255, 140, 0],
        international_master: [255, 140, 0],
        grandmaster: [255, 0, 0],
        international_grandmaster: [255, 0, 0],
        legendary_grandmaster: [255, 0, 0],
        headquarters: [0, 0, 0],
    },
};