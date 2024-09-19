const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Extract query parameters from the request
  const { region, uid } = req.query;

  // Validate that both region and uid are provided
  if (!region || !uid) {
    return res.status(400).json({ error: 'Please provide both region and uid' });
  }

  try {
    // Construct the URL with query parameters
    const url = `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${encodeURIComponent(region)}&uid=${encodeURIComponent(uid)}`;
    
    // Send the GET request to the API
    const response = await fetch(url);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the filtered data
    return res.json({
      nickname: data.basicInfo.nickname,
    });
  } catch (error) {
    // Log and return an error response
    console.error('Failed to fetch player data:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch player data', 
      details: error.message 
    });
  }
};
