"use client";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot, User, Sparkles } from "lucide-react";

export default function Home() {
  // --- Lógica del Chat ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", text: "Lo siento, tuve un error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
      
      {/* --- SECCIÓN 1: HERO (Video de fondo) --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* VIDEO DE FONDO: Reemplaza '/video.mp4' con tu archivo en la carpeta public */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          {/* Si no tienes video aún, esto mostrará un fondo gris oscuro */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/video-fondo.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-6 backdrop-blur-md">
            <Sparkles size={14} /> <span>Powered by Gemini AI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Experiencias Digitales
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Creamos el futuro con inteligencia artificial y diseño de vanguardia.
          </p>
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition-all transform hover:scale-105"
          >
            Hablar con la IA
          </button>
        </div>
      </section>

      {/* --- SECCIÓN 2: GALERÍA DE FOTOS --- */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 border-l-4 border-purple-500 pl-4">Nuestro Trabajo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FOTO 1 */}
          <div className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer group relative">
              <img src="/kami1.png" alt="Modelo AI" className="w-full h-full object-cover" /> 
             
          </div>
          {/* FOTO 2 */}
          <div className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer group relative">
             {/* <img src="/foto2.jpg" alt="Modelo AI" className="w-full h-full object-cover" /> */}
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 group-hover:text-white">Foto 2</div>
          </div>
          {/* FOTO 3 */}
          <div className="aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer group relative">
             {/* <img src="/foto3.jpg" alt="Modelo AI" className="w-full h-full object-cover" /> */}
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 group-hover:text-white">Foto 3</div>
          </div>
        </div>
      </section>

      {/* --- CHAT FLOTANTE --- */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-600/30 transition-all transform hover:scale-110"
          >
            <MessageCircle size={28} />
          </button>
        )}

        {isOpen && (
          <div className="bg-gray-900 border border-gray-700 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header del Chat */}
            <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Bot className="text-purple-400" />
                <span className="font-semibold text-white">Asistente AI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none text-sm text-gray-400 animate-pulse">
                    Escribiendo...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}