import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Send, Trash2, Image as ImageIcon, Loader, Filter, Search, Maximize2, MinusCircle } from 'lucide-react';
import { generateImageAnalysis } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

interface Props {
  model: string;
}

const IntellexVis: React.FC<Props> = ({ model }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const analysisOptions = [
    { value: 'general', label: 'General Analysis' },
    { value: 'objects', label: 'Object Detection' },
    { value: 'text', label: 'Text Recognition' },
    { value: 'colors', label: 'Color Analysis' },
    { value: 'faces', label: 'Face Detection' },
    { value: 'safety', label: 'Safety Check' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input || `Analyze this image (${analysisType})`,
      isUser: true,
      image: selectedImage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setImagePreview(null);

    try {
      const imageData = selectedImage.split(',')[1];
      const prompt = `${input || 'Analyze this image'} with focus on ${analysisType} analysis.`;
      const response = await generateImageAnalysis(model, imageData, prompt);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error analyzing the image. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-[calc(100vh-16rem)] flex flex-col">
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`chat-bubble ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              {message.image && (
                <div className="relative inline-block mb-2">
                  <img
                    src={message.image}
                    alt="Uploaded content"
                    className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowFullImage(true)}
                  />
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image Preview and Analysis Options */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <MinusCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-2"
                >
                  {analysisOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Select analysis type to focus the AI's attention
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the image..."
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <label className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center">
          <Upload className="w-5 h-5" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          disabled={isLoading || !selectedImage}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && messages.find(m => m.image) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFullImage(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={messages.find(m => m.image)?.image}
                alt="Full size"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <MinusCircle className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntellexVis;