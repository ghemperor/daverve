import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useLocalStorage } from './hooks/useLocalStorage';

// Bảng size demo
const sizeChart = [
  { minHeight: 150, maxHeight: 159, minWeight: 40, maxWeight: 49, size: "XS" },
  { minHeight: 155, maxHeight: 164, minWeight: 45, maxWeight: 54, size: "S" },
  { minHeight: 160, maxHeight: 169, minWeight: 50, maxWeight: 59, size: "M" },
  { minHeight: 165, maxHeight: 174, minWeight: 55, maxWeight: 64, size: "L" },
  { minHeight: 170, maxHeight: 179, minWeight: 60, maxWeight: 74, size: "XL" },
  { minHeight: 175, maxHeight: 185, minWeight: 65, maxWeight: 85, size: "XXL" },
  { minHeight: 180, maxHeight: 200, minWeight: 75, maxWeight: 120, size: "XXXL" },
];

async function askGeminiV3(question) {
  try {
    console.log('Calling Gemini API with question:', question);
    
    // Determine API URL based on environment
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isLocal ? 'http://localhost:4000/api/gemini' : `/api/gemini?v=${Date.now()}`;
    
    console.log('Environment detection:', { hostname: window.location.hostname, isLocal });
    console.log('Using API URL:', apiUrl);
    
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }]
      })
    });
    
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      console.error('HTTP Error:', res.status, res.statusText);
      return `Lỗi kết nối API (${res.status}): ${res.statusText}`;
    }
    
    const data = await res.json();
    console.log('API Response:', data);
    
    if (data.error) {
      console.error('Gemini API Error:', data.error);
      return `Lỗi Gemini: ${data.error}`;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Xin lỗi, tôi chưa có câu trả lời phù hợp.";
    
  } catch (error) {
    console.error('Network/Parse Error:', error);
    return `Lỗi kết nối: ${error.message}. Vui lòng thử lại sau.`;
  }
}

