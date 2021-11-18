import React, { useEffect, useState, useContext, Fragment } from 'react'
import styles from './event.module.css'
import { Loader, Button, LoadingButton, SimpleButton, NewIconButton, NewIconGreyButton } from '../../ui/index'
import { useStores, useUpdate } from '../../utils/hooks'
import User from '../../store/user'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import ProfileEvent from '../../components/ProfileData/ProfileEvent'
import { hashCode, checkAccess, checkWinStatus5vs5, copyToClipboard } from '../../utils/lib'
import { LeaveEventModal } from '../../components/Modals'
import LangContext from '../../components/Lang/context/LangContext'
import { addBannedEvent, anyState, apiLobbyDestroy, preCheckEvents, tempoReady } from '../../services/utils'
import history from '../../history'

const Team = ({ team, side, eventInfo, showReadyWaiting = null }) => {
  const count = [...Array(5)].fill(0)
  const { user, events, modal } = useStores()
  const inTeam = team.findIndex(item => item.name === user.name) !== -1
  
  return (
    <div className={styles.team}>
      <span className={styles.teamTitle}>{side.toUpperCase()}</span>
      <div className={styles.teamRow}>
        {count.map((item, index) => (
          <TeamItem
            key={index}
            inTeam={inTeam}
            side={side}
            item={team[index]}
            eventInfo={eventInfo}
			showReadyWaiting={showReadyWaiting}
          />
        ))}
      </div>
    </div>
  )
}

