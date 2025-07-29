# Hướng dẫn tạo Gemini API Key mới

## 🚨 Vấn đề hiện tại
API key hiện tại đã hết quota sử dụng (exceeded quota limit).

## 🔑 Tạo API key mới

### Bước 1: Truy cập Google AI Studio
1. Mở: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng Google account

### Bước 2: Tạo API key
1. Click "Create API key"
2. Chọn project hoặc tạo project mới
3. Copy API key được tạo

### Bước 3: Cập nhật API key
1. Mở file `.env` trong project
2. Thay thế:
```env
GEMINI_API_KEY=your_new_api_key_here
```

### Bước 4: Restart server
```bash
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
npm run dev
```

## 📊 Quota Information
- **Free tier**: 15 requests/minute, 1500 requests/day
- **Rate limits**: Có thể tăng khi verify phone number
- **Reset**: Quota reset mỗi ngày

## 🛠️ Backup Plan
Hiện tại app đã có mock responses cho các câu hỏi phổ biến:
- Tư vấn chất liệu mùa hè
- Tư vấn màu sắc cho da ngăm  
- Tư vấn phối đồ
- Size recommendation (vẫn hoạt động offline)

## 🔧 Alternative Solutions
1. **Sử dụng Claude API** (Anthropic)
2. **OpenAI API** (ChatGPT)
3. **Local AI models** (Ollama, etc.)

---
*File này được tạo để hướng dẫn fix vấn đề quota API*