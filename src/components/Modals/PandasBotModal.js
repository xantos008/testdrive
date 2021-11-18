import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton, NewIconButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function PandasBotModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  let newTabBrowser
  const goTo = () => {
	newTabBrowser = window.open('https://telegram.im/@PandasPaymentBot', '_blank');
	newTabBrowser.focus();
  }
  
  const closeModal = () => {
    modal.close('pandasBotModal')
  }
  
  return (
    <Modal visible={modal.visible.pandasBotModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
				{currentLangData.pandasModalBotOne}
				<br />
				<br />
				{currentLangData.pandasModalBotTwo}
			</div>
			<div className={styles.blockCenter}>
				<NewIconButton
					onClick={goTo}
					img="/img/buttonIcons/installextension.png"
					title={currentLangData.goToPandasBot}
				/>
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default PandasBotModal
