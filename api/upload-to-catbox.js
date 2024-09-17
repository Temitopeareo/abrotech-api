const FormData = require('form-data');
const { Readable } = require('stream');
const fetch = require('node-fetch');

// Your Catbox userhash
const CATBOX_USERHASH = '3dd217ecb3ee790b1be6aff01'; 

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('userhash', CATBOX_USERHASH);

      // Read the file from the request
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });

      // Add the file to the form
      form.append('fileToUpload', Readable.from(buffer), { filename: 'file.jpg' });

      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const data = await response.text(); // Expecting a URL from Catbox

      // Send back the Catbox URL as the response
      res.status(200).json({
        success: true,
        url: data,  // This will be the URL of the uploaded image
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to upload image to Catbox' });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
