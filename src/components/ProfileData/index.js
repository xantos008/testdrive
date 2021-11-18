import React, {useContext} from 'react'
import styles from './profileData.module.css'
import { Avatar, Loader, LevelProgress, SimpleSmallButton } from '../../ui/index'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'
import ReferralInfo from '../../components/ReferralInfo'

function ProfileData({ children, inProfile = false }) {
  const { user, currency, events } = useStores()
  const { currentLangData } = useContext(LangContext)

  return (
    <div className={styles.profile}>
      <Avatar size={120} url={user.steam.avatarUrl} biga={true} />
      <div className={`${styles.info} ${styles.noMarginLeftOnMobile} ${inProfile ? styles.itsInProfileMan : ''}`}>
        <div className={styles.titleSub}>{user.name}</div>
        <div className={styles.title}>
          <div className={styles.name}>
            {user.isSteamLinked ? user.steam.username : 'username'}
          </div>
          <a
            href={user.isSteamLinked ? user.steam.profileUrl : '#'}
            target="_blank"
            rel="nofollow">
            <img className={styles.img} src="/img/soc/steam.png" />
          </a>
        </div>
		<LevelProgress min={4} max={89} level={1} />
        {children}
		<div className={styles.totals}>
			<div className={styles.totalsTab}>
				<SimpleSmallButton img="/img/buttonIcons/fireicon.png" />
				<div className={styles.totalsInfoText}>
					<div className={styles.totalsNumbers}>
						{user.stats.allGames}
					</div>
					<div className={styles.totalsText}>
						{currentLangData.totalEventsProfile}
					</div>
				</div>
			</div>
			<div className={styles.totalsTab}>
				<SimpleSmallButton img="/img/buttonIcons/winGames.png" />
				<div className={styles.totalsInfoText}>
					<div className={styles.totalsNumbers}>
						{user.stats.wonMatches}
					</div>
					<div className={styles.totalsText}>
						{currentLangData.wonEventsProfile}
					</div>
				</div>
			</div>
			<div className={styles.totalsTab}>
				<SimpleSmallButton img="/img/buttonIcons/sponsoredGames.png" />
				<div className={styles.totalsInfoText}>
					<div className={styles.totalsNumbers}>
						{user.stats.allSponsored}
					</div>
					<div className={styles.totalsText}>
						{currentLangData.sponsorEventsProfile}
					</div>
				</div>
			</div>
		</div>
		
		
		<div className={styles.balanceAndReferrals}>
			<div className={styles.balanceWhole}>
				<div className={styles.balanceAndReferralsTitles}>{currentLangData.yourBalance}</div>
				<div className={styles.balanceInfoProfile}>
					<div className={styles.balanceBlockProfile}>
						<div className={styles.totalBalans}>
							<div className={styles.headTextOfBalanceBlock}>
								{currentLangData.totalBalance}
							</div>
							<div className={styles.theBalance}>
								<div className={styles.forDollars}>
									<span>{currency.getUSD(currency.valueEOS)}</span> USD
								</div>
								<div className={styles.forCrypto}>
									<span>{currency.withUSD(currency.valueEOS)}</span> TLOS
								</div>
							</div>
						</div>
						<div className={styles.totalBalans}>
							<div className={styles.headTextOfBalanceBlock}>
								{currentLangData.earnedMoney}
							</div>
							<div className={styles.theBalance}>
								<div className={styles.forDollars}>
									<span>{currency.getUSD(user.stats.wonMoney)}</span> USD
								</div>
								<div className={styles.forCrypto}>
									<span>{currency.withUSD(user.stats.wonMoney)}</span> TLOS
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.balanceWhole}>
				<div className={styles.balanceAndReferralsTitles}>{currentLangData.referralSystem}</div>
				<ReferralInfo />
			</div>
		</div>
      </div>
	  
    </div>
  )
}

export default observer(ProfileData)