const TeamItem = ({ item, eventInfo, inTeam, side, showReadyWaiting = null }) => {
  const { currentLangData } = useContext(LangContext)
  const [info, setInfo] = useState({
    avatarUrl: '',
    profileUrl: '',
    steamId: ''
  })

  const { user, events, modal } = useStores()
  const isGuest = user.isGuest
  
  let canChangeSide = false
  
  eventInfo.all.direTeam.map(member => {
	if(member.name === user.name){
		canChangeSide = true
	}
  })
  eventInfo.all.radiantTeam.map(member => {
	if(member.name === user.name){
		canChangeSide = true
	}
  })
  
  let isReady = false
  
  
  const changeSide = () => {
	if(!isGuest){
		if (!inTeam) {
		  if(user.canParticipate) {
			  let pickedSide = side[0].toUpperCase() + side.slice(1);
			  console.log(pickedSide)
			  eventInfo.all.pickedSide = pickedSide
			  if(user && user.steam && user.steam.steamId){
				modal.open('participate5vs5', eventInfo.all)
			  } else {
				  modal.open('steam')
			  }
		  } else {
			  if(canChangeSide){
				  events.changeSide(eventInfo.key, side).catch(err => {
					if (typeof err === 'string') {
					  const detais = JSON.parse(err).error.details[0].message
					  modal.openError(detais)
					}
				  })
			  } else {
				  modal.open('cantParticipateModal')
			  }
		  }
		}
    } else {
		modal.open('loginPageModal')
	}
  }
  useEffect(() => {
    if (item && info.steamId !== item.steamId) {
      const getUserInfo = async () => {
        const userInfo = await user.getUserInfo(item.name, user.wallet)
        setInfo(userInfo)
      }
      getUserInfo()
    }
  }, [item])
  if (!item) {
    return (
      <div className={`${styles.teamItemContainer} ${inTeam ? styles.noHover : styles.cursor}`} onClick={changeSide}>
		<div className={styles.avatarAndInfoAboutUser}>
		  <div className={styles.forAvatarBorder}>
			<div className={styles.teamItemImage}>
				<div className={styles.joinBu}>
					<span>{currentLangData.join}</span>
					<img src="/img/waitingcircle.png" />
				</div>
			</div>
		  </div>
		</div>
      </div>
    )
  }
  const kick = () => {
    events.kick(eventInfo.key, item.name)
  }
  
  const goToProfile = () => {
	const newTabBrowser = window.open(info.profileUrl, '_blank');
	newTabBrowser.focus();
  }
  
  const kickAndLock = () => {
	events.kick(eventInfo.key, item.name, true)
  }
  

  const isWinner = eventInfo.all.side_winner.length > 0 && eventInfo.all.side_winner === item.side
  const isOwner = eventInfo.all.name_owner === item.name
  const isLooser = eventInfo.all.side_winner.length > 0 && eventInfo.all.side_winner !== item.side
  
  isReady = false
  if(eventInfo.all.player1 && eventInfo.all.player1 !== "" && eventInfo.all.player1 !== " "  && eventInfo.all.player1_ready !== "" && eventInfo.all.player1.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player2 && eventInfo.all.player2 !== "" && eventInfo.all.player2 !== " "  && eventInfo.all.player2_ready !== "" && eventInfo.all.player2.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player3 && eventInfo.all.player3 !== "" && eventInfo.all.player3 !== " "  && eventInfo.all.player3_ready !== "" && eventInfo.all.player3.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player4 && eventInfo.all.player4 !== "" && eventInfo.all.player4 !== " "  && eventInfo.all.player4_ready !== "" && eventInfo.all.player4.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player5 && eventInfo.all.player5 !== "" && eventInfo.all.player5 !== " "  && eventInfo.all.player5_ready !== "" && eventInfo.all.player5.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player6 && eventInfo.all.player6 !== "" && eventInfo.all.player6 !== " "  && eventInfo.all.player6_ready !== "" && eventInfo.all.player6.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player7 && eventInfo.all.player7 !== "" && eventInfo.all.player7 !== " "  && eventInfo.all.player7_ready !== "" && eventInfo.all.player7.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player8 && eventInfo.all.player8 !== "" && eventInfo.all.player8 !== " "  && eventInfo.all.player8_ready !== "" && eventInfo.all.player8.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player9 && eventInfo.all.player9 !== "" && eventInfo.all.player9 !== " "  && eventInfo.all.player9_ready !== "" && eventInfo.all.player9.split(',')[0] == item.name){
	  isReady = true
  }
  if(eventInfo.all.player10 && eventInfo.all.player10 !== "" && eventInfo.all.player10 !== " "  && eventInfo.all.player10_ready !== "" && eventInfo.all.player10.split(',')[0] == item.name){
	  isReady = true
  }
  
  return (
    <div className={`${styles.teamItemContainer} ${isReady ? styles.fiveReady : styles.fiveWaiting}`}>
	  <div className={styles.avatarAndInfoAboutUser}>
		  <div className={styles.forAvatarBorder}>
			  <div className={styles.teamItem} target="_blank">
				{(info.profileUrl && user.name !== eventInfo.name_owner) ? (
					<a href={info.profileUrl} target="_blank">
						<img
						  className={styles.teamItemAvatar}
						  src={info.avatarUrl}
						  alt="avatar"
						/>
					</a>
				) : (
					<img
					  className={styles.teamItemAvatar}
					  src={info.avatarUrl}
					  alt="avatar"
					/>

				)}
			  </div>
			  {showReadyWaiting && (
				<img src="/img/ready.svg" className={styles.readyPicture} />
			  )}
			  {showReadyWaiting && (
				<img src="/img/waiting.svg" className={styles.waitingPicture} />
			  )}
		  </div>
		  <div className={styles.weNeedAbsolute}>
			  <div className={styles.memberName}>
				  {item.name}
			  </div>
			  <div className={styles.mamberLabels}>
				  {isOwner && (
					<div className={`${styles.ownerLable} ${styles.paddingCheck}`}>
						{currentLangData.ownerOfEvent}
					</div>
				  )}
				  {isWinner && (
					<div className={`${styles.labelWinner} ${styles.paddingCheck}`}>
						{currentLangData.anEventwinner}
					</div>
				  )}
				  {isLooser && (
					<div className={styles.labelLooser}>
						{currentLangData.anEventlooser}
					</div>
				  )}			  
			  </div>
		  </div>
	  </div>
      {eventInfo.status === 0 &&
        user.name === eventInfo.name_owner &&
        item.name !== eventInfo.name_owner && (
          <div className={`${styles.miniModal} ${styles.miniModalHidden}`}>
			  <div className={styles.miniModalbefore}></div>
			  <div className={styles.toHideArroedBorders}>
				  <div className={styles.miniModalActionButton}  onClick={goToProfile}>
					<div className={styles.miniModalActionButtonIcon}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M7.99123 16C12.4144 16 16 12.4183 16 8C16 3.58172 12.4144 0 7.99123 0C3.74766 0 0.274944 3.29684 0 7.46626C0.0107679 7.47037 0.0215126 7.47463 0.0322313 7.47905L4.33216 9.25242C4.67369 9.0357 5.07891 8.91017 5.51348 8.91017C5.54241 8.91017 5.57121 8.91073 5.59987 8.91183L7.5602 6.09505C7.55983 6.07539 7.55964 6.05568 7.55964 6.03592C7.55964 4.36033 8.91946 3.00199 10.5969 3.00199C12.2743 3.00199 13.6342 4.36033 13.6342 6.03592C13.6342 7.71152 12.2743 9.06985 10.5969 9.06985C10.5601 9.06985 10.5235 9.0692 10.487 9.06791L7.71796 11.0309C7.71898 11.0584 7.71949 11.086 7.71949 11.1138C7.71949 12.3308 6.73183 13.3174 5.51348 13.3174C4.45519 13.3174 3.57094 12.573 3.35689 11.5797L0.327563 10.3304C1.32634 13.612 4.3796 16 7.99123 16ZM3.93764 11.8192C4.20757 12.4199 4.81161 12.8383 5.51348 12.8383C6.46698 12.8383 7.23993 12.0662 7.23993 11.1138C7.23993 10.1613 6.46698 9.38921 5.51348 9.38921C5.30445 9.38921 5.1041 9.42632 4.91866 9.4943L5.93398 9.91304C6.57865 10.1789 6.88549 10.9165 6.61932 11.5605C6.35315 12.2044 5.61477 12.5109 4.9701 12.2451L3.93764 11.8192ZM10.5969 8.07983C11.727 8.07983 12.643 7.16474 12.643 6.03592C12.643 4.9071 11.727 3.99201 10.5969 3.99201C9.46684 3.99201 8.55074 4.9071 8.55074 6.03592C8.55074 7.16474 9.46684 8.07983 10.5969 8.07983ZM12.1315 6.03592C12.1315 6.88254 11.4444 7.56886 10.5969 7.56886C9.74935 7.56886 9.06228 6.88254 9.06228 6.03592C9.06228 5.1893 9.74935 4.50299 10.5969 4.50299C11.4444 4.50299 12.1315 5.1893 12.1315 6.03592Z" fill="#7CA59E"/>
						</svg>
					</div>
					<div className={styles.miniModalActionButtonText}>
						{currentLangData.goToSteamProfileFromEvent}
					</div>
				  </div>
				  <div className={styles.miniModalActionButton} onClick={kick}>
					<div className={styles.miniModalActionButtonIcon}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M15.9495 7.07891C15.9155 6.99756 15.8669 6.92356 15.8048 6.86156L13.8054 4.8621C13.5447 4.60209 13.1234 4.60209 12.8627 4.8621C12.602 5.12278 12.602 5.5448 12.8627 5.80481L13.7247 6.66686H10.0005C9.63183 6.66686 9.33381 6.96553 9.33381 7.33355C9.33381 7.70157 9.63183 8.00024 10.0005 8.00024H13.7247L12.8627 8.86229C12.602 9.12296 12.602 9.54498 12.8627 9.805C12.9927 9.93566 13.1633 10.0003 13.334 10.0003C13.5047 10.0003 13.6754 9.93569 13.8054 9.805L15.8048 7.80554C15.8669 7.7442 15.9155 7.67019 15.9495 7.58819C16.0168 7.42559 16.0168 7.24158 15.9495 7.07891Z" fill="#7CA59E"/>
							<path d="M11.3339 9.33385C10.9652 9.33385 10.6672 9.63252 10.6672 10.0005V13.3341H8.00043V2.6668C8.00043 2.37278 7.80708 2.11277 7.52506 2.02811L5.20959 1.33342H10.6672V4.66694C10.6672 5.03496 10.9652 5.33363 11.3339 5.33363C11.7026 5.33363 12.0006 5.03496 12.0006 4.66694V0.666723C12.0006 0.298672 11.7026 0 11.3339 0H0.666692C0.642691 0 0.621346 0.0100005 0.598032 0.0126569C0.566687 0.0160009 0.538029 0.0213136 0.508027 0.0286578C0.438024 0.0466588 0.374676 0.074004 0.315361 0.111318C0.300704 0.120663 0.282703 0.121319 0.268702 0.131976C0.263327 0.136007 0.261327 0.143351 0.255983 0.147352C0.183322 0.204667 0.122663 0.274671 0.0786605 0.358019C0.0693162 0.37602 0.0673161 0.395365 0.0600032 0.414022C0.0386583 0.464681 0.0153446 0.514028 0.00734414 0.570031C0.00400021 0.590032 0.0100005 0.608689 0.00934425 0.628034C0.00868797 0.641378 0 0.653379 0 0.666692V14.0008C0 14.3188 0.224668 14.5921 0.536029 14.6541L7.20304 15.9875C7.24639 15.9969 7.29039 16.0009 7.33371 16.0009C7.48637 16.0009 7.63638 15.9482 7.75639 15.8495C7.91039 15.7229 8.0004 15.5342 8.0004 15.3342V14.6675H11.3339C11.7026 14.6675 12.0006 14.3688 12.0006 14.0008V10.0005C12.0006 9.63252 11.7026 9.33385 11.3339 9.33385Z" fill="#7CA59E"/>
						</svg>
					</div>
					<div className={styles.miniModalActionButtonText}>
						{currentLangData.kickMemberFromEvent}
					</div>
				  </div>
				  <div className={styles.miniModalActionButton} onClick={kickAndLock}>
					<div className={styles.miniModalActionButtonIcon}>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 0C3.58402 0 0 3.58402 0 8C0 12.416 3.58402 16 8 16C12.416 16 16 12.416 16 8C16 3.58402 12.416 0 8 0ZM2.26132 8C2.26132 4.82133 4.84265 2.24 8 2.24C9.19467 2.24 10.3254 2.60268 11.2427 3.24266L3.26401 11.2427C2.624 10.3254 2.26132 9.19467 2.26132 8ZM8 13.7387C6.80533 13.7387 5.67465 13.376 4.75734 12.736L12.736 4.75734C13.376 5.67468 13.7387 6.80533 13.7387 8C13.7387 11.1787 11.1787 13.7387 8 13.7387Z" fill="#7CA59E"/>
						</svg>
					</div>
					<div className={styles.miniModalActionButtonText}>
						{currentLangData.kickAndBanMemberFromEvent}
					</div>
				  </div>
			  </div>

		  </div>
        )}
    </div>
  )
}

