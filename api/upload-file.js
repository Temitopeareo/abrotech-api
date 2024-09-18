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
      const form = new formidable.IncomingForm();
      
      // Parse the incoming form data
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err.message);
          return res.status(500).json({ success: false, message: 'Failed to parse form data' });
        }

        // Extract the uploaded file
        const file = files.fileToUpload;
        if (!file) {
          return res.status(400).json({ success: false, message: 'No file provided' });
        }

        const filePath = file.filepath;

        // Create a new FormData instance and append the file
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('userhash', '3dd217ecb3ee790b1be6aff01');
        formData.append('fileToUpload', fs.createReadStream(filePath));

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
