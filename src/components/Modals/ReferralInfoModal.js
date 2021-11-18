import React, {useContext, Fragment} from 'react'
import { Modal, Head, Body } from './Modal'
import { ExtensionButton } from '../../ui/index'
import styles from './greyModal.module.css'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext'

function ReferralInfoModal() {
  const { modal, user, currency } = useStores()
  const { currentLangData } = useContext(LangContext)
  const isMobile = window.innerWidth < 768
    user.getReferralsLevels()
  const closeModal = () => {
    modal.close('referralInfoModal')
  }
  
  let progress, min, max, currLevel, countLevels = 0, moreUsers
	
	
	min = user.steam.referralsArray ? user.steam.referralsArray.length : 0
	currLevel = user.steam.referralsLevel
	
	
	user.referralListing.map(levels => {
		countLevels++
		if(levels.level == currLevel){
			max = user.referralListing[countLevels] ? user.referralListing[countLevels].users : min
		}
	})
	
	if(min !== max){
		moreUsers = max - min
	}

  if(min == 0){
	  progress = 0
  } else if(min == max){
	  progress = 100
  } else {
	  progress = (min/max) * 100
  }
  
  return (
    <Modal visible={modal.visible.referralInfoModal} onBackgroundPress={closeModal} isMobile={isMobile}>
		<div className={`${styles.wombat} ${styles.pandasBotForBody}`}>
		  <div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  <div className={styles.body}>
			<div className={styles.monthInfoTitle}>
				{currentLangData.referralSystemGrades}
			</div>
			<div className={styles.monthInfoSubTitle}>
				{currentLangData.inviteMoretoIncreaseYourFee}
			</div>

				<div className={styles.monthInfoCurrentInfo}>
					{user.userSpecial ? (
					<div className={styles.referralInfoTextSecond}>
						{currentLangData.youAreSpeial1} <span>{currentLangData.youAreSpeial2} </span> {currentLangData.youAreSpeial3} {currentLangData.fixedCommission1} <span>{currentLangData.fixedCommission2}</span> {currentLangData.fixedCommission3} <span>{currency.commission}%</span>
					</div>
					) : (
					<table>
						<tbody>
							<tr className={styles.monthInfoTableBrush}>
								<td className={styles.columnOne}>
									{currentLangData.currentFee}
								</td>
								<td className={`${styles.columnTwo} ${styles.movePercent}`}>
									{user.steam.referalPercent}%
								</td>
							</tr>
							<tr className={styles.monthInfoTableBrush}>
								<td className={styles.columnOne}>
									{currentLangData.referralsToNextLevel}
								</td>
								<td className={styles.columnTwo}>
									{moreUsers}
								</td>
							</tr>
						</tbody>
					</table>
					)}
					{!user.userSpecial && (
					<div className={styles.progressLine}>
						<div className={styles.progressBar}>
							<div className={styles.progress} style={{width: progress + '%'}}></div>
						</div>
					</div>
					)}
				</div>
			<div className={`${styles.tableOfWonders} ${styles.referralsTable}`}>
				<div className={styles.tablesHead}>
					<div className={styles.celFirst}>
						{currentLangData.level}
					</div>
					<div className={styles.celSecond}>
						{currentLangData.referrals}
					</div>
					<div className={styles.celThird}>
						{currentLangData.playedGames}
					</div>
					<div className={styles.celFourth}>
						{currentLangData.fee}
					</div>
				</div>
				<div className={styles.tablesLines}>
					<Fragment>
						{user.referralListing.map((level, index) => (
							<div className={level.level == currLevel ? `${styles.tableRow} ${styles.currentLevelio}` : `${styles.tableRow}`}>
								<div className={styles.celFirst}>
									{localStorage.getItem('currLang') == 'en' && (
										<div>
											<p className={styles.referralLevelTitle}>{level.levelNameEn}</p>
											<p className={styles.referralLevelSubTitle}>{level.levelDescriptionEn}</p>
										</div>
									)}
									{localStorage.getItem('currLang') == 'ru' && (
										<div>
											<p className={styles.referralLevelTitle}>{level.levelNameRu}</p>
											<p className={styles.referralLevelSubTitle}>{level.levelDescriptionRu}</p>
										</div>
									)}
								</div>
								<div className={styles.celSecond}>
									{level.users}
								</div>
								<div className={styles.celThird}>
									{level.games}
								</div>
								<div className={styles.celFourth}>
									{level.percent}%
								</div>
							</div>
						))}
					</Fragment>
				</div>
			</div>
		  </div>
		</div>
    </Modal>
  )
}

export default ReferralInfoModal
