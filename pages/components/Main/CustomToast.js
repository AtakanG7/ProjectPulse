import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OneTimeToastSequence = () => {
  useEffect(() => {
    const hasShownToasts = localStorage.getItem('hasShownToasts');

    if (!hasShownToasts) {
      const messages = [
        { content: "Hi there, it's Atakan!", delay: 2000 },
        { content: "I developed this app for you for free!", delay: 3000 },
        { content: "If you're interested...", delay: 6000 },
        { 
          content: (
            <div>
              <p>Support this free project</p>
              <a 
                href="https://buymeacoffee.com/atakangul" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-500 text-white px-2 py-1 rounded mt-2 inline-block"
              >
                Buy me a coffee
              </a>
            </div>
          ), 
          delay: 10000 
        }
      ];

      messages.forEach(({ content, delay }) => {
        setTimeout(() => {
          toast(content, {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, delay);
      });

      localStorage.setItem('hasShownToasts', 'true');
    }
  }, []);

  return null;
};

export default OneTimeToastSequence;