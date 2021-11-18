import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, SimpleButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function CantParticipateModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  const closeModal = () => {
    modal.close('cantParticipateModal')
  }
  
  return (
    <Modal visible={modal.visible.cantParticipateModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
				{currentLangData.cantParticipateModalOne}
				<br />
				<br />
				{currentLangData.cantParticipateModalTwo}
			</div>
			<div className={styles.blockCenter}>
				<SimpleButton title="OK" onClick={closeModal} />
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default CantParticipateModal
