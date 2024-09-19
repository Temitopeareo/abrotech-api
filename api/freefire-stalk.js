const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { region, uid } = req.query;

  if (!region || !uid) {
    return res.status(400).json({ error: 'Please provide both region and uid' });
  }

  try {
    const url = `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${encodeURIComponent(region)}&uid=${encodeURIComponent(uid)}`;
    
    console.log('Fetching URL:', url); // Log the URL being fetched

    const response = await fetch(url);
    console.log('Response Status:', response.status); // Log response status
    
    if (!response.ok) {
      const errorBody = await response.text(); // Read error response as text
      console.error('Error Response Body:', errorBody); // Log the error response body
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched Data:', data); // Log the fetched data

    return res.json({
      nickname: data.basicInfo.nickname,
    });
  } catch (error) {
    console.error('Failed to fetch player data:', error); // Log full error object
    return res.status(500).json({ error: 'Failed to fetch player data', details: error.message });
  }
};
