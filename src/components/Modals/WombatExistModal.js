import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button } from '../../ui/index'
import styles from './WombatModal.module.css'
import LangContext from '../../components/Lang/context/LangContext'

function WombatExistModal({ visible, closeModal }) {
  const { currentLangData } = useContext(LangContext)
  return (
    <Modal visible={visible} onBackgroundPress={closeModal}>
      <Head status="error">
		{currentLangData.wombatTelosNotFound}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
	  </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
          {currentLangData.wombatNoTelosFirst}
		  <br /><br />
		  {currentLangData.wombatNoTelosSecond}
		  <br />
		  {currentLangData.wombatNoTelosThird}
		</div>
        <div className={styles.blockCenter}>
          <Button title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default WombatExistModal
