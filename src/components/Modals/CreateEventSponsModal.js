import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, SimpleButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function CreateEventSponsModal() {
  const { modal, user } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  const closeModal = () => {
    modal.close('createEventSponsModal')
  }
  
  return (
	<Modal visible={modal.visible.createEventSponsModal} onBackgroundPress={closeModal} isMobile={isMobile} onlyBody={true}>
      <Body onlyBody={true}>
        <div className={styles.centrilizeSucT}>
			{currentLangData.eventCreationSuccess}
        </div>
        <div className={styles.blockCenter}>
          <SimpleButton title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default CreateEventSponsModal
