import React, { useState, useRef, useEffect } from 'react';

// Size chart data
const sizeChart = [
  { minHeight: 150, maxHeight: 159, minWeight: 40, maxWeight: 49, size: "XS" },
  { minHeight: 155, maxHeight: 164, minWeight: 45, maxWeight: 54, size: "S" },
  { minHeight: 160, maxHeight: 169, minWeight: 50, maxWeight: 59, size: "M" },
  { minHeight: 165, maxHeight: 174, minWeight: 55, maxWeight: 64, size: "L" },
  { minHeight: 170, maxHeight: 179, minWeight: 60, maxWeight: 74, size: "XL" },
  { minHeight: 175, maxHeight: 185, minWeight: 65, maxWeight: 85, size: "XXL" },
  { minHeight: 180, maxHeight: 200, minWeight: 75, maxWeight: 120, size: "XXXL" },
];

// Simple localStorage utility
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Fail silently
    }
  }
};

// Mock responses for when API is down
const mockResponses = {
  'xin chào': 'Xin chào! Tôi là trợ lý tư vấn thời trang AI. Tôi có thể giúp bạn chọn size phù hợp và tư vấn phong cách. Bạn cần hỗ trợ gì?',
  'mùa hè': 'Mùa hè nên chọn các chất liệu thoáng mát như:\n\n🌿 **Cotton**: Thấm hút mồ hôi tốt\n🌿 **Linen**: Siêu thoáng mát\n🌿 **Modal**: Mềm mại, mát mẻ\n🌿 **Bamboo**: Kháng khuẩn tự nhiên\n\nTránh: Polyester, vải dày.',
  'da ngăm': 'Da ngăm rất hợp với:\n\n✨ **Màu sáng**: Trắng, kem, pastel\n✨ **Màu đất**: Nâu, be, camel\n✨ **Màu jewel**: Ngọc lục bảo, sapphire\n✨ **Màu coral**: Hồng cam, đào\n\nTránh: Màu quá tối.',
  'cao hơn': 'Để trông cao hơn:\n\n📏 **Quần high-waist**: Tạo chân dài\n📏 **Áo crop-top**: Tỷ lệ đẹp hơn\n📏 **Giày cao gót**: Tăng chiều cao\n📏 **Sọc dọc**: Hiệu ứng thon dài\n📏 **Tông màu đồng bộ**: Line liền mạch',
  'gầy': 'Người gầy nên chọn:\n\n💪 **Áo có cấu trúc**: Blazer, vest\n💪 **Layer nhiều lớp**: Tạo độ dày\n💪 **Họa tiết to**: Tạo thể tích\n💪 **Màu sáng**: Cảm giác đầy đặn\n💪 **Chất liệu dày**: Denim, tweed'
};

// Get size recommendation
const getSizeRecommendation = (height, weight) => {
  const possibleSizes = sizeChart.filter(item => 
    height >= item.minHeight && height <= item.maxHeight
  );
  
  if (possibleSizes.length === 0) {
    return 'Không tìm thấy size phù hợp';
  }
  
  let bestSize = possibleSizes[0];
  let minWeightDiff = Math.abs(weight - (bestSize.minWeight + bestSize.maxWeight) / 2);
  
  for (let i = 1; i < possibleSizes.length; i++) {
    const avgWeight = (possibleSizes[i].minWeight + possibleSizes[i].maxWeight) / 2;
    const diff = Math.abs(weight - avgWeight);
    if (diff < minWeightDiff) {
      bestSize = possibleSizes[i];
      minWeightDiff = diff;
    }
  }
  
  let warning = '';
  if (weight < bestSize.minWeight) warning = ' (Cân nặng thấp hơn khuyến nghị)';
  if (weight > bestSize.maxWeight) warning = ' (Cân nặng cao hơn khuyến nghị)';
  
  return bestSize.size + warning;
};

// AI API call
const callAI = async (question) => {
  try {
    // Check for mock responses first
    const lowerQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    
    // Try real API
    const apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:4000/api/gemini' 
      : '/api/gemini';
    
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    });
    
    if (!res.ok) {
      return "Hiện tại dịch vụ AI đang bảo trì. Tôi vẫn có thể tư vấn size và câu hỏi cơ bản. Hãy thử hỏi về chiều cao, cân nặng!";
    }
    
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.";
    
  } catch (error) {
    return "Tôi đang gặp vấn đề kỹ thuật. Hãy thử hỏi về size hoặc các câu hỏi thời trang cơ bản!";
  }
};

