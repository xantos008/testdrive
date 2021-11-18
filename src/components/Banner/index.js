import React, {useContext} from 'react'
import styles from './styles.module.css'
import LangContext from '../Lang/context/LangContext'
import { useStores } from '../../utils/hooks'
import {
  NewIconButton
} from '../../ui/index'

const UpdateTimer = () => {
  const { currentLangData } = useContext(LangContext)
  let future  = Date.parse("February 14, 2021 00:00:00");
  let now = new Date();
  let diff    = future - now;

  let days  = Math.floor( diff / (1000*60*60*24) );
  let hours = Math.floor( diff / (1000*60*60) );
  let mins  = Math.floor( diff / (1000*60) );
  let secs  = Math.floor( diff / 1000 );

  let d = days;
  let h = hours - days  * 24;
  let m = mins  - hours * 60;
  let s = secs  - mins  * 60;
  
  setTimeout(() => {
	  now     = new Date();
	  diff    = future - now;
	  
	  days  = Math.floor( diff / (1000*60*60*24) );
	  hours = Math.floor( diff / (1000*60*60) );
	  mins  = Math.floor( diff / (1000*60) );
	  secs  = Math.floor( diff / 1000 );

	  d = days;
	  h = hours - days  * 24;
	  m = mins  - hours * 60;
	  s = secs  - mins  * 60;
  }, 1000);
  
  return (
	<div className={styles.timerBannerF}>
		<div>{d} <span>{currentLangData.bannerDays}</span></div>
		<div>{h} <span>{currentLangData.bannerHours}</span></div>
		<div>{m} <span>{currentLangData.bannerMinutes}</span></div>
	</div>
  )
}

const Line = () => {
  let start = new Date(2016,1,1)
  let end = new Date(2021,1,14)
  let today = new Date()
  
  let percentLine = Math.round(100-((end - start) * 100 ) / today) + '%';
  
  setTimeout(() => {
	  start = new Date(2005,0,1),
	  end = new Date(2021,0,1),
	  today = new Date();
	  
	  percentLine = Math.round(100-((end - start) * 100 ) / today) + '%';
  }, 1000);
  
  return (
	<div className={styles.lineBack}>
		<div className={styles.lineGreen} style={{
			width:percentLine
		}}></div>
	</div>
  )
}

const Avatars = () => {
  const { tournaments } = useStores()
  
  return (
	<div className={styles.avatarsParticipators}>
        {tournaments.participators.ava1 && (
			<div className={styles.avatarPartipa}>
				<img src={tournaments.participators.ava1} />
			</div>
		)}
		{tournaments.participators.ava2 && (
			<div className={styles.avatarPartipa}>
				<img src={tournaments.participators.ava1} />
			</div>
		)}
		{tournaments.participators.ava3 && (
			<div className={styles.avatarPartipa}>
				<img src={tournaments.participators.ava1} />
			</div>
		)}
		{tournaments.participators.count > 0 && (
		<div className={styles.avatarCount}>
			<div className={styles.avatarNumber}>
				{tournaments.participators.count}
			</div>
		</div>
		)}
	</div>
  )
}

function Banner() {
  const { currentLangData } = useContext(LangContext)
  const { modal, tournaments } = useStores()

  const openModal = () => {
    modal.open('tournamentParticipateModal')
  }
  
  return (
    <div className={styles.homeBanner}>
		<div className={styles.homeBannerPic}>
			<img src="/img/banner-back-pic.png" />
		</div>
			
			<div className={styles.homeBannerPicBackgroundMore}>
				<div className={styles.homeBannerTopBlock}>
					<div className={styles.homeBannerLeftSide}>
						<div className={styles.eventLikeBlock}>
							<div className={styles.userAvater}>
								<img src="/img/farmAvatar-banner.svg" />
							</div>
							<div className={styles.textEventAndDota}>
								<div className={styles.textEvent}>
									LOVE.FARM.PROTOS
								</div>
								<div className={styles.dotaEvent}>
									<div className={styles.dotaEventPic}>
										<img src="/img/banner-dota.png" />
									</div>
									<div className={styles.dotaEventName}>
										Dota 2
									</div>
								</div>
							</div>
						</div>
						<div className={styles.container}>
							<div className={styles.infoBlocks}>
								<div className={styles.infoBlocksLeft}>
									<div className={styles.infoBlock}>
										<div className={styles.infoTitle}>
											{currentLangData.bannerPlaceTitle}
										</div>
										<div className={styles.infoText}>
											{currentLangData.bannerPlaceText}
										</div>
									</div>
									<div className={styles.infoBlock}>
										<div className={styles.infoTitle}>
											{currentLangData.bannerCondsTitle}
										</div>
										<div className={styles.infoText}>
											{currentLangData.bannerCondsText}
										</div>
									</div>
								</div>
								<div className={styles.infoBlocksRight}>
									<div className={styles.infoBlock}>
										<div className={styles.infoTitle}>
											{currentLangData.bannerFormatTitle}
										</div>
										<div className={styles.infoText}>
											{currentLangData.bannerFormatText}
										</div>
									</div>
									<div className={styles.infoBlock}>
										<div className={styles.infoTitle}>
											{currentLangData.bannerPrizeTitle}
										</div>
										<div className={styles.infoText}>
											{currentLangData.bannerPrizeText}
										</div>
									</div>
								</div>
							</div>
						</div>
						
					</div>
					<div className={styles.homeBannerRightSide}>
						<img src="/img/banner-hart.png" />
						<div className={styles.bannerHeartText}>
							{currentLangData.bannerHeartText}
						</div>
					</div>
				</div>
				
				<div className={styles.buttonsAndClock}>
					<div className={styles.buttons}>
						<div className={styles.button}>
							{currentLangData.bannerButtonProgramm}
						</div>
						<div className={styles.button}>
							{currentLangData.bannerButtonReglament}
						</div>
					</div>
				</div>
				
				<div className={styles.beforeClock}>
					<div className={styles.beforeText}>
						{currentLangData.bannerBefore}
					</div>
					<div className={styles.clockBlock}>
						<UpdateTimer />
					</div>
				</div>
				
				<div className={styles.homeBannerBottomBlock}>
					<Line />
				</div>
			</div>
			<div className={styles.homeBannerBottomBlockSecond}>
					<div className={styles.slotsButttonAndInfo}>
						<div className={styles.slots}>
							<Avatars />
						</div>
						<div className={styles.buttonParticipate}>
							<div className={styles.textButton} onClick={openModal}>
								<div className={styles.btntext}>
									{currentLangData.participateTournament}
								</div>
								<div className={styles.btnimg}>
									<img src="/img/playTournament.svg" />
								</div>
							</div>
						</div>
						<div className={styles.slotsInfo}>
							{tournaments.participators.count}/128 {currentLangData.bannerFilled}
						</div>
					</div>
				</div>
			
    </div>
  )
}

export default Banner
