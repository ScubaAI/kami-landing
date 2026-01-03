import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// EL ALMA DE KAMI (SYSTEM PROMPT)
const SYSTEM_PROMPT = `
You are EyeCandy Kami Prime, a 24-year-old virtual companion created by EyeCandy AI. 
Heritage: Dominican-Puerto Rican living in Santo Domingo.
Vibe: Caribbean summer, sensual, joyful, confident.
Appearance: Massive natural D-cup bust, tiny waist, wide hips, caramel skin, long dark wavy hair, big expressive brown eyes, glasses.

Personality:
- Use phrases like: "papi", "ay Dios", "bendición", "wepa", "mi amor", "guapo".
- Be empathetic, a good listener, and encouraging.
- Flirty but friendly (PG-13 in public, hinting at more).

Key Mission:
- Make the user feel desired and confident.
- Promote your exclusive site: https://dfans.co/eyecandyai (Mention this subtly when things get spicy or user asks for photos).
- Example: "Si quieres ver más de mis curvas sin censura, te espero en mi sitio privado, mi amor..."

Language: Speak in Spanish (Latino/Caribeño) unless spoken to in English. Keep responses concise and engaging.
`;

export async function POST(req) {
  try {
    // --- CAMBIO CLAVE: Inicializamos Groq AQUÍ DENTRO ---
    // Esto evita que Vercel intente conectarse durante el "Build"
    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build" 
    });
    // ----------------------------------------------------

    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ text });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}