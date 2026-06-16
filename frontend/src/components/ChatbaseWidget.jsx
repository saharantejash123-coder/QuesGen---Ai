import { useEffect } from 'react';

/*
  ChatBase.co embedded chatbot.

  To connect your own bot:
  1. Go to chatbase.co → create / open your chatbot
  2. Go to Connect → Embed → copy the chatbotId
  3. Replace CHATBOT_ID_HERE below with that ID
*/
const CHATBOT_ID = '8reY9mRYpNkJdMgGdCZAr';

export default function ChatbaseWidget() {
  useEffect(() => {
    if (!CHATBOT_ID || CHATBOT_ID === 'CHATBOT_ID_HERE') return;

    // Inject chatbase config
    window.chatbaseConfig = { chatbotId: CHATBOT_ID };

    // Inject embed script only once
    if (document.getElementById('chatbase-script')) return;
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = CHATBOT_ID;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // clean up on unmount (optional — chatbase script is lightweight)
      const el = document.getElementById(CHATBOT_ID);
      if (el) el.remove();
    };
  }, []);

  return null; // ChatBase renders its own floating button
}
