import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, SimpleButton } from '../../ui/index'
import styles from './modal.module.css'
import LangContext from '../../components/Lang/context/LangContext'
import {
  downloadWombat,
  wombatHome
} from '../../config'

function ScatterModal({ visible, closeModal }) {
  const { currentLangData } = useContext(LangContext)
  return (
    <Modal visible={visible} onBackgroundPress={closeModal}>
      <Head status="error">
		{currentLangData.wombatNotFound}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
	  </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
          {currentLangData.pleaseWombat}
		  <br />
		  {currentLangData.wombatDownloadInfo}
		  <br />
		  {currentLangData.ifNotPart1} <a className={styles.unders} href={downloadWombat} target="_blank">{currentLangData.ifNotPart2}</a> {currentLangData.ifNotPart3} <a className={styles.unders} href={wombatHome} target="_blank">{currentLangData.ifNotPart4}</a>
        </div>
        <div className={styles.blockCenter}>
          <SimpleButton title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default ScatterModal
