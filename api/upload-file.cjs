const FormData = require('form-data');
const Readable = require('stream');
const fetch = require('node-fetch');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
//      form.append('userhash', '3dd217ecb3ee790b1be6aff01'); // Replace with actual userhash if needed

      // Get the filename from the headers or use a default name
      const fileName = req.headers['x-file-name'] || 'default_file';

      // Read the file from the request
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });

      // Add the file to the form with the correct file name
      form.append('fileToUpload', Readable.from(buffer), { filename: fileName });

      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const url = await response.text(); // The response is expected to be a URL

      // Send back the Catbox URL as the response with additional fields
      res.status(200).json({
        success: true,
        Creator: "ABRO TECH",
        Contact: "wa.me/2348100151048",
        url: url.trim(),  // Use the URL directly from the Catbox response
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({ success: false, message: 'Failed to upload file to Catbox' });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
