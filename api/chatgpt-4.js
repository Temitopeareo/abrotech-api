const { G4F } = require('g4f');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
require('dotenv').config();

const g4f = new G4F();
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const configPath = path.resolve(__dirname, '../api-keys.json');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, apikey } = req.query;

  if (!apikey || !q) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  let apiKeyConfig;
  try {
    const configData = await readFile(configPath, 'utf8');
    const apiKeys = JSON.parse(configData);

    if (!(apikey in apiKeys)) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    apiKeyConfig = apiKeys[apikey];
    const currentTime = Date.now();

    if (apiKeyConfig.limit !== Infinity) {
      if (apiKeyConfig.requestCount >= apiKeyConfig.limit) {
        if (currentTime - apiKeyConfig.resetTime > 24 * 60 * 60 * 1000) {
          // Reset daily count
          apiKeyConfig.requestCount = 0;
          apiKeyConfig.resetTime = currentTime;
        } else {
          return res.status(429).json({ error: 'Request limit exceeded' });
        }
      }
    }

    // Update request count for this key
    apiKeyConfig.requestCount += 1;
    apiKeyConfig.resetTime = currentTime;
    await writeFile(configPath, JSON.stringify(apiKeys, null, 2));

    const g4fInstance = new G4F({ apiKey: process.env[`API_KEY_${apikey.toUpperCase()}`] });

    const messages = [
      { role: 'system', content: 'You\'re an expert bot in poetry.' },
      { role: 'user', content: q },
    ];

    const options = {
      model: 'gpt-4',
      debug: true,
      retry: {
        times: 3,
        condition: (text) => {
          const words = text.split(' ');
          return words.length > 10;
        },
      },
      output: (text) => {
        return text + ' 💕🌹';
      },
    };

    try {
      const text = await g4fInstance.chatCompletion(messages, options);
      res.status(200).json({ reply: text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading API keys configuration' });
  }
};
