import React, {useContext} from 'react'
import styles from './level.module.css'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'
import { useStores } from '../../utils/hooks'
  

function LevelProgress({ min, max, level }) {
  const { currentLangData } = useContext(LangContext)
  const { user, modal, currency } = useStores()
  
  const openReferralInfo = () => {
	  modal.open('monthsLevelInfoModal')
  }
  
  let isSpecial = false
  if(user.userSpecial){
	  if(user.userSpecial.payableCommission >= 0){
		  isSpecial = true
	  }
  }
  
  let progress, minCurr = min, maxCurr = max, levelCurr = level, daysLag
		
  if(currency.isFirstMonth){
		let start, finish
		let rD = new Date(user.steam.registeredTime)
		let nD = new Date()
		nD.setDate(nD.getDate() - 30)
		daysLag = Math.ceil(Math.abs(nD.getTime() - rD.getTime()) / (1000 * 3600 * 24));
		minCurr = daysLag
		maxCurr = 30
  } else {
	  minCurr = currency.playedInMonths
	  levelCurr = currency.nextLevelComission
	  maxCurr = currency.playedInMonths + currency.moreGames
  }
  
  if(minCurr == 0){
	progress = 0
  } else if(minCurr == maxCurr){
	progress = 100
  } else {
	progress = (minCurr/maxCurr) * 100
  }
  
  return (
	<div>
    {isSpecial ? (
		<div className={styles.progressBarAndInfo}>
			<div className={styles.referralInfo}>
				<div className={styles.referralInfoTextSecond}>
					{currentLangData.youAreSpeial1} <span>{currentLangData.youAreSpeial2} </span> {currentLangData.youAreSpeial3} {currentLangData.fixedCommission1} <span>{currentLangData.fixedCommission2}</span> {currentLangData.fixedCommission3} <span>{currency.commission}%</span>
				</div>
			</div>
		</div>
	) : (
		<div className={styles.progressBarAndInfo}>
			<div className={styles.progressBarBlock}>
			  {currency.isFirstMonth ? (
				currentLangData.freeProgress
			  ) : (
				`${currency.commission}%`
			  )}
			  <div className={styles.progressBar}>
				<div className={styles.progress} style={{width: progress + '%'}}></div>
			  </div>
			  {currency.isFirstMonth ? (
				`10%`
			  ) : (
				`${levelCurr}%`
			  )}
			</div>
			<div className={styles.referralInfo}>
				{currency.isFirstMonth ? (
					<div className={`${styles.referralInfoText} ${styles.colored}`}>{currentLangData.referralPreInfo}</div>
				) : (
					<div className={styles.referralInfoTextSecond}>
						{currentLangData.playedAndPlayPart1} <span>{currency.playedInMonths} {currentLangData.playedAndPlayPart2}</span>, {currentLangData.playedAndPlayPart3} <span>{currency.moreGames} {currentLangData.playedAndPlayPart4}</span> {currentLangData.playedAndPlayPart5}
					</div>
				)}
				<div className={styles.referralInfoIcon} onClick={openReferralInfo}><img src="/img/referalInfoIcon.png" /></div>
			</div>
		</div>

	)}
	</div>
  )
}

export default observer(LevelProgress)
