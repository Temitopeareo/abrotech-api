import FormData from 'form-data';
import { Readable } from 'stream';
const fileType = (await import('file-type')).default;
const fetch = (await import('node-fetch')).default;

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('userhash', '3dd217ecb3ee790b1be6aff01'); // Replace with actual userhash if needed

      // Read the file from the request
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });

      // Extract the filename from the Content-Disposition header if available
      const contentDisposition = req.headers['content-disposition'];
      const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'file.bin';

      // Add the file to the form with the actual filename
      form.append('fileToUpload', Readable.from(buffer), { filename });


      
      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const data = await response.text(); // Expecting a URL from Catbox

      // Send back the Catbox URL as the response with additional fields
      res.status(200).json({
        success: true,
        Creator: "ABRO TECH",
        Contact: "wa.me/2348100151048",
        url: `https://file.catbox.moe/${data}`, // Constructing the URL with the file ID returned by Catbox
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
