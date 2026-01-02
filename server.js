const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/get-video', async (req, res) => {
    try {
        const { url } = req.body;
        
        // 1. Kiểm tra đầu vào
        if (!url) return res.status(400).json({ success: false, message: 'Chưa nhập link!' });
        console.log("Đang xử lý:", url);

        // 2. Cấu hình giả lập Chrome (Để không bị chặn)
        const formData = new URLSearchParams();
        formData.append('url', url);
        formData.append('hd', '1'); // Lấy video HD

        const response = await axios.post('https://www.tikwm.com/api/', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const data = response.data.data;

        if (data && data.play) {
            return res.json({
                success: true,
                video_url: data.play,      // Link video không logo
                audio_url: data.music,     // Link nhạc
                author: data.author.nickname
            });
        } else {
            return res.status(500).json({ success: false, message: 'Server TikWM không trả về dữ liệu (Link có thể bị lỗi)!' });
        }

    } catch (error) {
        console.error("Lỗi:", error.message);
        return res.status(500).json({ success: false, message: 'Lỗi kết nối Server!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
