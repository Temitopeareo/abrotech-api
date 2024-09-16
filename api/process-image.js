const formidable = require('formidable');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form:', err);
      return res.status(500).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Internal Server Error' });
    }

    const imageFile = files.image;

    // Check if the file and its path exist
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

      // Prepare form data for upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', fileStream);

      // Upload the image
      const uploadResponse = await axios.post('https://api.giftedtechnexus.co.ke/api/tools/upload', uploadFormData, {
        headers: uploadFormData.getHeaders()
      });

      const imageUrl = uploadResponse.data.result;

      if (imageUrl) {
        // Process the image
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
