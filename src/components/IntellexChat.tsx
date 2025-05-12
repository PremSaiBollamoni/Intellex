import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Download, Plus } from 'lucide-react';
import { generateText } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Props {
  model: string;
}

const IntellexChat: React.FC<Props> = ({ model }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateText(model, input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadChat = async (format: 'pdf' | 'doc') => {
    if (format === 'pdf') {
      const pdf = new jsPDF();
      let y = 10;
      messages.forEach((message) => {
        const prefix = message.isUser ? 'You: ' : 'Intellex: ';
        const lines = pdf.splitTextToSize(prefix + message.text, 180);
        lines.forEach((line: string) => {
          if (y > 280) {
            pdf.addPage();
            y = 10;
          }
          pdf.text(line, 10, y);
          y += 7;
        });
        y += 5;
      });
      pdf.save('chat-history.pdf');
    } else {
      const doc = new Document({
        sections: [{
          properties: {},
          children: messages.map((message) => {
            return new Paragraph({
              text: `${message.isUser ? 'You' : 'Intellex'}: ${message.text}`,
            });
          }),
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-history.docx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-[calc(100vh-16rem)]">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={startNewChat}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadChat('pdf')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => downloadChat('doc')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-8rem)] overflow-y-auto mb-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`chat-bubble ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
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
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default IntellexChat;