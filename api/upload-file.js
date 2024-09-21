const FormData = require('form-data');
const fs = require('fs'); // Ensure to import 'fs' for file operations
const fetch = require('node-fetch');
const multer = require('multer'); // Assuming you're using multer

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.config = {
  api: {
    bodyParser: false, // Disable body parsing in Vercel
  },
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Handle file upload using multer
    upload.single('abrofile')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to upload file' });
      }

      try {
        // Create a new FormData instance and append the file
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('userhash', '3dd217ecb3ee790b1be6aff01'); // Replace with your userhash
        formData.append('fileToUpload', req.file.buffer);

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
      } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).json({ success: false, message: 'Failed to upload file to Catbox' });
      }
    });
  } else {
    // Handle non-POST requests
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
