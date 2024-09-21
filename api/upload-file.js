const formidable = require('formidable');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
  config: {
    api: {
      bodyParser: false,
    },
  },

  handler: async function(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ error: 'Error parsing form data' });
        }

        const file = files.fileToUpload;
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileStream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('userhash', process.env.CATBOX_USER_HASH || '');
        formData.append('fileToUpload', fileStream);

        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
          headers: formData.getHeaders(),
        });

        res.status(200).json({ url: response.data });
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  }
};
