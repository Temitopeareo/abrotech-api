const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { region, uid } = req.query;

  if (!region || !uid) {
    return res.status(400).json({ error: 'Please provide region and uid' });
  }

  try {
    const response = await fetch(`https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${region}&uid=${uid}`);
    const data = await response.json();

    // Filter out only the fields you want to display
    const filteredData = {
      "userinfoabro": {
        accountId: data.basicInfo.accountId,
        nickname: data.basicInfo.nickname,
        region: data.basicInfo.region,
        level: data.basicInfo.level,
        exp: data.basicInfo.exp,
        badgeCount: data.basicInfo.badgeCnt,
        liked: data.basicInfo.liked,
      },
      "claninfoabro": {
        clanId: data.clanBasicInfo.clanId,
        clanName: data.clanBasicInfo.clanName,
        leaderId: data.clanBasicInfo.captainId,
        clanLevel: data.clanBasicInfo.clanLevel,
        numberofmem: data.clanBasicInfo.memberNum,
      },
      "leaderInfo": {
        LeaderId: data.captainBasicInfo.accountId,
        LeaderNick: data.captainBasicInfo.nickname,
        LeaderLevel: data.captainBasicInfo.level,
        LeaderLikes: data.captainBasicInfo.liked,
      },
      "petinfoabro": {
        petName: data.petInfo.name,
        petLevel: data.petInfo.level,
      },
      "extrainfoabro": {
        userAbout: data.socialInfo.signature,
        HonourScore: data.creditScoreInfo.creditScore,
      }
    };

    return res.json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch player data' });
  }
};
