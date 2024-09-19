const fetch = require('node-fetch');
const FormData = require('form-data');
const multer = require('multer');

// Setting up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        upload.single('file')(req, res, async function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error handling file upload',
                    error: err.message
                });
            }
            
            try {
                const formData = new FormData();
                formData.append('file', req.file.buffer, req.file.originalname);

                // Step 1: Upload the image to Catbox or similar service
                const catboxResponse = await fetch('https://catbox.moe/user/api.php', {
                    method: 'POST',
                    body: formData
                });

                const url = await catboxResponse.text();
                const uploadedImageUrl = url.trim();  // Assuming the response is the direct URL

                // Step 2: Use the uploaded image URL with the Junn4 HDR API
                const hdrApiUrl = `https://api.junn4.my.id/tools/hdr?url=${encodeURIComponent(uploadedImageUrl)}`;
                const hdrResponse = await fetch(hdrApiUrl);
                const hdrResult = await hdrResponse.json();

                // Step 3: Return only the enhanced image URL (the "result" field)
                return res.status(200).json({
                    success: true,
                    Creator: 'ABRO TECH',
                    Contact: 'wa.me/2348100151048',
                    enhancedImageUrl: hdrResult.result // Extracting only the "result" field
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Something went wrong while processing the image',
                    error: error.message
                });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
