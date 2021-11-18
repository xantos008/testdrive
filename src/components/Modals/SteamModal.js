import React, {useContext} from 'react'
import { Modal, Head, Body } from './Modal'
import { LinkSteamButton, UnlinkSteamButton, SteamConnectModalButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

function SteamModal() {
  const { currentLangData } = useContext(LangContext)
  const { user, modal } = useStores()
  const isMobile = window.innerWidth < 768
  const linked = user.isSteamLinked && user.steam && user.steam.username

  const closeModal = () => {
    modal.close('steam')
  }

  return (
    <Modal visible={modal.visible.steam} onBackgroundPress={closeModal} isMobile={isMobile}>
	  <div className={styles.mobileSteamWindow}>
		  <Head>
			<div style={{textAlign: 'center'}}>{currentLangData.linkFirst} {currentLangData.linkFirst2}
			</div>
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  </Head>
		  <Body>
			{linked ? (
				<div className={styles.steamConnectedBlock}>
					<div className={styles.steamLogo}>
						<img src="/img/buttonIcons/steamLogoModal.png" />
					</div>
					<div className={styles.steamTitles}>
						{currentLangData.steamConnectedModal}
					</div>
					<div className={styles.steamHasAccount}>
						<img src="/img/buttonIcons/steamConnected.png" />
						<span>{user.steam.username}</span>
					</div>
					<div className={`${styles.blockCenter} ${styles.buttonForDiscon}`}>
						<UnlinkSteamButton />
					</div>
				</div>
			) : (
				<div className={styles.steamConnectedBlock}>
					<div className={styles.steamLogo}>
						<img src="/img/buttonIcons/steamLogoModal.png" />
					</div>
					<div className={styles.steamTitles}>
						{currentLangData.steamConnectedModal}
					</div>
					<div className={styles.steamHasNoAccount}>
						<span>{currentLangData.steamNoAccountModal}</span>
					</div>
					<div className={`${styles.blockCenter} ${styles.buttonForCon}`}>
						<SteamConnectModalButton />
					</div>
				</div>
			)}
			<div className={styles.descSub}>
			  {currentLangData.makeSureSteam}
			  <br />
			  {currentLangData.makeSureSteam2}
			</div>
		  </Body>
	  </div>
    </Modal>
  )
}

export default observer(SteamModal)
