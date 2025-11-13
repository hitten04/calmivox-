import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Helper to convert file to base64 ---
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

// --- Image Generation Service ---
export const generateImages = async (prompt: string, numberOfImages: number, files?: File[]): Promise<string[]> => {
  try {
    if (files && files.length > 0) {
      // Use multimodal generation if images are provided
      const imageParts = await Promise.all(
        files.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          };
        })
      );
      const textPart = { text: prompt };

      // Create an array of promises for each image generation call
      const generationPromises = Array(numberOfImages).fill(null).map(() => 
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [...imageParts, textPart] },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        })
      );

      const responses = await Promise.all(generationPromises);
      
      const images: string[] = [];
      responses.forEach(response => {
        if (response.candidates && response.candidates.length > 0) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            }
          }
        }
      });

      if (images.length === 0) {
        throw new Error("The model did not return any images.");
      }
      return images;

    } else {
      // Use standard text-to-image generation
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });
      return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    }
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please try again.");
  }
};
