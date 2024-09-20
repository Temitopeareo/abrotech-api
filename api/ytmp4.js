const { ytMp4 } = require('../helpers/youtubeDownload');  // Correct path to the script

module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'URL is required'
        });
    }

    try {
        const result = await ytMp4(url);
        if (!result) {
            return res.status(500).json({
                success: false,
                message: 'Unable to process the video'
            });
        }
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
