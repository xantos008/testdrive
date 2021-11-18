import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { Button } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function TestGamesEnd() {
  const { currentLangData } = useContext(LangContext)
  const { modal, user } = useStores()
  const isMobile = window.innerWidth < 768

  const closeModal = () => {
    modal.close('testGamesEnd')
  }

  return (
    <Modal visible={modal.visible.testGamesEnd} onBackgroundPress={closeModal} isMobile={isMobile}>
	   <Head>
		{currentLangData.congratulations}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
	   </Head>
      <Body>
        <div className={`${styles.desc} ${styles.mt0}`}>
			{currentLangData.tenGamesWasPlayed} <br />
			<br />
			{currentLangData.youHaveWon} {user.stats.testGamesWonMatches} {currentLangData.games}.<br />
			{currentLangData.youHaveWon} {user.stats.testGamesWonMoney} {user.symbol}<br />
			<br />
			{currentLangData.youCanContinue}
		</div>
        <div className={styles.blockCenter}>
          <Button title="OK" onClick={closeModal} />
        </div>
      </Body>
    </Modal>
  )
} 

export default observer(TestGamesEnd)