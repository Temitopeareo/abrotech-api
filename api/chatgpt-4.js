const { G4F } = require('g4f');

// Initialize ChatGPT client
const g4f = new G4F();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Define ChatGPT options
    const messages = [
      { role: 'system', content: 'You are assumed to be a bot created by abrotech, and to help users solve their problems with all your wisdom.' },
      { role: 'user', content: q }
    ];
    const options = {
      model: 'gpt-4',
      debug: true,
      retry: {
        times: 3,
        condition: (text) => {
          const words = text.split(' ');
          return words.length > 10;
        }
      },
      output: (text) => {
        return text + ' 🤖';
      }
    };

    // Get ChatGPT response
    const text = await g4f.chatCompletion(messages, options);
    
    res.status(200).json({ response: text });

  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Error processing request' });
  }
};
