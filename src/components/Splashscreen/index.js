import React, { Component, useState, useEffect, useContext } from 'react'
import { useStores } from '../../utils/hooks'
import styles from './splashscreen.module.css'
import { checkScatterRegex } from '../../utils/lib'

import history from '../../history'

import LangSwitch from '../../components/Lang/LangSwitch';
import { fetchMock } from '../../components/Lang/context/apiMock';
import LangContext from '../../components/Lang/context/LangContext';
import { LangProvider } from '../../components/Lang/context/LangContext';

function LoadingMessage(curLang) {
  return (
    <div className={styles.splashScreen}>
		<div className={styles.splashScreenText}>
			{curLang == 'ru' ? 'Подождите, идёт загрука.' : 'Wait a moment while we load your app.'}
		</div>
    </div>
  )
}

function withSplashScreen(WrappedComponent) {
  return function Component(props) {
	const isMobile = window.innerWidth < 1000
    const [loading, setLoading] = useState( isMobile ? false : true)
	const onlyMainScreen = location.hostname === "farm.game"
	
	if(loading){
		document.body.style.overflow = 'hidden'
		document.getElementById('root').style.overflow = 'hidden'
		document.getElementById('root').style.padding = '0'
		document.getElementById('root').style.height = '100vh'
		
	}
	
    const { user, multilanguage } = useStores()
	
	  const [state, setState] = useState([]);

	  const { lang, currentLangData } = useContext(LangContext);
	  useEffect(() => {
		fetchMock(lang)
		  .then(setState)
	  }, [lang]);
	
	if(!onlyMainScreen){
	
		useEffect(() => {
		  const autoLogin = async () => {
			await user.autoLogin()
			if (user.isAuthenticated || user.isGuest) {
			  await user.init()
			} else {

			}
		  }
		  autoLogin().finally(() => {
			if(isMobile){
				setLoading(false)
			} else {
				setTimeout(function(){
					setLoading(false)
				}, 3000)
			}
		  })
		}, [])
	
	} else {

			setTimeout(function(){
				setLoading(false)
			}, 3000)

	}
	
	if(!loading){
		document.body.removeAttribute('style')
		document.getElementById('root').removeAttribute('style')
	}
    // while checking user session, show "loading" message
    if (loading) return LoadingMessage(localStorage.getItem('currLang'))

    // otherwise, show the desired route
    return <LangProvider><WrappedComponent {...props} /></LangProvider>
  }
}

export default withSplashScreen
