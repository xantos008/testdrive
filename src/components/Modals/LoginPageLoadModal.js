import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton, NewIconButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores, useModal } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'
import { WombatModal, WombatExistModal } from '../../components/Modals/index'

function LoginPageLoadModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768

  
  const closeModal = () => {
    modal.close('loginPageLoadModal')
  }
  
  return (
    <Modal visible={modal.visible.loginPageLoadModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
				{currentLangData.loginModalLoadOne}
				<br />
				<br />
				{currentLangData.loginModalLoadTwo}
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default LoginPageLoadModal
