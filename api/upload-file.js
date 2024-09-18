const FormData = require('form-data');
const fs = require('fs'); // Ensure to import 'fs' for file operations
const fetch = require('node-fetch');
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {

        // Create a new FormData instance and append the file
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('userhash', '3dd217ecb3ee790b1be6aff01');
        formData.append('fileToUpload', req.file.buffer, req.file.originalname);

        // Send POST request to Catbox API
        const response = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(),
        });

        const data = await response.text(); // Expect the URL as the response

        // Send back the Catbox URL as the response along with additional fields
        res.status(200).json({
          success: true,
          Creator: "ABRO TECH",
          Contact: "wa.me/2348100151048",
          url: data,  // Use the URL directly from the Catbox response
        });
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({ success: false, message: 'Failed to upload file to Catbox' });
    }
  } else {
    // Handle non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
