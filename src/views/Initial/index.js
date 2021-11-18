import React, { useState, useContext } from 'react'
import LangContext from '../../components/Lang/context/LangContext';
import styles from './initial.module.css'
import { ScatterLoadingButton, LynxButton, AllLoginButton, SwitchNetButton, NewIconButton } from '../../ui/index'
import { useStores, useModal } from '../../utils/hooks'
import { ScatterModal, LynxModal, WombatModal, WombatExistModal, WombatRestartModal, AllLoginModal } from '../../components/Modals/index'
import {
  downloadWombat,
  wombatHome
} from '../../config'
import HeaderMainScreen from '../../components/HeaderMainScreen/index'
import history from '../../history'

if(location.href.split('/ref/').length > 1){
	localStorage.setItem('ref', location.href.split('/ref/')[1])
}

function Initial() {
  const { user } = useStores()
  const scatterModal = useModal()
  const wombatModal = useModal()
  const wombatExistModal = useModal()
  const wombatRestartModal = useModal()
  const lynxModal = useModal()
  const allLoginModal = useModal()
  const [allLoginLoading, setAllLoginLoading] = useState(false)
  
  const { currentLangData } = useContext(LangContext);
  const isMobile = window.innerWidth < 1000
  
  window.addEventListener('resize', function(){
	  if(window.innerWidth > 1000){
		  history.push('/events')
	  }
  })
  
  let newTabBrowser
  const allLogin = () => {
	  //allLoginModal.open()
	  setAllLoginLoading(true)
	  user
	  .allLogin('TLOS', 'wombatAccount', '')
	  .then(() => {
        user.init()
      })
	  .catch((err) => {
		  console.log(err)
		  if(err == 'wombat found, but not TLOS chain'){
			  wombatExistModal.open()
		  } else if(err == 'restart wombat'){
			  wombatRestartModal.open()
		  } else {
			/*if(downloadWombat){
				newTabBrowser = window.open(downloadWombat, '_blank');
				newTabBrowser.focus();
			} else {
				newTabBrowser = window.open(wombatHome, '_blank');
				newTabBrowser.focus();
			}*/
			wombatModal.open()
		  }
		  setAllLoginLoading(false)
      })
  }
  
  const goDapp = ()=> {
	  location.href = 'https://dapp.farm.game'
  }
  
  document.title = currentLangData.initialTitle

  return (
    <div className={styles.wrap}>
	  <HeaderMainScreen />
	  <LynxModal
        visible={lynxModal.visible}
        closeModal={lynxModal.close}
      />
	  <ScatterModal
        visible={scatterModal.visible}
        closeModal={scatterModal.close}
      />
	  <AllLoginModal
        visible={allLoginModal.visible}
        closeModal={allLoginModal.close}
      />
	  <WombatModal
        visible={wombatModal.visible}
        closeModal={wombatModal.close}
      />
	  <WombatExistModal
        visible={wombatExistModal.visible}
        closeModal={wombatExistModal.close}
      />
	  <WombatRestartModal
        visible={wombatRestartModal.visible}
        closeModal={wombatRestartModal.close}
      />
      <div className={styles.mask}>
		{isMobile ? (
			<div className={styles.login}>
			  <h1>{currentLangData.mobileClosePart1} <span>{currentLangData.mobileClosePart2}</span> <br /> {currentLangData.mobileClosePart3} <br /><br /> {currentLangData.mobileClosePart4}</h1>
			</div>
		) : (
			<div className={styles.login}>
			  <h1>{currentLangData.welcomeTitleOne} <span>{currentLangData.welcomeTitleTwoGreen}</span> <br /> {currentLangData.welcomeTitleSecondLine}</h1>
			  <h3>{currentLangData.welcomeDescriptionOne} <br /> {currentLangData.welcomeDescriptionTwo} </h3>
			  <NewIconButton
				onClick={goDapp}
				img="/img/buttonIcons/startevent.png"
				title={currentLangData.startFarm}
				className={styles.moreWidthButton}
			  />
			  <div className={styles.underButton}>
				  {currentLangData.underButtonTextOne} 
					<br />
				  {currentLangData.underButtonTextTwo}
			  </div>
			</div>
		)}
      </div>
    </div>
  )
}

export default Initial
