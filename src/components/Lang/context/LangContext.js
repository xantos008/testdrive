import React, { useState, useLayoutEffect } from 'react';
import en from './en'
import ru from './ru'

const LangContext = React.createContext({
  lang: '',
  currentLangData: {},
  switchLang: () => {},
});

const langData = {
  'ru': ru,
  'en': en
}

export default LangContext;

export function LangProvider (props) {

  const [lang, setLang] = useState(localStorage.getItem('currLang') || 'en');

  useLayoutEffect(() => {
    const selectedLang = localStorage.getItem('currLang');

    if (selectedLang) {
      setLang(selectedLang);
    } 
  }, [lang])

  const switchLang = (ln) => {
    setLang(ln);
    localStorage.setItem('currLang', ln);
  };

  return (
    <LangContext.Provider value={{
      lang, 
      switchLang, 
      currentLangData: langData[lang]
    }}>
      {props.children}
    </LangContext.Provider>
  );
};