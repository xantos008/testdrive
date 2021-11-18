import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton, NewIconButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores, useModal } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'
import { WombatModal, WombatExistModal, WombatRestartModal } from '../../components/Modals/index'

function LoginPageModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  const wombatModal = useModal()
  const wombatExistModal = useModal()
  const wombatRestartModal = useModal()
  
  let newTabBrowser
  
  const closeModal = () => {
    modal.close('loginPageModal')
  }
  
  const allLogin = () => {
	  modal.open('loginPageLoadModal')
		
		  user
		  .allLogin('TLOS', 'wombatAccount', '')
		  .then(() => {
			user.init().then(() => {
				modal.close('loginPageLoadModal')
				location.reload()
			})
		  })
		  .catch((err) => {
			  modal.close('loginPageLoadModal')
			  console.log(err)
			  if(err == 'wombat found, but not TLOS chain'){
				  wombatExistModal.open()
			  } else if (err == 'restart wombat'){
				  wombatRestartModal.open()
			  } else {
				wombatModal.open()
			  }
		  })
  }
  
  return (
	<div>
    <Modal visible={modal.visible.loginPageModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={`${styles.desc} ${styles.mtAgainst}`}>
				<div className={styles.preLoginTitleMidal}>{currentLangData.loginModalOne}</div>
				<div className={styles.preLoginSubTitleMidal}>{currentLangData.loginModalTwo}</div>
			</div>
			<div className={styles.blockCenter}>
				<NewIconButton
					onClick={allLogin}
					img="/img/buttonIcons/login.png"
					title={currentLangData.login}
				/>
			</div>
		  </div>
		</div>
    </Modal>
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
	</div>
  )
}

export default LoginPageModal
