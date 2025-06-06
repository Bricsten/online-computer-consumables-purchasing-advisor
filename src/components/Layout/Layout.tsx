import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../UI/WhatsAppButton';
import ReviewModal from '../Reviews/ReviewModal';
import useReviewModalStore from '../../store/reviewModalStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isOpen, closeModal } = useReviewModalStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${!isHomePage ? 'pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="bottom-right" />
      <ReviewModal isOpen={isOpen} onClose={closeModal} />
      
      {/* Chatbase AI chatbot integration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="opFmfxhKOlEZ_kH52bS66";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
          `
        }}
      />
    </div>
  );
};

export default Layout;