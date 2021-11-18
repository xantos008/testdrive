import React, { useEffect, useState, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, NewIconButton, SimpleButton } from '../../ui/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import Nickname from '../Nickname/index'
import Rate from '../Rate/index'
import Currency from '../../store/currency'
import { RenderExpires } from '../Table/index'
import LangContext from '../../components/Lang/context/LangContext'

function OpponentFoundModal() {
  const { currentLangData } = useContext(LangContext)
  //const wallets = {'lynxAccount', 'scatterAccount'}
  const { modal, events, user } = useStores()
  const [steamData, setSteamData] = useState(() => ({
    username: '',
    profileUrl: '',
    avatarUrl: '',
    wallet: ''
  }))
  const data = modal.currentData
  const closeModal = () => {
    modal.close('opponentFound')
  }
  const isMobile = window.innerWidth < 768
  const [canClick, setCanClick] = useState(true)

  useEffect(() => {
    const getSteamData = async () => {
	  //Todo Избавиться от костыля
	  //console.log('data', data)
	  
	  let userInfoTry
	  
	  try {
		  userInfoTry = await user.getUserInfo(data.name_accept, 'wombatAccount')
		  if(userInfoTry){
			  const userInfo = userInfoTry
			  setSteamData(userInfo)
		  }
	  } catch (err) {
		  
	  }
	  
	  //const userInfo = await user.getUserInfo(data.name_accept)
      //setSteamData(userInfo)
    }
    getSteamData()
  }, [])
  const accept = () => {
	setCanClick(false)
    events.sendBlockchainAnswer(data, 2)
  }

  const reject = () => {
	setCanClick(false)
    events.sendBlockchainAnswer(data, 0)
  }
  console.log('priceAccept', data.price_accept)
  const priceAccept = parseFloat(data.price_accept)
  return (
    <Modal visible={modal.visible.opponentFound} onBackgroundPress={closeModal}>
	  <div className={styles.opponentFoundMobile}>
		  <Head status="success">
			{currentLangData.opponentFoundModalTitle}
			<div className={styles.headSub}>
			  {steamData.username} {currentLangData.wantsToFight}
			</div>
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  </Head>
		  <Body>
			<div className={`${styles.selectsRow} ${styles.opponentCentered}`}>
			  <Nickname
				profileUrl={steamData.profileUrl}
				avatarUrl={steamData.avatarUrl}
				username={steamData.username}
				big
			  />
			</div>
			<div className={styles.info}>
			  <div>
				<div className={styles.infoTitle}>{currentLangData.discipline}</div>
				<div>{data.discipline}</div>
			  </div>
			  <div>
				<div className={styles.infoTitle}>{currentLangData.mode}</div>
				<div>{data.mode}</div>
			  </div>
			  <div>
				<div className={styles.infoTitle}>{currentLangData.server}</div>
				<div>Europe</div>
			  </div>
			</div>
			<Rate rate={priceAccept}>
			  <div className={styles.sum}>
				{priceAccept.toFixed(2)}
				<span className={styles.sumCurrency}>{Currency.curr}</span>
			  </div>
			</Rate>
			<div className={styles.blockCenter}>
			  <NewIconButton 
				title={currentLangData.acceptBig} 
				onClick={canClick ? accept : null}
				img="/img/buttonIcons/plus.png"
			  />
			  <SimpleButton 
			    title={currentLangData.rejectBig}
				onClick={canClick ? reject : null}
				className={styles.btn}
			  />
			</div>
			<div className={styles.descSub}>
				{currentLangData.autoReject}{' '}
			  <RenderExpires expires={data.accept_expires} />
			</div>
		  </Body>
	  </div>
    </Modal>
  )
}

export default observer(OpponentFoundModal)
