const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { region, uid } = req.query;

  // Validate that both region and uid are provided
  if (!region || !uid) {
    return res.status(400).json({ error: 'Please provide both region and uid' });
  }

  try {
    // Construct the URL with the provided query parameters
    const url = `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${encodeURIComponent(region)}&uid=${encodeURIComponent(uid)}`;
    
    console.log('Fetching URL:', url); // Log the URL being fetched

    // Fetch data from the external API
    const response = await fetch(url);
    
    // Log the response status
    console.log('Response Status:', response.status);
    
    // Check if the response is successful
    if (!response.ok) {
      const errorBody = await response.text(); // Get error details
      console.error('Error Response Body:', errorBody);
      return res.status(response.status).json({ error: 'API responded with an error', details: errorBody });
    }

    // Send the external API response as-is
    const data = await response.json();
    return res.status(200).json({
                    success: true,
                    Creator: 'ABRO TECH',
                    Contact: 'wa.me/2348100151048',
                    playerInfo: {
freefireUserId: data.basicInfo.accountId,
playerName: data.basicInfo.nickname,
playerLevel: data.basicInfo.level,
"likes: data.basicInfo.liked,
playerRegion: data.basicInfo.region,
playerBio: data.socialInfo.signature
},
petInfo: {
petName: data.petInfo.name,
petLevel: data.petInfo.liked
},
guildInfo: {
guildId: data.clanBasicInfo.clanId,
guildName: data.clanBasicInfo.clanName,
guildLevel: data.clanBasicInfo.clanLevel,
guildMem: data.clanBasicInfo.memberNum,
guildLeader: data.captainBasicInfo.nickname,
guildLeaderId: data.captainBasicInfo.accountId,
guildLeaderLevel: data.captainBasicInfo.level,
guildLeaderLikes: data.captainBasicInfo.liked
}
        });
  } catch (error) {
    // Log the error and send an error response
    console.error('Failed to fetch player data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch player data', details: error.message });
  }
};