// Helper function to format timestamp safely
const formatTimestamp = (timestamp) => {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const SizeChatBot = ({ products = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default message with proper timestamp
  const getDefaultMessages = () => [
    {
      id: `bot_welcome_${Date.now()}`,
      type: 'bot',
      text: 'Xin chào! Tôi có thể giúp bạn chọn size phù hợp. Vui lòng cho tôi biết chiều cao (cm) và cân nặng (kg) của bạn.',
      timestamp: new Date().toISOString()
    }
  ];
  
  const [messages, setMessages] = useLocalStorage('chatHistory', getDefaultMessages());
  
  // Debug: log messages whenever they change
  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset chat function
  const resetChat = () => {
    console.log('🔄 Resetting chat');
    
    // Clear localStorage completely
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('chatContext');
    
    // Reset states
    setMessages(getDefaultMessages());
    setConversationContext({
      userHeight: null,
      userWeight: null,
      preferredStyles: [],
      previousRecommendations: []
    });
    setSuggestedProducts([]);
    setIsLoading(false);
  };
  const [conversationContext, setConversationContext] = useLocalStorage('chatContext', {
    userHeight: null,
    userWeight: null,
    preferredStyles: [],
    previousRecommendations: []
  });
  // Gợi ý sản phẩm dựa trên từ khóa
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSizeRecommendation = (height, weight) => {
    // Tìm tất cả size phù hợp chiều cao
    const possibleSizes = sizeChart.filter(item => height >= item.minHeight && height <= item.maxHeight);
    if (possibleSizes.length === 0) return 'Không tìm thấy size phù hợp';
    // Tìm size có cân nặng gần nhất
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
    // Kiểm tra cân nặng có nằm ngoài khoảng không
    let warning = '';
    if (weight < bestSize.minWeight) warning = ' (Cân nặng của bạn thấp hơn mức khuyến nghị cho size này)';
    if (weight > bestSize.maxWeight) warning = ' (Cân nặng của bạn cao hơn mức khuyến nghị cho size này)';
    return bestSize.size + warning;
  };

  // Common function to send message
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;
    
    console.log('📨 Sending message:', messageText);

    const userMessageId = `user_${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      type: 'user',
      text: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      console.log('Adding user message:', userMessage);
      return [...prev, userMessage];
    });
    setIsLoading(true);

    try {
      // Small delay to ensure proper sequencing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const botReply = await generateBotReply(messageText.trim());
      const botMessageId = `bot_${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        type: 'bot',
        text: botReply,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        console.log('Adding bot message:', botMessage);
        return [...prev, botMessage];
      });
      
      // Gợi ý sản phẩm
      const found = findSuggestedProducts(messageText.trim());
      setSuggestedProducts(found);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessageId = `error_${Date.now()}`;
      const errorMessage = {
        id: errorMessageId,
        type: 'bot',
        text: 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại!',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userInput = inputText.trim();
    setInputText('');
    await sendMessage(userInput);
  };

  // Hàm lọc sản phẩm dựa trên từ khóa
  function findSuggestedProducts(text) {
    const lower = text.toLowerCase();
    // Từ khóa demo: hoodie, đen, trắng, sơ mi, gầy, cao, v.v.
    let keywords = [];
    if (lower.includes('hoodie')) keywords.push('hoodie');
    if (lower.includes('sơ mi') || lower.includes('shirt')) keywords.push('shirt');
    if (lower.includes('áo')) keywords.push('áo');
    if (lower.includes('quần')) keywords.push('quần');
    if (lower.includes('đen')) keywords.push('đen');
    if (lower.includes('trắng')) keywords.push('trắng');
    if (lower.includes('gầy')) keywords.push('gầy');
    if (lower.includes('cao')) keywords.push('cao');
    // Lọc sản phẩm theo tên hoặc màu
    let filtered = products;
    if (keywords.length > 0) {
      filtered = products.filter(p => {
        const name = p.name.toLowerCase();
        const variantColors = (p.variants || []).map(v => v.colorName.toLowerCase()).join(' ');
        return keywords.some(k => name.includes(k) || variantColors.includes(k));
      });
    }
    // Nếu hỏi về gầy/cao, ưu tiên sản phẩm có size nhỏ/lớn
    if (lower.includes('gầy')) {
      filtered = filtered.filter(p => p.variants && p.variants.some(v => v.size === 'S' || v.size === 'XS'));
    }
    if (lower.includes('cao')) {
      filtered = filtered.filter(p => p.variants && p.variants.some(v => v.size === 'L' || v.size === 'XL'));
    }
    // Trả về tối đa 3 sản phẩm gợi ý
    return filtered.slice(0, 3);
  }

  const generateBotReply = async (userInput) => {
    console.log('🤖 generateBotReply called with:', userInput);
    try {
      const text = userInput.toLowerCase().replace(/,/g, '.').replace(/\s+/g, ' ').trim();

      // Tìm chiều cao
      let height = null;
      // 1m76, 1.76m, 176cm, 176
      const mMatch = text.match(/(\d{1,2})\s*m\s*(\d{1,2})/); // 1m76
      const mDotMatch = text.match(/(\d{1,2}\.\d{1,2})\s*m/); // 1.76m
      const cmMatch = text.match(/(1\d{2}|2[0-1]\d)\s*cm/); // 176cm
      const justNumMatch = text.match(/(1\d{2}|2[0-1]\d)(?![\d\.]*m)/); // 176 (không đi kèm m)

      if (mMatch) {
        height = parseInt(mMatch[1]) * 100 + parseInt(mMatch[2]);
      } else if (mDotMatch) {
        height = Math.round(parseFloat(mDotMatch[1]) * 100);
      } else if (cmMatch) {
        height = parseInt(cmMatch[1]);
      } else if (justNumMatch) {
        height = parseInt(justNumMatch[1]);
      }

      // Tìm cân nặng
      let weight = null;
      const kgMatch = text.match(/(\d{2,3})\s*kg/); // 55kg
      const weightNumMatch = text.match(/(\d{2,3})(?![\d\.]*cm|[\d\.]*m)/); // 55 (không đi kèm cm/m)
      if (kgMatch) {
        weight = parseInt(kgMatch[1]);
      } else if (weightNumMatch) {
        // Đảm bảo không trùng với chiều cao
        if (!height || parseInt(weightNumMatch[1]) !== height) {
          weight = parseInt(weightNumMatch[1]);
        }
      }

      // Cập nhật context nếu có thông tin mới
      const newContext = { ...conversationContext };
      if (height) newContext.userHeight = height;
      if (weight) newContext.userWeight = weight;
      
      if (height && weight) {
        if (height < 140 || height > 210 || weight < 30 || weight > 150) {
          return `Thông tin bạn nhập nằm ngoài phạm vi tư vấn (140-210cm, 30-150kg). Vui lòng kiểm tra lại.`;
        }
        const recommendedSize = getSizeRecommendation(height, weight);
        
        // Lưu recommendation vào context
        newContext.previousRecommendations.push({
          size: recommendedSize,
          timestamp: new Date().toISOString(),
          height,
          weight
        });
        
        setConversationContext(newContext);
        
        return `Chiều cao: ${height}cm\nCân nặng: ${weight}kg\n\nSize phù hợp với bạn là: **${recommendedSize}**\n\nLưu ý: Đây chỉ là gợi ý, bạn nên tham khảo bảng size chi tiết hoặc liên hệ nhân viên tư vấn.`;
      }

      // Cập nhật context nếu có thông tin mới
      if (height || weight) {
        setConversationContext(newContext);
      }

      // Tạo context thông minh cho Gemini
      const contextInfo = newContext.userHeight && newContext.userWeight 
        ? `Thông tin người dùng: Chiều cao ${newContext.userHeight}cm, Cân nặng ${newContext.userWeight}kg. `
        : '';
      
      const previousRecommendations = newContext.previousRecommendations.length > 0
        ? `Các gợi ý trước: ${newContext.previousRecommendations.slice(-2).map(r => r.size).join(', ')}. `
        : '';

      // Nếu không phải câu hỏi về size, gọi Gemini
      const enhancedPrompt = `${contextInfo}${previousRecommendations}${userInput}. Trả lời ngắn gọn, thân thiện, chuyên nghiệp bằng tiếng Việt. Nếu liên quan đến thời trang, hãy đưa ra lời khuyên cụ thể.`;
      
      const geminiReply = await askGeminiV3(enhancedPrompt);
      console.log('🤖 Bot reply generated:', geminiReply);
      return geminiReply;
    } catch (error) {
      console.error('Error in generateBotReply:', error);
      return 'Xin lỗi, tôi đang gặp một chút vấn đề kỹ thuật. Vui lòng thử lại sau nhé!';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleViewDetail = (productId) => {
    window.open(`/product/${productId}`, '_blank');
  };

  const suggestedQuestions = [
    "Tôi nên mặc size gì nếu cao 1m65 nặng 55kg?",
    "Da ngăm nên mặc màu gì cho đẹp?",
    "Phối đồ như thế nào để trông cao hơn?",
    "Người gầy nên chọn kiểu áo nào?",
    "Mùa hè nên mặc chất liệu gì?",
    "Phong cách nào hợp với người trẻ năng động?"
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
                aria-label="Reset chat"
                title="Reset cuộc trò chuyện"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                aria-label="Đóng chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Suggested Questions as bot message (only if no user message yet) */}
            {messages.filter(m => m.type === 'user').length === 0 && !isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
                  <div className="text-xs mb-2 text-gray-600">Bạn có thể thử các câu hỏi sau:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        className="bg-white hover:bg-gray-200 text-gray-800 text-xs rounded-full px-3 py-1 border border-gray-200 transition-colors mb-1"
                        style={{whiteSpace:'nowrap'}}
                        onClick={() => sendMessage(q)}
                        disabled={isLoading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading message */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 max-w-xs">
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Gợi ý sản phẩm sau khi bot trả lời */}
            {suggestedProducts.length > 0 && (
              <div className="flex justify-start">
                <div className="max-w-xs w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 mt-2">
                  <div className="text-xs font-bold mb-2 text-gray-700">Gợi ý sản phẩm phù hợp:</div>
                  <div className="flex flex-col gap-2">
                    {suggestedProducts.map((p) => (
                      <div key={p.id} className="flex gap-2 items-center border-b last:border-b-0 pb-2 last:pb-0">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain rounded" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-black line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.price}₫</div>
                          <button
                            className="mt-1 text-xs text-blue-600 underline hover:text-blue-800 transition-colors"
                            onClick={() => handleViewDetail(p.id)}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800 animate-pulse">
                  <p className="text-sm">Đang trả lời...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập chiều cao và cân nặng..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                id="sizechatbot-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
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