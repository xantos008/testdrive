import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton, NewIconButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function ExistSteamModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  let newTabBrowser
  const goTo = () => {
	newTabBrowser = window.open('http://helpdesk.farm.game/', '_blank');
	newTabBrowser.focus();
  }
  
  const closeModal = () => {
    modal.close('existSteamModal')
  }

  return (
    <Modal visible={modal.visible.existSteamModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
				{currentLangData.existSteamTextOne}
				<br />
				<br />
				{currentLangData.existSteamTextTwo}
			</div>
			<div className={styles.blockCenter}>
				<NewIconButton
					onClick={goTo}
					title={currentLangData.existSteamButton}
					img="/img/buttonIcons/installextension.png"
				/>
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default ExistSteamModal
