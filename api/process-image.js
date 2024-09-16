const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Method Not Allowed' });
    }

    const form = new FormData();
    const file = req.files ? req.files.image : null;

    if (!file) {
      return res.status(400).json({ status: 'FAILED', creator: 'Abro Tech', result: 'No image file provided' });
    }

    form.append('file', file.buffer, { filename: 'image.jpg' });

    const uploadResponse = await axios.post('https://api.giftedtechnexus.co.ke/api/tools/upload', form, {
      headers: form.getHeaders()
    });

    if (uploadResponse.data.result) {
      const imageUrl = uploadResponse.data.result;
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
    console.error(error);
    return res.status(500).json({ status: 'FAILED', creator: 'Abro Tech', result: 'Internal Server Error' });
  }
};
