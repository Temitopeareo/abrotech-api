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

    return res.json({
      nickname: data.basicInfo.nickname,
        });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch player data' });
  }
};
