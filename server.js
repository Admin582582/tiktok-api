const express = require('express');
const cors = require('cors');
const { tiktokdownload } = require('tiktok-video-downloader');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API TikTok của anh Lực đang chạy ngon lành!');
});

app.post('/api/get-video', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ success: false, message: 'Thiếu Link rồi anh ơi!' });

        console.log("Đang tải link:", url);
        const data = await tiktokdownload(url);

        if (data && data.nowm) {
            return res.json({
                success: true,
                video_url: data.nowm,
                audio_url: data.audio,
                author: data.author_name
            });
        } else {
            return res.status(500).json({ success: false, message: 'Không lấy được link!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi Server!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
