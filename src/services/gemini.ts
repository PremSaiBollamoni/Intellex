import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getModel = (modelName: string) => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateText = async (model: string, prompt: string) => {
  const geminiModel = getModel(model);
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateImageAnalysis = async (model: string, image: string, prompt: string) => {
  const geminiModel = getModel(model);
  const result = await geminiModel.generateContent([prompt, { inlineData: { data: image, mimeType: 'image/jpeg' } }]);
  const response = await result.response;
  return response.text();
};