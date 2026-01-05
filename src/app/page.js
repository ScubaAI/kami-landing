"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Lock, Send, X, Loader2, Play, Image as ImageIcon, LogOut } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  // --- 1. MEMORIA DEL USUARIO (Session State) ---
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsChatOpen(false);
  };

  // --- 2. EL MOTOR DE ENGAGEMENT (Chat Logic) ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Initial Hook
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola, papi! Ay Dios, qué bueno verte. Soy Kami, ¿en qué puedo consentirte hoy? 😉" }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom() }, [messages, isChatOpen]);

  const handleChatClick = () => {
    if (session) {
      setIsChatOpen(true);
    } else {
      handleLogin();
    }
  };

  // --- HELPER: CONVERT URLS TO CLICKABLE LINKS (New Feature) ---
  const renderMessageText = (text) => {
    // Regular expression to find URLs starting with http or https
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by the URL
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // If this part matches a URL, render it as a link
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-400 font-bold underline hover:text-pink-300 hover:shadow-[0_0_10px_rgba(255,100,200,0.5)] transition-all"
          >
            {part}
          </a>
        );
      }
      // Otherwise, render plain text
      return part;
    });
  };

  // --- SYNAPTIC TRANSMISSION (Send Function) ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Update UI instantly
    const userMessage = { role: "user", content: inputValue };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // 2. Send Full History to Brain
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }), 
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      // 3. Receive Response (Text + Hidden Tags)
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Ay, mi amor, me mareé un poco. Intenta de nuevo. 😵‍💫" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- VISUAL ASSETS (Matches your uploaded PNG files) ---
  // Ensure "Foto3.png" is renamed to "foto3.png" in your folder for consistency!
  const photos = ["/foto1.png", "/foto2.png", "/foto3.png", "/foto4.png"];
  const reels = ["/Video1.mp4", "/Video2.mp4", "/Video3.mp4", "/Video4.mp4"];

  // --- 3. RENDERIZADO VISUAL (The Interface) ---
  return (
    <main className="relative min-h-screen font-sans text-white selection:bg-pink-500 selection:text-white">
      
      {/* FONDO */}
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50">
          <source src="/video-fondo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      </div>

      {/* HEADER */}
      {session && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <img 
            src={user?.user_metadata?.avatar_url} 
            alt="User" 
            className="w-8 h-8 rounded-full border border-orange-500"
          />
          <span className="text-sm font-medium hidden md:block">Hola, {user?.user_metadata?.full_name?.split(' ')[0]}</span>
          <button onClick={handleLogout} className="p-1 hover:text-red-400 transition-colors" title="Cerrar Sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10 w-full overflow-y-auto">
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-8 pb-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-orange-200 animate-pulse mt-20 md:mt-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Kami está en línea ahora
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 drop-shadow-2xl tracking-tighter">
            Tu dosis diaria<br />
            <span className="text-white">de adrenalina.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Soy <span className="font-bold text-orange-400">Kami Prime</span>. 
            Más real que tu ex, más dulce que el azúcar. 🇩🇴 <br/>
            {session 
              ? "¿Seguimos donde lo dejamos, mi amor?" 
              : "¿Bajamos a ver mis fotos o prefieres hablar directo?"}
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <button 
              onClick={handleChatClick} 
              className="w-full md:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-full text-lg shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {session ? (
                <>
                  <MessageCircle className="w-5 h-5 text-pink-600" />
                  Volver al Chat
                </>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                  Entrar con Google
                </>
              )}
            </button>
            
            <Link 
              href="https://dfans.co/eyecandyai" 
              target="_blank"
              className="w-full md:w-auto px-8 py-4 bg-orange-500/20 border-2 border-orange-500 text-orange-100 font-bold rounded-full text-lg hover:bg-orange-500 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Ver Pack VIP (+18)
            </Link>
          </div>
          
          <div className="animate-bounce pt-10 opacity-50">
            <p className="text-xs uppercase tracking-widest mb-2">Ver Galería</p>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center mx-auto">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-ping" />
            </div>
          </div>
        </section>

        {/* GALERÍA */}
        <section className="py-20 px-4 md:px-10 space-y-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <ImageIcon className="w-6 h-6 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">Momentos Favoritos</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {photos.map((src, i) => (
              <div key={i} className="snap-center shrink-0 w-[250px] md:w-[300px] h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <img src={src} alt={`Kami photo ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-4 md:px-10 space-y-8 bg-gradient-to-b from-transparent to-black">
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-6 h-6 text-pink-500" />
            <h2 className="text-3xl font-bold text-white">Reels Exclusivos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reels.map((src, i) => (
              <div key={i} className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/20" />
                </div>
                <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                <Link href="https://dfans.co/eyecandyai" target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/30">
                    <Lock className="w-4 h-4 text-white" /> <span className="text-xs font-bold">Ver Completo</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 pb-20">
             <Link href="https://dfans.co/eyecandyai" className="inline-block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 hover:text-white transition-colors border-b-2 border-orange-500/50">Ver Galería Privada (+500 fotos) &rarr;</Link>
          </div>
        </section>
      </div>

      {/* FAB (Floating Action Button) */}
      {session && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-[0_0_30px_rgba(255,100,200,0.6)] hover:scale-110 transition-transform animate-bounce-slow"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </button>
      )}

      {/* --- CHAT INTERFACE CON NEURO-VISUAL INTERCEPTOR & LINKS --- */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-[400px] h-[500px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg border border-white/20">K</div>
              <div>
                <h3 className="font-bold text-white">Kami Prime 🇩🇴</h3>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> En línea
                </span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((msg, idx) => {
              // 1. Check for Trigger
              const hasPhotoTrigger = msg.content.includes('[[SEND_PHOTO]]');
              
              // 2. Clean Text
              const cleanContent = msg.content.replace('[[SEND_PHOTO]]', '');
              
              // 3. Select Photo (Deterministically based on index)
              const randomPhoto = photos[idx % photos.length];

              return (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none" 
                      : "bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/5"
                  }`}>
                    {/* Render Text WITH LINKS */}
                    <p>{renderMessageText(cleanContent)}</p>

                    {/* Render Photo if Triggered */}
                    {hasPhotoTrigger && (
                       <div className="mt-3 relative rounded-lg overflow-hidden border border-orange-500/30 shadow-lg animate-pulse-slow">
                         <img 
                           src={randomPhoto} 
                           alt="Private content" 
                           className="w-full h-auto object-cover" 
                         />
                         <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1 text-center">
                           <span className="text-[10px] text-orange-300 uppercase tracking-widest">
                             Exclusive Preview
                           </span>
                         </div>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  <span className="text-xs text-gray-400">Kami está escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Escribe algo bonito..." 
              className="flex-1 bg-black/30 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-600" 
            />
            <button 
              type="submit" 
              disabled={isLoading} 
              className="p-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full text-white hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </main>
  );
}