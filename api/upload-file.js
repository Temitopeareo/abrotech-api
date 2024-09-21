const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mime = require('mime-types');

class SupaUploader {
    constructor(url = 'https://i.supa.codes/api/upload') {
        this.url = url;
    }

    async upload(fp) {
        const form = new FormData();
        let mt;

        const isUrl = (string) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(string);
        const cmt = (url) => {
            const ext = url.split('.').pop().toLowerCase();
            const types = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                mp3: 'audio/mpeg',
                mp4: 'video/mp4',
            };
            return types[ext] || null;
        };

        const gr = (ext) => {
            const rs = Math.random().toString(36).substring(2, 15);
            return `${rs}.${ext}`;
        };

        if (isUrl(fp)) {
            const { data, headers } = await axios.get(fp, { responseType: 'arraybuffer' });
            mt = headers['content-type'] || cmt(fp) || 'application/octet-stream';
            const ext = mt.split('/')[1];
            const filename = gr(ext);
            form.append('file', Buffer.from(data), { filename, contentType: mt });
        } else {
            const filePath = fs.createReadStream(fp);
            mt = mime.lookup(fp) || 'application/octet-stream';
            const ext = mt.split('/')[1];
            const filename = gr(ext);
            form.append('file', filePath, { filename, contentType: mt });
        }

        try {
            const response = await axios.post(this.url, form, {
                headers: { ...form.getHeaders(), 'User-Agent': 'Postify/1.0.0', 'X-Forwarded-For': Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.') }
            });
            return { data: response.data, mt };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = SupaUploader;
