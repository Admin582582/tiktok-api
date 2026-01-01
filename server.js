const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Dùng cái này để gọi API
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/get-video', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ success: false, message: 'Thiếu Link rồi anh ơi!' });

        console.log("Đang xử lý link:", url);

        // Gọi sang server của TikWM (Bên thứ 3 chuyên xử lý video)
        // Cách này cực bền, ít khi bị lỗi vặt
        const response = await axios.post('https://www.tikwm.com/api/', {
            url: url
        });

        const data = response.data.data;

        if (data) {
            return res.json({
                success: true,
                video_url: data.play,      // Link video sạch
                audio_url: data.music,     // Link nhạc
                author: data.author.nickname
            });
        } else {
            return res.status(500).json({ success: false, message: 'Không lấy được video (Check lại link TikTok xem)!' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi Server!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
