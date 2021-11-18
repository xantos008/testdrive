import React, {useContext} from 'react'
import styles from './styles.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import { copyToClipboard } from '../../utils/lib'
import LangContext from '../../components/Lang/context/LangContext'
import { SimpleButton } from '../../ui/index'

function ReferralInfo() {
  const { user, currency, modal } = useStores()
  const linkUrl = `${location.origin}/ref/${user.name}`
  const { currentLangData } = useContext(LangContext)
  
  const copy = () => {
    copyToClipboard(linkUrl)
  }
  const openMonthsLevelInfoModal = () => {
	  modal.open('referralInfoModal')
  }
  
  const isMobile = window.innerWidth < 768
  
  let isSpecial = false
  if(user.userSpecial){
	  if(user.userSpecial.refferalComission >= 0){
		  isSpecial = true
	  }
  }

  let userRefSalary = parseFloat(user.referallSalary.toFixed(4))

  return (
	<div className={styles.referralSystemAll}>
		<div className={styles.threeBlocks}>
			<div className={styles.referralStatics}>
				<div className={styles.referralStaticsContent}>
					<div className={styles.numberStatics}>
						{user.steam.referrals}
					</div>
					<div className={styles.textUnderNumber}>
						{currentLangData.invited}
					</div>
				</div>
			</div>
			<div className={styles.referralStatics}>
				<div className={styles.referralStaticsContent}>
					<div className={styles.numberStatics}>
						{userRefSalary} <span>{currency.curr}</span>
					</div>
					<div className={styles.textUnderNumber}>
						{currentLangData.earned}
					</div>
				</div>
			</div>
			<div className={styles.referralStatics}>
				<div className={styles.referralStaticsContent}>
					{!isSpecial && (
						<div className={styles.iconForModal} onClick={openMonthsLevelInfoModal}><img src="/img/referalInfoIcon.png" /></div>
					)}
					<div className={styles.numberStatics}>
						{user.steam.referalPercent ? user.steam.referalPercent : currency.commission} <span>%</span>
					</div>
					<div className={styles.textUnderNumber}>
						{currentLangData.yourFee}
					</div>
				</div>
			</div>
		</div>
		{isMobile ? (
			<div className={styles.copyLinkblock}>
				<div className={styles.preLinkText}>{currentLangData.referralLink}</div>
				<div className={styles.linkContainer}>
					<div className={styles.link}>{linkUrl}</div>
				</div>
				<div className={styles.button} onClick={copy}>
					<SimpleButton title={currentLangData.copyLinkTitle} />
				</div>
				<div className={styles.instroText}>
					{currentLangData.copyYoutRefLink}
				</div>
			</div>
		) : (
			<div className={styles.copyLinkblock}>
				<div className={styles.linkContainer}>
					<div className={styles.preLinkText}>{currentLangData.referralLink}</div>
					<div className={styles.link}>{linkUrl}</div>
					<div className={styles.button} onClick={copy}>
					  <SimpleButton title={currentLangData.copyLinkTitle} />
					</div>
				</div>
				<div className={styles.instroText}>
					{currentLangData.copyYoutRefLink}
				</div>
			</div>
		)}
		
    </div>
  )
}

export default observer(ReferralInfo)
