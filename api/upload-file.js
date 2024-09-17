import FormData from 'form-data';
import { Readable } from 'stream';
import fetch from 'node-fetch';

const CATBOX_USERHASH = '3dd217ecb3ee790b1be6aff01'; 

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('userhash', CATBOX_USERHASH);

      // Read the file from the request
      const buffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });

      // Add the file to the form
      form.append('fileToUpload', Readable.from(buffer), { filename: 'file.jpg' });

      // Send POST request to Catbox API
      const response = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
