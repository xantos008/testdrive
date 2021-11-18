import React, { useContext } from 'react';
import LangContext from './context/LangContext';

export default function LangSwitch(props) {
  const { switchLang, lang } = useContext(LangContext);

  const backColor = (e) => {
	  let fe1,fe2,fe11,fe22
	  for(let i = 0; i < e.target.classList.length; i++){
		  if(e.target.classList[i] !== 'active'){
			  fe1 = document.getElementsByClassName('LangSwitchMainTitle')[0]
			  fe2 = fe1.getElementsByClassName('active')[0]
			  
			  fe11 = document.getElementsByClassName('LangSwitchMainTitle')[1]
			  
			  if(fe11){
				  fe22 = fe11.getElementsByClassName('active')[0]
				  if(fe22){
					  fe22.classList.remove('active');
				  }
			  }
			  
			  if(fe2){
				fe2.classList.remove('active');
			  }
		  }
	  }
  }
  
  const backColorBack = () => {
		let fe1,fe2,fe11,fe22
		fe1 = document.getElementsByClassName('LangSwitchMainTitle')[0]
		fe2 = fe1.getElementsByClassName(lang)[0]
		
		fe11 = document.getElementsByClassName('LangSwitchMainTitle')[1]
		
		if(fe11){
			fe22 = fe11.getElementsByClassName(lang)[0]
			if(fe22){
				fe22.classList.add('active');
			}
		}
		
		if(fe2){
			fe2.classList.add('active');
		}
  }

  return (
	<div className='LangSwitch'>
		    <div className='LangSwitchMainTitle'>
				<ul>
					<li onMouseEnter={backColor} onMouseLeave={backColorBack} onClick={() => switchLang('en')} className={lang === 'en' ? 'active oneLang en' : 'oneLang en'}>en</li>
					<li onMouseEnter={backColor} onMouseLeave={backColorBack} onClick={() => switchLang('ru')} className={lang === 'ru' ? 'active twoLang ru' : 'twoLang ru'}>ru</li>
					<div className='hr'></div>
				</ul>
			</div>
	</div>
  )
}