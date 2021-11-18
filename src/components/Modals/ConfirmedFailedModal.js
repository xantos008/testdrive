import React, {useContext} from 'react'
import { Modal, Body } from './Modal'
import { Loader, SimpleButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function ConfirmedFailedModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal } = useStores()
  const isMobile = window.innerWidth < 768

  const closeModal = () => {
    modal.close('confirmedFailed')
  }

  return (
    <Modal visible={modal.visible.confirmedFailed} onBackgroundPress={closeModal} isMobile={isMobile} onlyBody={true}>
      <Body onlyBody={true}>
        <div className={styles.rejectBlock}>
			{currentLangData.confirmedFailed}
        </div>
        <div className={styles.blockCenter}>
          <SimpleButton title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default observer(ConfirmedFailedModal)
