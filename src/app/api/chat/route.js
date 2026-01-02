import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Recibir el mensaje del usuario
    const { message } = await req.json();

    // 2. Conectar con Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Generar la respuesta
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 4. Enviar la respuesta de vuelta al chat
    return NextResponse.json({ text });
    
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { error: "Error procesando tu solicitud." }, 
      { status: 500 }
    );
  }
}