import React, {useContext} from 'react'
import { Modal, Body } from './Modal'
import { Loader } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function ConfirmingReadyModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal } = useStores()
  const isMobile = window.innerWidth < 768

  const closeModal = () => {
    modal.close('confirmingReady')
  }

  return (
    <Modal visible={modal.visible.confirmingReady} onBackgroundPress={closeModal} isMobile={isMobile} onlyBody={true}>
      <Body onlyBody={true}>
        <div className={styles.rejectBlock}>
			{currentLangData.confirmingReady}
        </div>
        <div className={styles.blockCenter}>
          <Loader visible={true} />
        </div>
      </Body>
    </Modal>
  )
}

export default observer(ConfirmingReadyModal)