const LobbyTimer = ({ expires, event }) => {
  const [lost, setLost] = useState(() => {
    return event.status < 4 ? expires + 5 * 60 - User.time : expires - User.time
  })

  useEffect(() => {
    let interval
    if (lost > 0) {
      interval = setInterval(() => {
        setLost(lost => lost - 1)
      }, 1000)
    } else {
      
    }
    return () => clearInterval(interval)
  }, [])

  const lostMin = Math.floor(lost / 60)
  const lostSec = lost - lostMin * 60

  return expires > 0
    ? `${('0' + lostMin).slice(-2)}:${('0' + lostSec).slice(-2)}`
    : ''
}

const TimeToConnect = ({ expires, event }) => {
  const { currentLangData } = useContext(LangContext)
  const [lost, setLost] = useState(() => {
    return expires + 10 * 60 - User.time
  })
  
  useEffect(() => {
    let interval
    if (lost > 0) {
      interval = setInterval(() => {
        setLost(lost => lost - 1)
      }, 1000)
    } else {
      // 
    }
    return () => clearInterval(interval)
  }, [])

  const lostMin = Math.floor(lost / 60)
  const lostSec = lost - lostMin * 60

  let progress = 0
  if(!lost > 0){
	  progress = 100
  }
  
  let max = parseInt( ((expires + 10 * 60) / 1000).toString().split('.')[1])
  let min = max - lost
  
  progress = (min/max) * 100
  

  return lost > 0
    ? (
		<div className={styles.tickTockOnTheClock}>
			<div className={styles.clockTitle}>{currentLangData.timeToConnect}</div>
			<div className={styles.timeInNumbers}>
				{('0' + lostMin).slice(-2)}{currentLangData.shortMin} {('0' + lostSec).slice(-2)}{currentLangData.shortSec} 
			</div>
			<div className={styles.progressBarBlock}>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={{width: progress + '%'}}>
					</div>
				</div>
			</div>
		</div>
	)
    : ''
}

const TimeToConnectReady = ({ expires, event }) => {
  const { user, modal, events } = useStores()
  const { currentLangData } = useContext(LangContext)
  const is5vs5 = event !== undefined && event.mode === '5 vs 5'
  
  const playerReady = () => {
	let type = 0;
	let player = 0;
	let ready = true;
	
	(async () => {
		try {
			const apiTempoReady = await tempoReady('post', User.name, 'wombatAccount', event.key)
		} catch (e) {
			console.log(e)
		}
			
	})();
	
	if(is5vs5){
		type = 5
		if(event.player1.split(',')[0] === user.name){
			player = 1
		}
		if(event.player2.split(',')[0] === user.name){
			player = 2
		}
		if(event.player3.split(',')[0] === user.name){
			player = 3
		}
		if(event.player4.split(',')[0] === user.name){
			player = 4
		}
		if(event.player5.split(',')[0] === user.name){
			player = 5
		}
		if(event.player6.split(',')[0] === user.name){
			player = 6
		}
		if(event.player7.split(',')[0] === user.name){
			player = 7
		}
		if(event.player8.split(',')[0] === user.name){
			player = 8
		}
		if(event.player9.split(',')[0] === user.name){
			player = 9
		}
		if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0'){
			if(event.player10.split(',')[0] === user.name){
				player = 10
			}
		} else {
			if(event.name_owner == user.name){
				player = 10
			}
		}
	} else {
		type = 1
		if(event.player1.split(',')[0] === user.name){
			player = 1
		}
		if(event.player2.split(',')[0] === user.name){
			player = 2
		}
	}
	
	events.sendReadyState(parseInt(event.key), type, player, ready)
  }
  
  const [lost, setLost] = useState(() => {
    return expires + 5 * 60 - user.time
  })
  console.log(lost)
  
  useEffect(() => {
    let interval
    if (lost > 0) {
      interval = setInterval(() => {
        setLost(lost => lost - 1)
      }, 1000)
    } else {
      //
    }
    return () => clearInterval(interval)
  }, [])

  const lostMin = Math.floor(lost / 60)
  const lostSec = lost - lostMin * 60

  let progress = 0
  if(!lost > 0){
	  progress = 100
  }
  
  let max = parseInt( ((expires + 10 * 60) / 1000).toString().split('.')[1])
  let min = max - lost
  
  progress = (min/max) * 100
  
  return lost > 0
    ? (
		<div>
			<div className={styles.tickTockOnTheClock}>
				<div className={styles.clockTitle}>{currentLangData.timeToConnectReady}</div>
				<div className={styles.timeInNumbers}>
					{('0' + lostMin).slice(-2)}{currentLangData.shortMin} {('0' + lostSec).slice(-2)}{currentLangData.shortSec} 
				</div>
				<div className={styles.progressBarBlock}>
					<div className={styles.progressBar}>
						<div className={styles.progress} style={{width: progress + '%'}}>
						</div>
					</div>
				</div>
			</div>
			<div className={`${styles.dinoButtons} ${styles.mBottom0}`}>
				<NewIconButton
					title={currentLangData.imready}
					className={styles.readyButton}
					onClick={playerReady}
					img="/img/buttonIcons/startevent.png"
				/>
			</div>
		</div>
	)
    : ''
}


const FormattedDay = ({ time }) => {
  const { currentLangData } = useContext(LangContext)
  const date = new Date(time * 1000)
  const year = date.getFullYear()
  const month = (1 + date.getMonth()).toString()
  const day = '0' + date.getDate()
  let hours = '0' + date.getHours()
  let ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = '0' + date.getMinutes()
  const monthNames = [
	currentLangData.january,
	currentLangData.february,
	currentLangData.march,
	currentLangData.april,
	currentLangData.may,
	currentLangData.june,
	currentLangData.july,
	currentLangData.august,
	currentLangData.september,
	currentLangData.October,
	currentLangData.November,
	currentLangData.December
  ];
	
  return (
    <Fragment>
	<div className={styles.clocks}>
	  <div className={styles.forAmPm}>
		{hours}:{minutes.substr(-2)} {ampm}
	  </div>
	  <div className={styles.dateBlock}>
		<div className={styles.partDate}>{monthNames[date.getMonth()]}</div>
		<div className={styles.dateSeparator}></div>
		<div className={styles.partDate}>{day.substr(-2)}</div>
		<div className={styles.dateSeparator}></div>
		<div className={styles.partDate}>{year}</div>
	  </div>
	</div>
    </Fragment>
  )
}

