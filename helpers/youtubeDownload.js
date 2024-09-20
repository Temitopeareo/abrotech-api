const ytdl = require('ytdl-core');
const axios = require('axios');
const { millify } = require("millify");

// Function to convert bytes to a readable size
function bytesToSize(bytes) {
    return new Promise((resolve, reject) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return resolve('n/a');
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) resolve(`${bytes} ${sizes[i]}`);
        resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
    });
}

// Function to download YouTube video as MP4
async function ytMp4(url) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(url).then(async (getUrl) => {
            let result = [];
            for (let i = 0; i < getUrl.formats.length; i++) {
                let item = getUrl.formats[i];
                if (item.container == 'mp4' && item.hasVideo && item.hasAudio) {
                    let { qualityLabel, contentLength } = item;
                    let bytes = await bytesToSize(contentLength);
                    result[i] = {
                        video: item.url,
                        quality: qualityLabel,
                        size: bytes
                    };
                }
            }
            let resultFix = result.filter(x => x.video && x.size && x.quality);
            let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
            let tinyUrl = tiny.data;
            let title = getUrl.videoDetails.title;
            let desc = getUrl.videoDetails.description;
            let views = millify(getUrl.videoDetails.viewCount);
            let channel = getUrl.videoDetails.ownerChannelName;
            let uploadDate = getUrl.videoDetails.uploadDate;
            let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
            
            resolve({
                title,
                result: tinyUrl,
                quality: resultFix[0].quality,
                size: resultFix[0].size,
                thumb,
                views,
                channel,
                uploadDate,
                desc
            });
        }).catch(err => {
            resolve();  // Handle error silently for now
        });
    });
}

// Function to download YouTube audio as MP3
async function ytMp3(url) {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(url).then(async (getUrl) => {
            let result = [];
            for (let i = 0; i < getUrl.formats.length; i++) {
                let item = getUrl.formats[i];
                if (item.mimeType === 'audio/webm; codecs="opus"') {
                    let { contentLength } = item;
                    let bytes = await bytesToSize(contentLength);
                    result[i] = {
                        audio: item.url,
                        size: bytes
                    };
                }
            }
            let resultFix = result.filter(x => x.audio && x.size);
            let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
            let tinyUrl = tiny.data;
            let title = getUrl.videoDetails.title;
            let desc = getUrl.videoDetails.description;
            let views = millify(getUrl.videoDetails.viewCount);
            let channel = getUrl.videoDetails.ownerChannelName;
            let uploadDate = getUrl.videoDetails.uploadDate;
            let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
            
            resolve({
                title,
                result: tinyUrl,
                size: resultFix[0].size,
                thumb,
                views,
                channel,
                uploadDate,
                desc
            });
        }).catch(err => {
            resolve();  // Handle error silently for now
        });
    });
}

module.exports = { ytMp4, ytMp3 };
