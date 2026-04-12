import { useState, useEffect } from 'react';

export const useProStatus = () => {
  const [isPro, setIsPro] = useState<boolean>(false);

  useEffect(() => {
    // Check localStorage for Pro status
    const storedStatus = localStorage.getItem('prepai_pro_user');
    if (storedStatus === 'true') {
      setIsPro(true);
    }
  }, []);

  const upgradeToPro = () => {
    localStorage.setItem('prepai_pro_user', 'true');
    setIsPro(true);
  };

  const downgradeFromPro = () => {
    localStorage.removeItem('prepai_pro_user');
    setIsPro(false);
  };

  return { isPro, upgradeToPro, downgradeFromPro };
};
