import React, {useContext} from 'react'
import { Modal, Body } from './Modal'
import { Loader } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function LobbyLeavingModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal } = useStores()
  const isMobile = window.innerWidth < 768

  const closeModal = () => {
    modal.close('lobbyLeaving')
  }

  return (
    <Modal visible={modal.visible.lobbyLeaving} onBackgroundPress={closeModal} isMobile={isMobile} onlyBody={true}>
      <Body onlyBody={true}>
        <div className={styles.rejectBlock}>
			{currentLangData.leavingLobby}
        </div>
        <div className={styles.blockCenter}>
          <Loader visible={true} />
        </div>
      </Body>
    </Modal>
  )
}

export default observer(LobbyLeavingModal)