// Generate bot reply
const generateReply = async (userInput) => {
  const text = userInput.toLowerCase().trim();
  
  // Check for height/weight pattern
  const heightMatch = text.match(/(\d{1,3})\s*(?:cm|chiều cao)/i) || 
                     text.match(/(\d)\s*m\s*(\d{1,2})/i) ||
                     text.match(/(\d\.\d{1,2})\s*m/i);
  const weightMatch = text.match(/(\d{2,3})\s*(?:kg|cân nặng|kilo)/i);
  
  let height = null, weight = null;
  
  if (heightMatch) {
    if (heightMatch[2]) { // Format: 1m70
      height = parseInt(heightMatch[1]) * 100 + parseInt(heightMatch[2]);
    } else if (text.includes('.')) { // Format: 1.70m
      height = Math.round(parseFloat(heightMatch[1]) * 100);
    } else { // Format: 170cm
      height = parseInt(heightMatch[1]);
    }
  }
  
  if (weightMatch) {
    weight = parseInt(weightMatch[1]);
  }
  
  // Size recommendation
  if (height && weight) {
    if (height < 140 || height > 210 || weight < 30 || weight > 150) {
      return "Thông tin nằm ngoài phạm vi tư vấn (140-210cm, 30-150kg). Vui lòng kiểm tra lại.";
    }
    const size = getSizeRecommendation(height, weight);
    return `Với chiều cao ${height}cm và cân nặng ${weight}kg:\n\n🎯 **Size phù hợp: ${size}**\n\nLưu ý: Đây là gợi ý, bạn nên tham khảo bảng size chi tiết của từng sản phẩm.`;
  }
  
  // Call AI for other questions
  return await callAI(userInput);
};

const SizeChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize messages
  useEffect(() => {
    const saved = storage.get('chatHistory');
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setMessages(saved);
    } else {
      const welcomeMessage = {
        id: 'welcome',
        type: 'bot',
        text: 'Xin chào! Tôi có thể giúp bạn chọn size phù hợp. Vui lòng cho tôi biết chiều cao (cm) và cân nặng (kg) của bạn.',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      storage.set('chatHistory', [welcomeMessage]);
    }
  }, []);
  
  // Save messages to storage
  useEffect(() => {
    if (messages.length > 0) {
      storage.set('chatHistory', messages);
    }
  }, [messages]);
  
  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      const botReply = await generateReply(inputText.trim());
      const botMessage = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        text: botReply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        text: 'Xin lỗi, tôi gặp vấn đề kỹ thuật. Vui lòng thử lại!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset chat
  const resetChat = () => {
    const welcomeMessage = {
      id: 'welcome_new',
      type: 'bot',
      text: 'Xin chào! Tôi có thể giúp bạn chọn size phù hợp. Vui lòng cho tôi biết chiều cao (cm) và cân nặng (kg) của bạn.',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    storage.set('chatHistory', [welcomeMessage]);
    setIsLoading(false);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };
  
  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Suggested questions
  const suggestedQuestions = [
    "Tôi cao 1m65 nặng 55kg",
    "Mùa hè nên mặc chất liệu gì?",
    "Da ngăm nên mặc màu gì?",
    "Làm sao để trông cao hơn?",
    "Người gầy nên mặc gì?",
    "Xin chào"
  ];
  
  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">AI</span>
              </div>
              <div>
                <h3 className="font-bold">Tư vấn chọn size</h3>
                <p className="text-xs text-gray-300">Hỗ trợ 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Reset cuộc trò chuyện"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Suggested Questions */}
            {messages.filter(m => m.type === 'user').length === 0 && !isLoading && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="text-xs mb-2 text-gray-600 font-medium">Câu hỏi gợi ý:</div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(question);
                        setTimeout(sendMessage, 100);
                      }}
                      className="bg-white hover:bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1 border transition-colors"
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChatBot; 