
import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ParambaChat() {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://parambaquntum.app.n8n.cloud/webhook/da291c7c-5e9d-4c10-b4d7-b63897a0530f/chat',
      target: '#n8n-chat',
      mode: 'window',
showWelcomeScreen: false,
loadPreviousSession: true,
initialMessages: [
  'Hello! Welcome to Paramba Quantum.',
  'I am your Paramba Quantum AI Assistant. How can I help your business today?'
],
i18n: {
  en: {
    title: 'Paramba Quantum AI',
    subtitle: 'Your Digital Business Assistant',
    footer: 'Powered by Paramba Quantum',
    getStarted: 'Start Conversation',
    inputPlaceholder: 'Ask us anything...'
  }
}
    });
  }, []);

  return <div id="n8n-chat"></div>;
}
