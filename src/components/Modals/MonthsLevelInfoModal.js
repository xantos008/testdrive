import React, {useContext, Fragment} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton } from '../../ui/index'
import styles from './greyModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'


function MonthsLevelInfoModal() {
  const { modal, user, currency } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
  
  const closeModal = () => {
    modal.close('monthsLevelInfoModal')
  }
  let progress, min, max, level, daysLag
		
  if(currency.isFirstMonth){
		let start, finish
		let rD = new Date(user.steam.registeredTime)
		let nD = new Date()
		nD.setDate(nD.getDate() - 30)
		daysLag = Math.ceil(Math.abs(nD.getTime() - rD.getTime()) / (1000 * 3600 * 24));
		min = daysLag
		max = 30
  } else {
	  min = currency.playedInMonths
	  level = currency.nextLevelComission
	  max = currency.playedInMonths + currency.moreGames
  }

  if(min == 0){
	  progress = 0
  } else if(min == max){
	  progress = 100
  } else {
	  progress = (min/max) * 100
  }
  
  return (
    <Modal visible={modal.visible.monthsLevelInfoModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={styles.monthInfoTitle}>
				{currentLangData.serviceCommissionGrades}
			</div>
			<div className={styles.monthInfoSubTitle}>
				{currentLangData.playMorePlayLess}
			</div>
			{currency.isFirstMonth ? (
				<div className={styles.monthInfoCurrentInfo}>
					<table>
						<tbody>
							<tr className={styles.monthInfoTableBrush}>
								<td className={styles.columnOne}>
									{currentLangData.freeDaysLeft}
								</td>
								<td className={`${styles.columnTwo} ${styles.movePercent}`}>
									{min}
								</td>
							</tr>
						</tbody>
					</table>
					<div className={styles.roundedMessage}>
						<div className={styles.iconOfMessage}>
							<img src="/img/infoRounded.png" />
						</div>
						<div className={styles.textOfMessage}>
							{currentLangData.referralPreInfo}
						</div>
					</div>
				</div>
			) : (
				<div className={styles.monthInfoCurrentInfo}>
					<table>
						<tbody>
							<tr className={styles.monthInfoTableBrush}>
								<td className={styles.columnOne}>
									{currentLangData.currentServiceFee}
								</td>
								<td className={`${styles.columnTwo} ${styles.movePercent}`}>
									{currency.commission}%
								</td>
							</tr>
							<tr className={styles.monthInfoTableBrush}>
								<td className={styles.columnOne}>
									{currentLangData.eventsToNextLevel}
								</td>
								<td className={styles.columnTwo}>
									{currency.moreGames}
								</td>
							</tr>
						</tbody>
					</table>
					<div className={styles.progressLine}>
						<div className={styles.progressBar}>
							<div className={styles.progress} style={{width: progress + '%'}}></div>
						</div>
					</div>
				</div>
			)}
			<div className={styles.tableOfWonders}>
				<div className={styles.tablesHead}>
					<div className={styles.celFirst}>
						{currentLangData.monthlyCompletionRate}
					</div>
					<div className={styles.celSecond}>
						{currentLangData.serviceFeeAmount}
					</div>
				</div>
				<div className={styles.tablesLines}>
					{user.levelsListing.map((level, index) => (
						<div className={currency.playedInMonths >= level.gamesPlayedMin && currency.playedInMonths <= currency.playedInMonths ? `${styles.tableRow} ${styles.currentLevelio}` : `${styles.tableRow}`}>
							<div className={styles.celFirst}>
								{level.gamesPlayedMax ? `${level.gamesPlayedMin} - ${level.gamesPlayedMax}` : `${currentLangData.over} ${level.gamesPlayedMin}`}
							</div>
							<div className={styles.celSecond}>
								{level.commission}%
							</div>
						</div>
					))}
				</div>
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default MonthsLevelInfoModal