async function scratchUser(name = null, wallet = null, event){
	const { user } = useStores()
	const { currentLangData } = useContext(LangContext)
	
	let neededText = currentLangData.userInSearchProgress
	if(event && event.player1 !== '' && event.player1 !== ' ' && event.player2 !== '' && event.player2 !== ' ' && event.realStatus == 1){
		neededText = currentLangData.userWaitForAcceptense
		if(event.lobby_sponsored && event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0'){
			neededText = currentLangData.userInSearchProgress
		}
	}
	if(name && name !== '' && name !== ' '){
		if(event.realStatus == 1 && event.player2 !== '' && event.player2 !== ' ' && event.player2.split(',')[0] == name){
			return {
				name: neededText
			}
		}
		const info = await user.getUserInfo(name, wallet)
		if(info && info.profileUrl){
			return {
				avatarUrl: info.avatarUrl,
				profileUrl: info.profileUrl,
				username: info.username,
				name: name
			}
		} else {
			return {
				name: neededText
			}
		}
	} else {
		return {
			name: neededText
		}
	}
}

let foundedUser1 = null
let foundedUser2 = null

function Event({ match }) {
  const { currentLangData } = useContext(LangContext)
  const { events, user, currency, modal } = useStores()
  const [users, setUsers] = useState(null)
  const [startGame5vs5Loading, setStartGame5vs5Loading] = useState(false)
  useUpdate()
  const key = match.params.key
  const event = events.getEventByKey(key)
  const is5vs5 = event !== undefined && event.mode === '5 vs 5'
  const isGuest = user.isGuest
  if(!event){
	//history.push('/')
	//return
	location.href = '/'
  }
  
  if(!is5vs5 && event){
  const changeFoundedUser1 = (value) => {
	  foundedUser1 = value
  }
  const changeFoundedUser2 = (value) => {
	  foundedUser2 = value
  }
  const getfoundedUsers = async () => {
        try {
          const responseAnswer = await Promise.all([
				scratchUser( (event && event.player1 && event.player1 !== ' ' && event.player1 !== '') ? event.player1.split(',')[0] : '', user.wallet, event),
				scratchUser( (event && event.player2 && event.player2 !== ' ' && event.player2 !== '') ? event.player2.split(',')[0] : '', user.wallet, event)
			  ])
			  changeFoundedUser1(responseAnswer[0])
			  changeFoundedUser2(responseAnswer[1])
        } catch (e) {
			console.log('ebat', e)
        }
  }
  getfoundedUsers()  
  }
  
  const copy = (linkToCopy) => {
	  copyToClipboard(linkToCopy)
  }

  user.checkParticipation()
	
  let showOnlyOwner = false
  
  if(event){
	  if(event.lobby_sponsored){
		  if(event.name_owner == 'farmlynxm1v1' || 
		  event.name_owner == 'farmlynxm5v5' || 
		  event.name_owner == 'farmgamem1v1' || 
		  event.name_owner == 'farmgamem5v5' || 
		  event.name_owner == 'contractfa11' ||
		  event.name_owner == 'contractfa12' ||
		  event.name_owner == 'farmstaonee1' ||
		  event.name_owner == 'farmstafive1'){
			  showOnlyOwner = 'Farm.game'
		  }
	  }
	  if(event.customBackground && event.customBackground.length > 2){
		  const docRoot = document.getElementById('root')
		  if(docRoot.classList.contains('eventBackground') && event.customBackground !== ""){
			  docRoot.style.backgroundImage = `url(${event.customBackground}),url(/img/footer-back.jpg)`
		  } 
	  }
  }
  
  useEffect(() => {
	  window.scrollTo(0,0)
	
    if (!users && event && !is5vs5) {
      const getUsers = async () => {
        try {
          console.log('event', event)
		  
		  if(event.lobby_sponsored){
			  const responseAnswer = await Promise.all([
				user.getUserInfo(event.player2.split(',')[0], User.wallet),
				user.getUserInfo(event.player1.split(',')[0], User.wallet),
				user.getUserInfo(event.name_owner, User.wallet),
			  ])
			  setUsers({
				accept: { ...responseAnswer[0], name: event.player2.split(',')[0] },
				owner: { ...responseAnswer[1], name: event.player1.split(',')[0] },
				sponsor: { ...responseAnswer[2], name: event.name_owner }
			  })
		  } else {
			  const response = await Promise.all([
				user.getUserInfo(event.name_accept),
				user.getUserInfo(event.name_owner)
			  ])
			  setUsers({
				accept: { ...response[0], name: event.name_accept },
				owner: { ...response[1], name: event.name_owner }
			  })
		  }
        } catch (e) {
		  if(event.lobby_sponsored){
			setUsers({
				accept: { name: event.player2.split(',')[0] },
				owner: { name: event.player1.split(',')[0] },
				sponsor: { name: event.name_owner }
			})
		  } else {
			setUsers({
				accept: { name: event.name_accept },
				owner: { name: event.name_owner }
			})
		  }
        }
      }
      getUsers()
    }
	
	if(is5vs5 && !users){
		setUsers({ owner: {username: event.name_owner} })
	}
  }, [])

  let endStatus,
    notFoundStatus,
	canParticipate1v1,
	canParticipate5v5,
	canLeave5v5,
	canBasicallyLeave,
    winStatus,
    isUserWinner,
    sumLoss,
    sumWon,
	rateTotal,
    prepareStatus,
    runStatus,
    rejectStatus,
    passwordAccess,
	imgSrcHomeSponsor,
	showReadyButton = false,
	eventIsReady = false,
	isContractEvent = false
  
	if(event){
		if(event.name_owner == 'farmlynxm1v1' || 
		event.name_owner == 'farmlynxm5v5' || 
		event.name_owner == 'farmgamem1v1' || 
		event.name_owner == 'farmgamem5v5' ||
		event.name_owner == 'farmstaonee1' ||
		event.name_owner == 'farmstafive1' ||
		event.name_owner == 'contractfa11' ||
		event.name_owner == 'contractfa12'){
			isContractEvent = true
		}
		
		if(is5vs5){
			if(event.direTeam.length == 5 && event.radiantTeam.length == 5 && event.realStatus !== 6){
				showReadyButton = true
			}
			if(event.player1_ready && event.player2_ready && event.player3_ready && event.player4_ready && event.player5_ready && event.player8_ready && event.player7_ready && event.player8_ready && event.player9_ready && event.player10_ready){
				eventIsReady = true
			}
		} else {
			if(event.player1 && event.player2 && event.realStatus !== 6  && event.realStatus > 2 && event.realStatus < 3.5){
				showReadyButton = true
			}
			if(event.player1_ready && event.player2_ready){
				eventIsReady = true
			}
	}
	
	}
	let multi = 2
	let minca = 1
	if(event){
		if(event.lobby_sponsored){
			multi = 1
		}
		
		if(event.lobby_sponsored){
			minca = 5
		}
	}
	
	canBasicallyLeave = false
	
  if (is5vs5) {
    notFoundStatus = !event
	canParticipate5v5 = event !== undefined && event !== null && event !== "" && event !== {} && event !== [] && event.name_owner === user.name && event.status < 3.5
		event.direTeam.map(member => {
			if(member.name === user.name){
				canLeave5v5 = true
				canBasicallyLeave = true
			}
		})
		event.radiantTeam.map(member => {
			if(member.name === user.name){
				canLeave5v5 = true
				canBasicallyLeave = true
			}
		})
  } else {
    notFoundStatus =
      !event || (event.status !== 2 && event.status !== 3 && event.status !== 4)
	canParticipate1v1 = notFoundStatus && event !== undefined && event !== null && event !== "" && event !== {} && event !== [] && event.status === 0
  }
  

  if (!notFoundStatus && is5vs5) {
    sumLoss = event.price_owner
	rateTotal = sumLoss
	
	if(User.symbol == 'LNX'){
		sumWon = (sumLoss / minca * multi * (100 - currency.commission)) / 100
	} else {
		sumWon = (sumLoss / minca * multi * (100 - currency.commission)) / 100
	}
	
    isUserWinner =
      event.status !== 3 ? true : checkWinStatus5vs5(event, user.name)
    endStatus = event.status === 3
    runStatus = event.status === 1
    rejectStatus = event.status === 4
    prepareStatus = event.status === 0
    passwordAccess = checkAccess(event, user.name)
    //
  } else if (!notFoundStatus && !is5vs5) {
    endStatus = event.status === 3
    runStatus = event.status === 2
    rejectStatus = event.status === 4
	if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false){
		winStatus = {
		  accept: event.steam_id_winner === event.player2.split(',')[1],
		  owner: event.steam_id_winner === event.player1.split(',')[1]
		}
    } else {
		winStatus = {
		  accept: event.steam_id_winner === event.steam_id_accept,
		  owner: event.steam_id_winner === event.steam_id_owner
		}
	}
	
    isUserWinner = user.steam.steamId === event.steam_id_winner
	if(User.symbol == 'LNX'){
		sumLoss = event.rate_total / 100000000
	} else {
		sumLoss = event.rate_total / 10000
	}
	rateTotal = sumLoss
	
	sumWon = (sumLoss * multi * (100 - currency.commission)) / 100
	if(event.lobby_sponsored){
		sumLoss = 0
	}
	
  }
  
  if(!is5vs5){
	  passwordAccess =
      event.name_owner === user.name || event.name_accept === user.name || event.player1.split(',')[0] === user.name || event.player2.split(',')[0] === user.name
  }
  
  const cancel = () => {
    if (is5vs5) {
      events.cancel5vs5(event.key, false)
    } else {
      events.cancel(event.key)
    }
  }

  const participate = (playerInfo) => {
	  let check1on1 = true
	  let emptySlot = true
	  
	  if(playerInfo && playerInfo.profileUrl){
		  emptySlot = false
	  } else {
		  emptySlot = true
	  }
	  
	  if(isGuest){
		  if(emptySlot){
			modal.open('loginPageModal')
		  }
	  } else {
		  user.checkParticipation()
			  if(user && user.steam && user.steam.steamId){
				  if(user.stats.testGames >= 3 && isContractEvent && user.stats.testGamesWonMatches > 0){
					  modal.open('testGamesEnd')
				  } else {
					  if(is5vs5){
						modal.open('participate5vs5', event)
					  } else {
						if(event.player1 !== "" && event.player1 !== " "){
							if(event.player1.split(',')[0] === user.name){
								check1on1 = false
							}
						}
						if(event.player2 !== "" && event.player2 !== " "){
							if(event.player2.split(',')[0] === user.name){
								check1on1 = false
							}
						}
						if(check1on1 && emptySlot){
							if(user.canParticipate){
								modal.open('accept', event)
							} else {
								modal.open('cantParticipateModal')
							}
						}
					  }
				  }
			  } else {
				   if(emptySlot){
					modal.open('steam')
				   }
			  }
	  }
  }
  
  
  const leave = () => {
	if(!isGuest){

		modal.open('lobbyLeaving')

		if(is5vs5){
			events.leave(event.key).then(() => {
			  modal.close('lobbyLeaving')
			}).catch((err) => {
				if(err && err.message){
					alert(err.message)
				}
				modal.close('lobbyLeaving')
			})
		} else {
			events.leave1v1(event.key).then(() => {
			  modal.close('lobbyLeaving')
			}).catch((err) => {
				if(err && err.message){
					alert(err.message)
				}
				modal.close('lobbyLeaving')
			})
		}
		
	} else {
		modal.open('loginPageModal')
	}
  }
  
  const onClickLeave = () => {
	if(is5vs5){
		events.leave(event.key).then(() => {
		  modal.close('leaveEvent')
		})
	} else {
		events.leave1v1(event.key).then(() => {
		  modal.close('leaveEvent')
		})
	}
  }
  
  const playerReady = () => {
	let type = 0;
	let player = 0;
	let ready = true;
	
	(async () => {
		try {
			const apiTempoReady = await tempoReady('post', User.name, 'wombatAccount', event.key)
		} catch (e) {
			console.log(e)
		}
			
	})();
	
	if(is5vs5){
		type = 5
		if(event.player1.split(',')[0] === user.name){
			player = 1
		}
		if(event.player2.split(',')[0] === user.name){
			player = 2
		}
		if(event.player3.split(',')[0] === user.name){
			player = 3
		}
		if(event.player4.split(',')[0] === user.name){
			player = 4
		}
		if(event.player5.split(',')[0] === user.name){
			player = 5
		}
		if(event.player6.split(',')[0] === user.name){
			player = 6
		}
		if(event.player7.split(',')[0] === user.name){
			player = 7
		}
		if(event.player8.split(',')[0] === user.name){
			player = 8
		}
		if(event.player9.split(',')[0] === user.name){
			player = 9
		}
		if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0'){
			if(event.player10.split(',')[0] === user.name){
				player = 10
			}
		} else {
			if(event.name_owner == user.name){
				player = 10
			}
		}
	} else {
		type = 1
		if(event.player1.split(',')[0] === user.name){
			player = 1
		}
		if(event.player2.split(',')[0] === user.name){
			player = 2
		}
	}
	
	events.sendReadyState(parseInt(event.key), type, player, ready)
  }
  
  const startGame5vs5 = () => {
    setStartGame5vs5Loading(true)
    events.startGame5vs5(event).finally(() => {
      setStartGame5vs5Loading(false)
    })
  }
  
  const textOfSponsorship = event !== undefined && event !== null && event !== "" && event !== {} && event !== [] && event.lobby_sponsored ? " sponsorship" : ''

  let timePlayer1, timePlayer2, showOpponentsBlock, showSponsorsParticipate
  
  timePlayer1 = {
	  name: currentLangData.userInSearchProgress
  }
  timePlayer2 = {
	  name: currentLangData.userInSearchProgress
  }
  
  showOpponentsBlock = false
  showSponsorsParticipate = false
  
  if(canParticipate1v1) {
	if(event.player1 !== "" || event.player2 !== ''){
		if(event.player1.split(',')[0] === user.name || event.player2.split(',')[0] === user.name){
			timePlayer1 = user.steam
			timePlayer1.name = user.name
			showOpponentsBlock = true
		}
	} else {
		if(event.lobby_sponsored !== 0) {
			showSponsorsParticipate = true
		}
	}
  }
  
  if(!is5vs5 && event){
	if(event.player1 !== "" && event.player1 !== " "){
		if(event.player1.split(',')[0] === user.name){
			canBasicallyLeave = true
		}
	}
	if(event.player2 !== "" && event.player2 !== " "){
		if(event.player2.split(',')[0] === user.name){
			canBasicallyLeave = true
		}
	}
  }
  
  
  const goBackHistory = () => {
	  history.push('/profile')
  }
  
  let prizePool = 0, entryFee = 0, playerPrize = 0, entryFeeMin = 0, entryFeeMax = 0, signs = 2
  if(is5vs5){
	  
	  if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false){
		  entryFee = false
		  entryFeeMin = false
		  entryFeeMax = false
		  playerPrize = (parseFloat(event.price_owner) / 5) - (((parseFloat(event.price_owner) / 100) / 5) * currency.commission)
		  prizePool = parseFloat(event.price_owner)
	  } else {
		  entryFeeMin = false
		  entryFeeMax = false
		  entryFee = parseFloat(event.price_owner)
		  playerPrize = (parseFloat(event.price_owner) * 2) - ((parseFloat(event.price_owner) / 100) * currency.commission)
		  prizePool = parseFloat(event.price_owner) * 10
	  }
	  
  } else {
	  
	  if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false){
		  entryFee = false
		  entryFeeMin = false
		  entryFeeMax = false
		  playerPrize = parseFloat(event.rate / 10000) - ((parseFloat(event.rate / 10000) / 100) * currency.commission)
		  prizePool = parseFloat(event.rate / 10000)
	  } else {
		  entryFee = false
		  entryFeeMin = parseFloat(event.rate_from / 10000)
		  entryFeeMax = parseFloat(event.rate_to / 10000)
		  
		  if(event.player2 && event.player2 !== '' && event.player2 !== ' '){
			playerPrize = (parseFloat(event.price_accept) - ((parseFloat(event.price_accept) / 100) * currency.commission)) * 2
		  } else {
			playerPrize = (parseFloat(event.rate_to / 10000) - ((parseFloat(event.rate_to / 10000) / 100) * currency.commission)) * 2
		  }
		  
		  if(event.player2 && event.player2 !== '' && event.player2 !== ' '){
			prizePool = parseFloat(event.price_accept) * 2
		  } else {
			prizePool = parseFloat(event.rate_to / 10000) * 2
		  }
	  }
	  
  }
  
  if(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false && showOnlyOwner){
	  imgSrcHomeSponsor = event.customAva ? event.customAva : "/img/farmAvatar.png" 
  } else {
	  imgSrcHomeSponsor = event.avatarUrl
  }
  
  for(signs; signs < 4; signs ++){
	  if( (currency.getUSD(playerPrize, signs) !== currency.getUSD(prizePool, signs)) && currency.getUSD(playerPrize, signs) > 0 && currency.getUSD(prizePool, signs) > 0){
		  break
	  }
  }
  document.title = currentLangData.eventNumber + ' ' + event.key + ' | FARM.GAME'
  
  const isMobile = window.innerWidth < 568
  
  let printReadyButton = false
  
  if(showReadyButton && !eventIsReady && !event.player1_ready && event.player1.split(',')[0] == user.name){
	  printReadyButton = true
  }
  if(showReadyButton && !eventIsReady && !event.player2_ready && event.player2.split(',')[0] == user.name){
	  printReadyButton = true
  }
  
  if(!is5vs5 && users && users.accept && !users.accept.profileUrl && event.player2 && event.player2 !== '' && event.player2 !== ' ' && event.player1 && event.player1 !== '' && event.player1 !== ' '){
      const getUsers = async () => {
        try {
          console.log('event', event)

		  if(event.lobby_sponsored){
			  const responseAnswer = await Promise.all([
				user.getUserInfo(event.player2.split(',')[0], User.wallet),
				user.getUserInfo(event.player1.split(',')[0], User.wallet),
				user.getUserInfo(event.name_owner, User.wallet),
			  ])
			  setUsers({
				accept: { ...responseAnswer[0], name: event.player2.split(',')[0] },
				owner: { ...responseAnswer[1], name: event.player1.split(',')[0] },
				sponsor: { ...responseAnswer[2], name: event.name_owner }
			  })
		  } else {
			  const response = await Promise.all([
				user.getUserInfo(event.name_accept, User.wallet),
				user.getUserInfo(event.name_owner, User.wallet)
			  ])
			  setUsers({
				accept: { ...response[0], name: event.name_accept },
				owner: { ...response[1], name: event.name_owner }
			  })
		  }
        } catch(e){}
	  }
	  getUsers()
  }
	
  return (
    <Fragment>
      {is5vs5 && modal.visible.leaveEvent && (
        <LeaveEventModal onClickLeave={onClickLeave} />
      )}
	  {canParticipate1v1 && modal.visible.leaveEvent && (
		<LeaveEventModal onClickLeave={onClickLeave} />
	  )}
      <div
        className={`main-wrap ${
          is5vs5 ? 'main-wrap--event5vs5' : 'main-wrap--event'
        }`}>
        <div className="main-mask">
          <Loader
            className={styles.loaderEvent}
            visible={!notFoundStatus && !users}
          />
          {(notFoundStatus && !canParticipate1v1 && event.status === 0) && (
            <div className={styles.notFound}>
              {currentLangData.eventNotFound}
              <br />
              {currentLangData.gameNotStartedYet}
            </div>
          )}
		  {endStatus && (
			<div className={styles.lostOrWinStatusMobile}>
			  {isUserWinner ? (
				<div
				  className={`${styles.singleEventLabel} ${styles.singleEventLabelWin}`}>
				  {currentLangData.uWin}
				</div>
			  ) : (
				<div
				  className={`${styles.singleEventLabel} ${styles.singleEventLabelLoss}`}>
				  {currentLangData.uLost}
				</div>
			  )}
			</div>
		  )}
          <div className={`main-mask--event ${!notFoundStatus ? 'fixHeightForFinishedEvents' : ''}`}>
			<div className={ is5vs5 ? `${styles.lobbyWelcomes} ${styles.isManyMargin}` : `${styles.lobbyWelcomes}` }>
				<div className={styles.centrolizeLobbyText}>
					<div className={styles.lobbyDiscipline}>
						{event.discipline} {currentLangData.lobbyEvent}
					</div>
					<div className={styles.fullEventId}>
						{currentLangData.eventLobbyEvent} #{event.key}
					</div>
				</div>
			</div>
			{(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false) && (
				<div className={`${styles.sponsoredInfo} ${is5vs5 ? styles.toManyMargin : ''}`}>
					<div className={styles.mobileInfoCell}>
					  <div className={styles.eventColumnJustUser}>
							<div className={`${styles.userAvater} ${showOnlyOwner ? styles.lighter : ''}`}>
								<img src={imgSrcHomeSponsor} />
							</div>
							<div className={styles.userInfo}>
								<div className={styles.userName}>
									{event.event_name && event.event_name !== "[object Object]" ? event.event_name : event.name_owner}
								</div>
								<div className={styles.widthForIsSponsors}>
									<div className={styles.starShit}>
										<img src="/img/greenStart.png" />
									</div>
									<div className={styles.sponsoredText}>
										{currentLangData.isEventSponsored}
									</div>
								</div>
							</div>
						  </div>
					  </div>
				</div>
			)}
			<div className={styles.fullContent}>
				
				  {(foundedUser1 && foundedUser2 && !is5vs5) && (
					<Fragment>
						<ProfileEvent
						  data={foundedUser1}
						  winStatus={endStatus ? winStatus.owner : null}
						  owner={event.name_owner}
						  waiting={event.player1_ready ? false : true}
						  ready={event.player1_ready ? true : false}
						  showReadyWaiting={showReadyButton}
						  onClick={() => participate(foundedUser1)}
						/>
						<div className={styles.vsEpt}>
							<span>VS</span>
						</div>
						<ProfileEvent
						  data={foundedUser2}
						  winStatus={endStatus ? winStatus.accept : null}
						  reverse
						  owner={event.name_owner}
						  waiting={event.player2_ready ? false : true}
						  ready={event.player2_ready ? true : false}
						  showReadyWaiting={showReadyButton}
						  onClick={() => participate(foundedUser2)}
						/>
					</Fragment>
				  )}
				
				
				{!notFoundStatus && is5vs5 && users && (
				  <Fragment>
					<Team
					  side="dire"
					  team={event.direTeam}
					  showReadyWaiting={showReadyButton}
					  eventInfo={{
						name_owner: event.name_owner,
						key: event.key,
						status: event.status,
						all: event
					  }}
					/>
					<div className={styles.vsEpt}>
						<span>VS</span>
					</div>
					{runStatus && (
					  <Fragment>
						<span className={styles.headTitle}>{currentLangData.theGameIsReady}</span>
						<span className={styles.headSubTitle}>
						 {currentLangData.glhf} 
						</span>
					  </Fragment>
					)}
					{endStatus && (
					  <span
						className={styles.headTitle}
						style={{ color: isUserWinner ? '#1FDE39' : '#FE0D36' }}>
						{event.side_winner.toUpperCase()} {currentLangData.winBig}
					  </span>
					)}
					<Team
					  side="radiant"
					  team={event.radiantTeam}
					  showReadyWaiting={showReadyButton}
					  eventInfo={{
						name_owner: event.name_owner,
						key: event.key,
						status: event.status,
						all: event
					  }}
					/>
				  </Fragment>
				)}
			  </div>
			</div>
        </div>
      </div>
	  
		<div className={styles.newGuestOrResultBlock}>
			<div className={styles.goBackOrCancleBlock}>
				<div className={styles.forMaxContent}>
					<div className={styles.blockTitle}>
						{currentLangData.entryFee}
					</div>
					{entryFee && !entryFeeMin && !entryFeeMax && (
						<div className={styles.entryFeeBlock}>
							<div className={styles.forDollars}>
								<span>$ {currency.getUSD(entryFee)}</span> USD
							</div>
							<div className={styles.forCrypto}>
								<span>{entryFee}</span> {currency.curr}
							</div>
						</div>
					)}
					{!entryFee && entryFeeMin && entryFeeMax && (
						<div className={styles.entryFeeBlock}>
							<div className={styles.forDollars}>
								<span>$ {currency.getUSD(entryFeeMin)}</span> USD - <span>$ {currency.getUSD(entryFeeMax)}</span> USD 
							</div>
							<div className={styles.forCrypto}>
								<span>{entryFeeMin}</span> {currency.curr} - <span>{entryFeeMax}</span> {currency.curr}
							</div>
						</div>
					)}
					{!entryFee && !entryFeeMin && !entryFeeMax && (
						<div className={styles.freeEnter}>
							{currentLangData.freeFee}
						</div>
					)}
					{(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false) && (
						<div className={styles.forCrypto}>
							{currentLangData.eventPriceForAll}
						</div>
					)}
				</div>
			</div>
			<div className={styles.middleBlock}>
				<div className={styles.forMaxContent}>
					<div className={styles.blockTitle}>
						{currentLangData.playerPrize}
					</div>
					<div className={styles.forDollars}>
						<span>$ {currency.getUSD(playerPrize, signs)}</span> USD
					</div>
					<div className={styles.forCrypto}>
						<span>{playerPrize}</span> {currency.curr}
					</div>
				</div>
			</div>
			<div className={styles.goToProfileOrLeaveBlock}>
				<div className={styles.forMaxContent}>
					<div className={styles.blockTitle}>
						{currentLangData.prizePool}
					</div>
					<div className={styles.forDollars}>
						<span>$ {currency.getUSD(prizePool, signs)}</span> USD
					</div>
					<div className={styles.forCrypto}>
						<span>{prizePool}</span> {currency.curr}
					</div>
				</div>
			</div>
		</div>
		
		{printReadyButton && (
			<div className={styles.lobbyTimerWrap}>
              <div className={`${styles.lobbyTimer}`}>
                <TimeToConnectReady
                  expires={is5vs5 ? 60 * 20 + event.lobby_created : event.lobby_created}
				  event={event}
                />
              </div>
			</div>
		)}


		
		{(event.realStatus < 4) && (
			<div className={styles.dinoButtons}>
				{(user.name == event.name_owner) && (
					<SimpleButton
						title={currentLangData.cancel}
						onClick={cancel}
					/>
				)}
				{canBasicallyLeave && event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false && user.name == event.name_owner && (
					<NewIconGreyButton
					  title={currentLangData.leave}
					  onClick={leave}
					  img="/img/buttonIcons/leave.png"
					/>
				)}
				{canBasicallyLeave && user.name !== event.name_owner && (
					<NewIconGreyButton
					  title={event.realStatus == 1 ? currentLangData.leaveReject : currentLangData.leave}
					  onClick={leave}
					  img="/img/buttonIcons/leave.png"
					/>
				)}
			</div>
		)}
		
	  {endStatus && (
		<div className={styles.gotoProfleButton}>
			<SimpleButton
				title={currentLangData.backToProfile}
				onClick={goBackHistory}
			/>
		</div>
	  )}
	  {(runStatus && event.realStatus < 4 && event.realStatus > 3) && (
		<div className={styles.lobbyTimerWrap}>
              <div className={`${styles.lobbyTimer}`}>
                <TimeToConnect
                  expires={is5vs5 ? 60 * 20 + event.lobby_created : event.lobby_created}
				  event={event}
                />
              </div>
        </div>
	  )}
		<div className={`${styles.singleEventTable}  ${is5vs5 ? styles.fixBottomHard : ''} ${(!is5vs5 && endStatus) ? styles.paddingHuge : ''}`}>
          <div className={styles.singleEventTableItem}>
            <div className={styles.singleEventTableTitle}>{currentLangData.publicOrPrivate}</div>
				{event.lobby_private !== 0 && event.lobby_private !== '0' && event.lobby_private !== false ? (
					<div className={styles.privateOrPublic}>
						<img src="/img/private.png" />
						<span>{currentLangData.private}</span>
					</div>
				) : (
					<div className={styles.privateOrPublic}>
						<img src="/img/public.png" />
						<span>{currentLangData.public}</span>
					</div>
				)}
          </div>
		  <div className={styles.singleEventTableItem}>
            <div className={styles.singleEventTableTitle}>{event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false ? currentLangData.sponsorship : currentLangData.offtenUserEvent}</div>
            {!showOnlyOwner && users && (
				<div>{is5vs5 ? users.owner.username : event.name_owner}</div>
			)}
			{showOnlyOwner && (
				<div>{showOnlyOwner}</div>
			)}
			{(event.lobby_sponsored !== 0 && event.lobby_sponsored !== '0' && event.lobby_sponsored !== false && !showOnlyOwner && !users) && (
				<div>{event.name_owner}</div>
			)}
          </div>
          <div className={styles.singleEventTableItem}>
            <div className={styles.singleEventTableTitle}>{currentLangData.mode}</div>
            <div>{event.mode}</div>
          </div>
          <div className={styles.singleEventTableItem}>
            <div className={styles.singleEventTableTitle}>{currentLangData.server}</div>
            <div>{event.server}</div>
          </div>
		  {event.realStatus < 4 && (
			  <div className={styles.singleEventTableItem}>
				<div className={styles.singleEventTableTitle}>{currentLangData.countdown}</div>
				<div className={styles.countdownBlock}>
					{(showOnlyOwner && !event.lobby_created) ? (
						currentLangData.unlimited
					) : (
						<div>
							{runStatus ? (
								<LobbyTimer
								  expires={
									is5vs5 ? 60 * 20 + event.lobby_created : event.lobby_created
								  }
								  event={event}
								/>
							) : (
								<div>
									{event.realStatus == 6 ? (
										<FormattedDay time={is5vs5 ? event.created_at : event.accepted_at} />
									) : (
										<LobbyTimer
										  expires={event.expires}
										  event={event}
										/>
									)}
									
								</div>
							)}
						</div>
					)}
				</div>
			  </div>
		  )}
        </div>
		
		{(prepareStatus || runStatus || notFoundStatus) && (
			<div className={styles.empty}>
			  
			  {event.realStatus < 3.5 && (
				<div>
				  {user.name == event.name_owner ? (
					  <div className={styles.title}>
						{currentLangData.ifAllHere}
						<br />
						{currentLangData.youCanStart}
					  </div>
				  ) : (
					<div className={styles.title}>
						{is5vs5 ? currentLangData.waitForOtherPlauersPart1 : currentLangData.waitForOtherPlauersPart1In1vs1}
						<br />
						{is5vs5 ? currentLangData.waitForOtherPlauersPart2 : currentLangData.waitForOtherPlauersPart2In1vs1}
					</div>
				  )}
				</div>
			  )}
			  
			  {event.realStatus >= 3.5 && (
				<div className={styles.title}>
					{currentLangData.botInvite}
					<br />
					{currentLangData.toTheLobby}
				</div>
			  )}
							
				{event.realStatus >= 3.5 && (
				<div className={styles.credWrap}>
					<div className={styles.cred}>
					  <div className={styles.credItem}>
						<div className={styles.credTitle}>{currentLangData.lobbyId}</div>
						<div className={styles.credDesc}>{event.event_name_steam}</div>
					  </div>
					  {passwordAccess && (
						<div className={styles.credItem}>
						  <div className={styles.credTitle}>{currentLangData.password}</div>
						  <div className={styles.credDesc}>
							{hashCode(
							  `${is5vs5 ? '5' : '1'}${parseInt(event.key)}${
								event.created_at
							  }`
							)}
						  </div>
						</div>
					  )}
					</div>
				</div>
				)}
				
				{ (event.realStatus > 3 && event.realStatus < 6 || (event.realStatus > 3 && event.realStatus < 6 && event.name_owner == user.name) ) && (
					<div className={styles.runStatusOn}>
						{user.name == event.name_owner && (
						  <div className={`${styles.blockCenter} ${styles.lobbyBtn}`}>
							{is5vs5 && (
								<NewIconButton 
									title={currentLangData.start} 
									img="/img/buttonIcons/startevent.png"
									onClick={startGame5vs5}
								/>
							)}
							<a href="steam://rungameid/570" className={styles.hideOnMobile} style={{marginTop: '20px'}} >
							  <NewIconButton 
								title={currentLangData.openDota2}
								img="/img/buttonIcons/installextension.png"
							  />
							</a>
						  </div>
						)}
					</div>
				)}
				  
				<div className={styles.titleSub}>
					{is5vs5 ? currentLangData.onlyCreator : currentLangData.onlyCreator1vs1} <br />
					{is5vs5 ? currentLangData.canStart : currentLangData.canStart1vs1}
				</div>
				{isMobile ? (
				  <div className={styles.copyLinkblock}>
						<div className={styles.preLinkText}>{currentLangData.lobbyLink}</div>
						<div className={styles.linkContainer}>
							<div className={styles.link}>{location.href}</div>
						</div>
						<div className={styles.button} onClick={() => copy(location.href)}>
							  <SimpleButton title={currentLangData.copyLinkTitle} />
						</div>
				  </div>
				) : (
				  <div className={styles.copyLinkblock}>
						<div className={styles.linkContainer}>
							<div className={styles.preLinkText}>{currentLangData.lobbyLink}</div>
							<div className={styles.link}>{location.href}</div>
							<div className={styles.button} onClick={() => copy(location.href)}>
							  <SimpleButton title={currentLangData.copyLinkTitle} />
							</div>
						</div>
				  </div>
				)}

				  
			  <div className={styles.subTextLink}>
				{currentLangData.sendLinkToFriend}
			  </div>

			</div>
		)}
      
      {rejectStatus && (
		history.push('/')
      )}
    </Fragment>
  )
}

export default observer(Event)