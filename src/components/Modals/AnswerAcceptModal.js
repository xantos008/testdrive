import React, { useEffect, useState, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, NewIconButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Nickname from '../Nickname/index'
import LangContext from '../../components/Lang/context/LangContext'

function AnswerAcceptModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal, user } = useStores()
  const [steamData, setSteamData] = useState(() => ({
    username: '',
    profileUrl: '',
    avatarUrl: ''
  }))
  useEffect(() => {
    const getSteamData = async () => {
      const userInfo = await user.getUserInfo(modal.currentData.name_owner, 'wombatAccount')
      setSteamData(userInfo)
    }
    getSteamData()
  }, [])
  console.log('steamData', steamData)
  const closeModal = () => {
    modal.close('answerAccept')
  }
  const isMobile = window.innerWidth < 768
  return (
    <Modal visible={modal.visible.answerAccept} onBackgroundPress={closeModal} isMobile={isMobile}>
      <Head status="success">
		{currentLangData.acceptedRequest}
		<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
	  </Head>
      <Body>
		{isMobile ? (
			<div className={styles.opponent}>
			  <span className={styles.gray}>{currentLangData.yourOpponent}</span>
			  <div className={styles.opponentContent}>
				<Nickname
				  avatarUrl={steamData.avatarUrl}
				  profileUrl={steamData.profileUrl}
				  username={steamData.username}
				/>
			  </div>
			</div>
		) : (
			<div className={styles.opponent}>
			  <div className={styles.opponentContent}>
				<span className={styles.gray}>{currentLangData.yourOpponent}</span>
				<Nickname
				  avatarUrl={steamData.avatarUrl}
				  profileUrl={steamData.profileUrl}
				  username={steamData.username}
				/>
			  </div>
			</div>
		)}
        <Link
          to={`/event/${modal.currentData.key}`}
          className={styles.blockCenter}>
		  <NewIconButton
			title={currentLangData.goToEventButton} 
			onClick={closeModal}
			img="/img/buttonIcons/installextension.png"
		  />
        </Link>
      </Body>
    </Modal>
  )
}

export default observer(AnswerAcceptModal)
