import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, SimpleButton } from '../../ui/index'
import styles from './WombatModal.module.css'
import LangContext from '../../components/Lang/context/LangContext'

function WombatRestartModal({ visible, closeModal }) {
  const { currentLangData } = useContext(LangContext)
  
  return (
    <Modal visible={visible} onBackgroundPress={closeModal}>
      <Head status="error">
		{currentLangData.wombatNeedsToBeRestared}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
	  </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
          {currentLangData.restartWombat}
		</div>
        <div className={styles.blockCenter}>
          <SimpleButton title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default WombatRestartModal
