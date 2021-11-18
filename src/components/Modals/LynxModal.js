import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button } from '../../ui/index'
import styles from './modal.module.css'
import LangContext from '../../components/Lang/context/LangContext'
import {
  downloadLynx,
  lynxHome
} from '../../config'

function LynxModal({ visible, closeModal }) {
  const { currentLangData } = useContext(LangContext)
  return (
    <Modal visible={visible} onBackgroundPress={closeModal}>
      <Head status="error">
		{currentLangData.lynxWalletNotFoundModalTitle}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
	  </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
		 {currentLangData.noWalletFound} {currentLangData.pleaseRunDapp} <a href="https://downloads.lynxwallet.io">Lynx Wallet</a>.
		  <br />
		  {currentLangData.walletDownloadStarts}
		  <br />
		  {currentLangData.ifNotPart1} <a className={styles.unders} href={downloadLynx} target="_blank">{currentLangData.ifNotPart2}</a> {currentLangData.ifNotPart3} <a className={styles.unders} href={lynxHome} target="_blank">{currentLangData.ifNotPart4}</a>
        </div>
        <div className={styles.blockCenter}>
          <Button title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
}

export default LynxModal
