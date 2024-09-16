const formidable = require('formidable');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Create a new instance of formidable.IncomingForm
  const form = new formidable.IncomingForm();

  // Parse the form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form:', err);
      return res.status(500).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Internal Server Error' });
    }

    // Get the uploaded image file
    const imageFile = files.image;

    if (!imageFile) {
      return res.status(400).json({ status: 'FAILED', creator: 'Abro Tech', result: 'No image file provided' });
    }

    try {
      // Prepare the form data for the file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', fs.createReadStream(imageFile.filepath));

      // Upload the image to the external API
      const uploadResponse = await axios.post('https://api.giftedtechnexus.co.ke/api/tools/upload', uploadFormData, {
        headers: uploadFormData.getHeaders()
      });

      if (uploadResponse.data.result) {
        const imageUrl = uploadResponse.data.result;

        // Apply HDR processing to the uploaded image
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
