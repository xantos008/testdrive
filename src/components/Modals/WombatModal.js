import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton, NewIconButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import LangContext from '../../components/Lang/context/LangContext'
import {
  downloadWombat,
  wombatHome
} from '../../config'

function WombatModal({ visible, closeModal }) {
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  let newTabBrowser
  const goTo = () => {
		if(downloadWombat){
			newTabBrowser = window.open(downloadWombat, '_blank');
			newTabBrowser.focus();
		} else {
			newTabBrowser = window.open(wombatHome, '_blank');
			newTabBrowser.focus();
		}
  }
  
  return (
    <Modal visible={visible} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat}`}>
		  <div className={`${styles.closeIcon} ${styles.originalCloseIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
			  <div  className={styles.wombatModalLogo}>
				<img src="/img/WombatIcon.png" />
			  </div>
			  {currentLangData.installWombatOne} <br /> {currentLangData.installWombatTwo}
			  <br />
			  <br />
			  <span className={styles.secondDesc}> {currentLangData.installWombatDescriptionOne} <br /> {currentLangData.installWombatDescriptionTwo} </span>
			  <br />
			</div>
			<div className={styles.blockCenter}>
				<NewIconButton
					onClick={goTo}
					img="/img/buttonIcons/installextension.png"
					title={currentLangData.installWombatButton}
				/>
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default WombatModal
