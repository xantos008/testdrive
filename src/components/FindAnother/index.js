import React, {useContext} from 'react'
import styles from './empty.module.css'
import { Button, CreateEventButton, NewIconButton } from '../../ui/index'
import { Link } from 'react-router-dom'
import LangContext from '../Lang/context/LangContext'
import { useStores, useModal } from '../../utils/hooks'
import { copyToClipboard } from '../../utils/lib'
import { WombatModal, WombatExistModal } from '../Modals/index'  

function FindAnotherEvents() {
  const { currentLangData } = useContext(LangContext)
  const { user, modal } = useStores()
  const linkUrl = `${location.origin}/ref/${user.name}`
  const copy = () => {
    copyToClipboard(linkUrl)
  }
  const isMobile = window.innerWidth < 568
  const isGuest = user.isGuest
  
  const wombatModal = useModal()
  const wombatExistModal = useModal()
  
  const allLogin = () => {
		modal.open('loginPageLoadModal')
		
		  user
		  .allLogin('TLOS', 'wombatAccount', '')
		  .then(() => {
			user.init().then(() => {
				modal.close('loginPageLoadModal')
				location.reload()
			})
		  })
		  .catch((err) => {
			  modal.close('loginPageLoadModal')
			  console.log(err)
			  if(err == 'wombat found, but not TLOS chain'){
				  wombatExistModal.open()
			  } else {
				wombatModal.open()
			  }
		  })
  }

  return (
    <div className={styles.empty}>
	  {isGuest ? (
		<div>
		  <div className={styles.title}>{currentLangData.guestDidntFindYourEvent}</div>
		  <div className={styles.titleSub}>{currentLangData.guestInviteFriendAndPlay}</div>


			<div className={styles.copyButton}>
				<NewIconButton
					onClick={allLogin}
					img="/img/buttonIcons/login.png"
					title={currentLangData.login}
				/>
			</div>

			<WombatModal
				visible={wombatModal.visible}
				closeModal={wombatModal.close}
			/>
			<WombatExistModal
				visible={wombatExistModal.visible}
				closeModal={wombatExistModal.close}
			/>
		</div>
	  ) : (
		<div>
		  <div className={styles.title}>{currentLangData.didntFindYourEvent}</div>
		  <div className={styles.titleSub}>{currentLangData.inviteFriendAndPlay}</div>
			
		  {isMobile ? (
			  <div className={styles.copyButton} style={{height: 'auto', margin: '-20px 0 5px 0'}}>
				<NewIconButton title={currentLangData.copyLinkTitle} img="/img/buttonIcons/copylink.png" onClick={copy}/>
			  </div>
		  ) : (
			  <div className={styles.linkContainer} onClick={copy}>
				<div className={styles.link}>{linkUrl}</div>
				<div className={styles.button}>
				  <img src="/img/copy_24px.png" />
				</div>
			  </div>
		  )}
		  
		  <div className={styles.subTextLink}>
			{currentLangData.copyYoutRefLink}
		  </div>
		  {!isMobile && (
			  <div className={styles.copyButton}>
				<NewIconButton title={currentLangData.copyLinkTitle} img="/img/buttonIcons/copylink.png" onClick={copy}/>
			  </div>
		  )}
		</div>
	  )}
      
    </div>
  )
}

export { FindAnotherEvents }
