const formidable = require('formidable');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Your Imgur Client-ID
const IMGUR_CLIENT_ID = '38f5ba01574a08a';

module.exports = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form:', err);
      return res.status(500).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Internal Server Error' });
    }

    const imageFile = files.image;

    if (!imageFile || !imageFile.filepath) {
      console.error('No image file or file path provided:', files);
      return res.status(400).json({ status: 'FAILED', creator: 'Abro Tech', result: 'No image file provided' });
    }

    try {
      // Ensure the file path is valid
      const filePath = path.resolve(imageFile.filepath);
      console.log('File path:', filePath);

      // Create a readable stream from the file path
      const fileStream = fs.createReadStream(filePath);

      // Prepare form data for upload to Imgur
      const uploadFormData = new FormData();
      uploadFormData.append('image', fileStream);

      // Upload the image to Imgur
      const imgurResponse = await axios.post('https://api.imgur.com/3/image', uploadFormData, {
        headers: {
          ...uploadFormData.getHeaders(),
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        }
      });

      const imageUrl = imgurResponse.data.data.link;

      if (imageUrl) {
        // Process the image with HDR API
        const hdrResponse = await axios.get(`https://api.junn4.my.id/tools/hdr?url=${encodeURIComponent(imageUrl)}`);

        if (hdrResponse.data.result) {
          return res.json({
            status: 'SUCCESS',
            creator: 'Abro Tech',
            result: hdrResponse.data.result
          });
        } else {
          return res.json({
            status: 'FAILED',
            creator: 'Abro Tech',
            result: 'Failed to process image with HDR API'
          });
        }
      } else {
        return res.json({
          status: 'FAILED',
          creator: 'Abro Tech',
          result: 'Failed to upload image'
        });
      }
    } catch (error) {
      console.error('Error processing the image:', error);
      return res.status(500).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Internal Server Error' });
    }
  });
};
