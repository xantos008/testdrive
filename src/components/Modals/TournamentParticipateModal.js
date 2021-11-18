import React, { useState, Fragment, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import User from '../../store/user'
import {
  NewIconButton
} from '../../ui/index'

import LangContext from '../../components/Lang/context/LangContext'

function TournamentParticipateModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal, currency, events, tournaments, user } = useStores()
  const isMobile = window.innerWidth < 768
  const [fio, setFio] = useState('')
  const [vk, setVk] = useState('')
  const paymentRate = currency.getTlosFromRub(100,2)
  const freeFee = user.stats.wonMoney > 0 || user.stats.testGamesWonMoney > 0
  const avatarUrl = user.steam.avatarUrl
  const [canClick, setCanClick] = useState(true)

  const closeModal = () => {
    modal.close('tournamentParticipateModal')
  }
  
  const tournamentParticipate = async () => {
	setCanClick(false)
    try {
		if(freeFee){
			await tournaments.participate({
			  accountName: user.name,
			  tournamentId: 1,
			  avatarUrl: avatarUrl,
			  steamId: user.steam.id,
			  fio: fio,
			  vk: vk,
			  paymentRate: false
			})
		} else {
			await tournaments.participate({
			  accountName: user.name,
			  tournamentId: 1,
			  steamId: user.steam.id,
			  avatarUrl: avatarUrl,
			  fio: fio,
			  vk: vk,
			  paymentRate: paymentRate
			})
		}
    } catch (err) {
		console.log('error ofcreation', err)
		modal.openError("Sorry, something went wrong. Please check fields and your balance")
      /*if (typeof err === 'string') {
		let detais
		if(err == 'Modal Closed.'){
			detais = err
			modal.openError(detais)
		} else {
			detais = JSON.parse(err).error.details[0].message
			modal.openError(detais)
		}
      }*/
    }
  }
  
  const onChangeFio = event => {
	setFio(event.target.value)
  }
  const onChangeVk  = event => {
	setVk(event.target.value)
  }

  return (
    <Modal
      visible={modal.visible.tournamentParticipateModal}
      onBackgroundPress={closeModal}
      style={{ minWidth: 676 }}>
		{!isMobile && (
			<div className={styles.createModalOnDesktop}>
			  <Head>
				LOVE.FARM.PROTOS
				<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
			  </Head>
			  <Body>
				<div className={styles.justForm}>
					<div className={styles.eventnameTitle}>{currentLangData.tournamentFIO}</div>
					<div>
						<input
							type="text"
							name="fio"
							defaultValue={fio}
							onChange={onChangeFio}
						/>
					</div>
				</div>
				<div className={styles.justForm}>
					<div className={styles.eventnameTitle}>VK</div>
					<div>
						<input
							type="text"
							name="vk"
							defaultValue={vk}
							onChange={onChangeVk}
						/>
					</div>
				</div>
				
				{ (user.stats.wonMoney == 0 || user.stats.testGamesWonMoney == 0) && (
					<div className={styles.feeOrNotFee}>
						<p>{currentLangData.tournamentWords1} <span> {paymentRate} </span> TLOS </p>
						<p>{currentLangData.tournamentWords2}</p>
					</div>
				)}

				
				<div className={styles.blockCenter}>
					<NewIconButton
					  onClick={canClick ? tournamentParticipate : null}
					  title={currentLangData.participateTournament}
					  img="/img/playTournament.svg"
					/>
				</div>
				
			  </Body>
			</div>
		)}
    </Modal>
  )
}

export default observer(TournamentParticipateModal)

