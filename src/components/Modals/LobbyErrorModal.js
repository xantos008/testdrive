import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, SimpleButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function LobbyErrorModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal } = useStores()
  const isMobile = window.innerWidth < 768

  const closeModal = () => {
    modal.close('lobbyError')
  }

  return (
    <Modal visible={modal.visible.lobbyError} onBackgroundPress={closeModal} isMobile={isMobile}>
      <Head status="error">
		{currentLangData.lobbyCreatinFailed}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
	  </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
          {currentLangData.lobbyCreatinFailedMessage1}
          <br />
          {currentLangData.lobbyCreatinFailedMessage2}
          <br />
          <br />
          {currentLangData.lobbyCreatinFailedMessage3}
        </div>
        <div className={styles.blockCenter}>
          <SimpleButton title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default observer(LobbyErrorModal)
