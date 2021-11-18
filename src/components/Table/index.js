import React, { Fragment, useRef, useState, useEffect, useContext } from 'react'
import styles from './table.module.css'
import User from '../../store/user'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import { Button, IconButton, NewIconButton, SimpleButton, NewIconGreyButton } from '../../ui/index'
import {
  copyToClipboard as copy,
  intDivision,
  checkAccess,
  checkWinStatus5vs5
} from '../../utils/lib'
import Nickname from '../Nickname/index'
import history from '../../history'
import LangContext from '../Lang/context/LangContext'

const EventsTableItem = observer(({ item }) => {
  const { currentLangData } = useContext(LangContext)
  const { currency, user, events, modal } = useStores()
  const is5vs5 = item.mode === '5 vs 5'
  let rate, playersCount, rate_to, rate_from, playersMax, isContractEvent, spanPlaced, iconOfLobbyGuard, imgSrcHomeSponsor, maxWinPool
  
  user.checkParticipation()
  
  isContractEvent = false
  playersMax = 10
  
  
  if(item.name_owner == 'farmlynxm1v1' || 
  item.name_owner == 'farmlynxm5v5' || 
  item.name_owner == 'farmgamem1v1' || 
  item.name_owner == 'farmgamem5v5' ||
  item.name_owner == 'farmstaonee1' ||
  item.name_owner == 'farmstafive1' ||
  item.name_owner == 'contractfa11' ||
  item.name_owner == 'contractfa12'){
	  isContractEvent = true
  }

  if(User.symbol == 'LNX'){
	rate_to = currency.withUSD(item.rate_to / 100000000)
	rate_from = currency.withUSD(item.rate_from / 100000000)
  } else {
	rate_to = currency.withUSD(item.rate_to / 10000)
	rate_from = currency.withUSD(item.rate_from / 10000)
  }

  if (is5vs5) {
    rate = currency.withUSD(item.price_owner)
    playersCount = item.direTeam.length + item.radiantTeam.length
  }
  
  if(!is5vs5 && item.lobby_sponsored){
	  playersMax = 2
	  playersCount = 0
	  if(item.player1 !== ""){
		  playersCount++
	  }
	  if(item.player2 !== ""){
		  playersCount++
	  }
  }

  spanPlaced = ""
  
  if(item.lobby_sponsored || is5vs5){
	spanPlaced = "(" + playersCount + "/" + playersMax + ")"
  }
  
  let expires = item.expires
  const now = user.time

  if (item.status === 1) {
    expires = now < item.accept_expires ? item.accept_expires : expires
  }

  const cancel = event => {
    event.stopPropagation()
    if (is5vs5) {
      events.cancel5vs5(item.key, false)
    } else {
      events.cancel(item.key)
    }
  }
  
  const leave1v1 = event => {
	  modal.open('lobbyLeaving')
	  events.leave1v1(item.key).then(() => {
		modal.close('lobbyLeaving')
	  })
  }

  const access = (is5vs5 && checkAccess(item, user.name)) || (item.name_owner === user.name && item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false)
  
  const isGuest = user.isGuest

  const participate = event => {
	if(!isGuest){
		event.stopPropagation()
		if(!user.canParticipate){
			modal.open('cantParticipateModal')
		} else {
			
			if(user.stats.testGames >= 3 && isContractEvent && user.stats.testGamesWonMatches > 0){
				modal.open('testGamesEnd')
			} else {
				if (!user.isSteamLinked) {
				  modal.open('steam')
				} else {
				  if (is5vs5) {
					modal.open('participate5vs5', item)
				  } else {
					modal.open('accept', item)
				  }
				}
			}
		}
	} else {
		event.stopPropagation()
		modal.open('loginPageModal')
	}
  }
  const toEventPage = () => {
      history.push(`/event/${item.key}`)
  }
  
  let isInparticipate1v1 = false;
  if(!is5vs5){
	  if(item.player1.split(',')[0] == User.name) {
		  isInparticipate1v1 = true;
	  }
  }
  
  if(!rate && User.symbol !== 'LNX'){
	  rate = currency.withUSD(item.rate / 10000)
  }
  
  if(item.lobby_private !== 0 && item.lobby_private !== '0' && item.lobby_private !== '' && item.lobby_private !== false){
	iconOfLobbyGuard = '/img/private.png'
  } else {
	iconOfLobbyGuard = '/img/public.png'
  }
  if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && isContractEvent){
	  imgSrcHomeSponsor = item.customAva ? item.customAva : "/img/farmAvatar.png" 
  } else {
	  imgSrcHomeSponsor = item.avatarUrl
  }
  
  if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false ){
	  maxWinPool = is5vs5 ? (rate * 1).toFixed(2) : (rate * 1).toFixed(2)
  } else {
	maxWinPool = is5vs5 ? (rate * 2 * 5).toFixed(2) : (rate_to * 2).toFixed(2)
  }
  return (
    <div
      className={`${styles.row}  ${styles.desktopRowTable} ${access ? styles.rowCursor : ''} ${
        item.lobby_sponsored ? styles.sponsored : ''
      }`}
      onClick={toEventPage}>
      
      <div className={`${styles.cell} ${styles.cell1}`}>
        {item.discipline == 'CS:GO' && (
			<img className={styles.dota} src="img/csgo.svg" alt="CS:GO" />
		)}
		{item.discipline == 'Dota 2' && (
			<img className={styles.dota} src="/img/dota2.svg" alt="Dota 2" />
		)}
		<img src={iconOfLobbyGuard} />
      </div>
	  
	  <div className={`${styles.cell} ${styles.cell2}`}>
		<div className={styles.mobileInfoCell}>
			  <div className={item.lobby_sponsored ? `${styles.eventColumnSponsored}` : `${styles.eventColumnJustUser}`}>
				<div className={styles.userAvater}>
					<img src={imgSrcHomeSponsor} />
				</div>
				<div className={styles.userInfo}>
					<div className={styles.userName}>
						{item.event_name && item.event_name !== "[object Object]" ? item.event_name : item.name_owner}
					</div>
					{item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && (
						<div className={styles.widthForIsSponsors}>
							<div className={styles.starShit}>
								<img src="/img/greenStart.png" />
							</div>
							<div className={styles.sponsoredText}>
								{currentLangData.isEventSponsored}
							</div>
						</div>
					)}
				</div>
			  </div>
		  </div>
      </div>
      <div className={`${styles.cell} ${styles.cell3}`}>
        {item.mode}

          <span className={styles.modeCount}>{spanPlaced}</span>

      </div>
	  <div className={`${styles.cell} ${styles.cell4}`}>
        <div className={styles.noFlex}>
			<div className={styles.forDollars}>
				<span>{currency.getUSD(maxWinPool)}</span> USD
			</div>
			<div className={styles.forCrypto}>
				<span>{maxWinPool}</span> {currency.curr}
			</div>
		</div>
      </div>
      <div className={`${styles.cell} ${styles.cell5}`}>
		{item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false ? (
			currentLangData.freeFee
		) : (
			<div className={styles.noFlex}>
				{is5vs5 ? (
				<div>
					<div className={styles.forDollars}>
						<span>{currency.getUSD(rate)}</span> USD
					</div>
					<div className={styles.forCrypto}>
						<span>{rate}</span> {currency.curr}
					</div>
				</div>
				) : (
				<div>
					<div className={styles.forDollars}>
						<span>{currency.getUSD(rate_from)}</span> USD - <span>{currency.getUSD(rate_to)}</span> USD
					</div>
					<div className={styles.forCrypto}>
						<span>{rate_from}</span> {currency.curr} - <span>{rate_to}</span> {currency.curr}
					</div>
				</div>
				)}
			</div>
		)}
      </div>
	  <div className={`${styles.cell} ${styles.cell6}`}>
		  {item.serverGroup}
	  </div>
      <div className={`${styles.cell} ${styles.cell7}`}>
		{!(item.lobby_sponsored && isContractEvent) ? (
			<RenderExpires expires={now < expires ? expires : ''} />
		) : (
			<span>{currentLangData.unlimited}</span>
		)}
      </div>
      <div className={`${styles.cell} ${styles.cell8}`}>
        {item.status === 0 &&
          (item.name_owner === user.name ? (
			<SimpleButton
			  title={currentLangData.cancelBig}
			  className={`${styles.rowButton} ${styles.improveButton}`}
			  onClick={cancel}
			/>
          ) : (
            !access && !isInparticipate1v1 && (
			  
              <NewIconButton
                className={styles.rowButton}
                title={currentLangData.participate}
                onClick={participate}
				img="/img/buttonIcons/participate.png"
              />
            )
          ))}
		{item.status === 0 && isInparticipate1v1 && item.name_owner !== user.name && (
			<NewIconGreyButton
			  title={currentLangData.leave}
			  className={`${styles.rowButton}`}
			  onClick={leave1v1}
			  img="/img/buttonIcons/leave.png"
			/>
		)}
      </div>
    </div>
  )
})

const MobileEventsTableItem = observer(({ item }) => {
  const { currentLangData } = useContext(LangContext)
  const { currency, user, events, modal } = useStores()
  const is5vs5 = item.mode === '5 vs 5'
  let rate, playersCount, rate_to, rate_from, playersMax, isContractEvent, spanPlaced, imgSrcHomeSponsor
  
  user.checkParticipation()
  
  isContractEvent = false
  playersMax = 10
  
  
  if(item.name_owner == 'farmlynxm1v1' || 
  item.name_owner == 'farmlynxm5v5' || 
  item.name_owner == 'farmgamem1v1' || 
  item.name_owner == 'farmgamem5v5' ||
  item.name_owner == 'farmstaonee1' ||
  item.name_owner == 'farmstafive1' ||
  item.name_owner == 'contractfa11' ||
  item.name_owner == 'contractfa12'){
	  isContractEvent = true
  }

  if(User.symbol == 'LNX'){
	rate_to = currency.withUSD(item.rate_to / 100000000)
	rate_from = currency.withUSD(item.rate_from / 100000000)
  } else {
	rate_to = currency.withUSD(item.rate_to / 10000)
	rate_from = currency.withUSD(item.rate_from / 10000)
  }

  if (is5vs5) {
    rate = currency.withUSD(item.price_owner)
    playersCount = item.direTeam.length + item.radiantTeam.length
  }
  
  if(!is5vs5){
	  playersMax = 2
	  playersCount = 0
	  if(item.player1 !== "" && item.player1 !== " "){
		  playersCount++
	  }
	  if(item.player2 !== "" && item.player2 !== " "){
		  playersCount++
	  }
  }
 
  spanPlaced = playersCount + "/" + playersMax
  
  if(!is5vs5 && item.lobby_sponsored && User.symbol == 'LNX'){
	  rate = currency.withUSD(item.rate / 100000000)
  }
  
  let expires = item.expires
  const now = user.time

  if (item.status === 1) {
    expires = now < item.accept_expires ? item.accept_expires : expires
  }

  const cancel = event => {
    event.stopPropagation()
    if (is5vs5) {
      events.cancel5vs5(item.key, false)
    } else {
      events.cancel(item.key)
    }
  }
  
  const leave1v1 = event => {
	  events.leave1v1(item.key)
  }

  const access = is5vs5 && checkAccess(item, user.name)
  const access1v1 = !is5vs5 && ((item.player1.split(',')[0] === user.name || item.player2.split(',')[0] === user.name) || (item.name_owner === user.name && !item.lobby_sponsored))
  
  const sponsorCanParticipate1v1 = !is5vs5 && item.player1.split(',')[0] !== user.name && item.player2.split(',')[0] !== user.name && item.name_owner === user.name && item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false
  
  const isGuest = user.isGuest
  
  const participate = event => {
	if(!isGuest){
		event.stopPropagation()
		if(!user.canParticipate){
			modal.open('cantParticipateModal')
		} else {
			if(user.stats.testGames >= 3 && isContractEvent && user.stats.testGamesWonMatches > 0){
				modal.open('testGamesEnd')
			} else {
				if (!user.isSteamLinked) {
				  modal.open('steam')
				} else {
				  if (is5vs5) {
					modal.open('participate5vs5', item)
				  } else {
					modal.open('accept', item)
				  }
				}
			}
		}
	} else {
		event.stopPropagation()
		modal.open('loginPageModal')
	}
  }
  const toEventPage = () => {
    if (access || access1v1) {
      history.push(`/event/${item.key}`)
    } else {
		if(user.stats.testGames >= 10 && isContractEvent){
			modal.open('testGamesEnd')
		} else {
			if (!user.isSteamLinked) {
			  modal.open('steam')
			} else {
			  if (is5vs5) {
				modal.open('participate5vs5', item)
			  } else {
				modal.open('accept', item)
			  }
			}
		}
	}
  }
  
  let isInparticipate1v1 = false;
  if(!is5vs5){
	  if(item.player1.split(',')[0] == User.name) {
		  isInparticipate1v1 = true;
	  }
  }
  
  if(!rate && User.symbol !== 'LNX'){
	  rate = currency.withUSD(item.rate / 10000)
  }
  
  if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && isContractEvent){
	  imgSrcHomeSponsor = item.customAva ? item.customAva : "/img/farmAvatar.png" 
  } else {
	  imgSrcHomeSponsor = item.avatarUrl
  }

  return (
    <div
      className={`${styles.row} ${styles.mobileRowTable}`}
      >
	  <div className={styles.mobileTableHalfFirst}>
		  <div className={styles.mobileInfoCell}>
			  <div className={styles.eventColumnTitle}>
				{currentLangData.nickOrTitle}
			  </div>
			  <div className={item.lobby_sponsored ? `${styles.eventColumnSponsored}` : `${styles.eventColumnJustUser}`}>
				<div className={styles.userAvater}>
					<img src={imgSrcHomeSponsor} />
				</div>
				<div className={styles.userInfo}>
					<div className={styles.userName}>
						{item.event_name && item.event_name !== "[object Object]" ? item.event_name : item.name_owner}
					</div>
					{item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && (
						<div className={styles.widthForIsSponsors}>
							<div className={styles.starShit}>
								<img src="/img/greenStart.png" />
							</div>
							<div className={styles.sponsoredText}>
								{currentLangData.isEventSponsored}
							</div>
						</div>
					)}
				</div>
			  </div>
		  </div>
		  <div className={styles.mobileDisciplineCell}>
			  <div className={styles.eventColumnTitle}>
				{currentLangData.eventGame}
			  </div>
			  <div className={styles.eventColumnContent}>
				{item.discipline == 'CS:GO' && (
				  <img className={styles.dota} src="img/csgo.svg" alt="CS:GO" />
				)}
				{item.discipline == 'Dota 2' && (
				  <img className={styles.dota} src="/img/dota2.svg" alt="Dota 2" />
				)}
			</div>
		  </div>
	  </div>
	  
	  <div className={styles.mobileTableHalfSecond}>
		  <div className={styles.mobilePubPriveCell}>
			<div className={styles.eventColumnTitle}>
				{currentLangData.publicOrPrivate}
			</div>
			<div className={styles.eventColumnContent}>
				{item.lobby_private !== "0" && (
					<div className={styles.mobilePrivateContent}>
						<img src="/img/private.png" />
						{currentLangData.private}
					</div>
				)}
				{item.lobby_private == "0" && (
					<div className={styles.mobilePrivateContent}>
						{currentLangData.public}
					</div>
				)}
			</div>
		  </div>
		  <div className={styles.mobileModeCell}>
			<div className={styles.eventColumnTitle}>
				{currentLangData.mode}
			</div>
			{item.mode}

			  <span className={styles.modeCount}>({spanPlaced})</span>
		  </div>
		  <div className={styles.mobileRateCell}>
			<div className={styles.eventColumnTitle}>
				{currentLangData.rate}
			</div>
			{is5vs5 || item.lobby_sponsored
			  ? `${rate} ${currency.curr}`
			  : `${rate_from} - ${rate_to} ${currency.curr}`}
		  </div>
		  <div className={styles.mobileDurationCell}>
			<div className={styles.eventColumnTitle}>
				{currentLangData.duration}
			</div>
			{!(item.lobby_sponsored && isContractEvent) ? (
				<RenderExpires expires={now < expires ? expires : ''} />
			) : (
				<span>{currentLangData.unlimited}</span>
			)}
		  </div>
      </div>
	  
	  <div className={styles.eventActionButton}>
		{item.status === 0 &&
          (item.name_owner === user.name ? (
            <SimpleButton
			  title={currentLangData.cancelBig}
			  className={`${styles.rowButton} ${styles.improveButton}`}
			  onClick={cancel}>
			</SimpleButton>
          ) : (
            !access && !isInparticipate1v1 && (
              <NewIconButton
                className={styles.rowButton}
                title={currentLangData.participate}
                onClick={participate}
				img="/img/buttonIcons/participate.png"
              />
            )
          ))}
		{item.status === 0 && isInparticipate1v1 && item.name_owner !== user.name && (
			<NewIconGreyButton
			  title={currentLangData.leave}
			  className={`${styles.rowButton}`}
			  onClick={leave1v1}
			  img="/img/buttonIcons/leave.png"
			/>
		)}
		{(access || access1v1) && (
			<NewIconButton
                className={styles.rowButton}
                title={currentLangData.goToEventButton}
                onClick={toEventPage}
				img="/img/buttonIcons/installextension.png"
            />
		)}
		{sponsorCanParticipate1v1 && (
			<NewIconButton
                className={styles.rowButton}
                title={currentLangData.participate}
                onClick={participate}
				img="/img/buttonIcons/participate.png"
            />
		)}
	  </div>
    </div>
  )
})

const renderPages = (pages, initial) => {
  const result = []
  for (let i = 1; i <= pages; i++) {
    result.push(i)
  }
  return result
}

const Pagination = observer(({ set, pagesCount, initial }) => {
  const pages = renderPages(pagesCount)
  const next = () => {
    set(initial + 1)
  }

  const prev = () => {
    set(initial - 1)
  }

  return (
    <div className={styles.pagination}>
      <div className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
        <img src="img/arrowleft.png" alt="<" />
      </div>
      <div className={styles.paginationItems}>
        {pages.map(number => (
          <div
            onClick={() => set(number)}
            className={`${styles.paginationItem} ${
              initial === number ? styles.paginationItemActive : ''
            }`}
            key={number}>
            {number}
          </div>
        ))}
      </div>
      <div className={styles.arrow} onClick={next}>
        <img src="img/arrowright.png" alt=">" />
      </div>
    </div>
  )
})

const RenderExpires = ({ expires }) => {
  const { user } = useStores()
  
  const [lost, setLost] = useState(() => {
    if (expires) {
      return expires - user.time
    } else {
      return null
    }
  })

  useEffect(() => {
    let interval
    if (expires) {
      interval = setInterval(() => {
        setLost(lost => lost - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [expires])

  const lostMin = Math.floor(lost / 60)
  const lostSec = lost - lostMin * 60
  return `${('0' + lostMin).slice(-2)}:${('0' + lostSec).slice(-2)}`
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

const ProfileTableItem = observer(({ item }) => {
  const { currentLangData } = useContext(LangContext)
  const { currency, user } = useStores()
  const is5vs5 = item.mode === '5 vs 5'
  let isWinner, rateTotal, imgSrcHomeSponsor, isContractEvent
  
  isContractEvent = false  
  
  if(item.name_owner == 'farmlynxm1v1' || 
  item.name_owner == 'farmlynxm5v5' || 
  item.name_owner == 'farmgamem1v1' || 
  item.name_owner == 'farmgamem5v5' ||
  item.name_owner == 'farmstaonee1' ||
  item.name_owner == 'farmstafive1' ||
  item.name_owner == 'contractfa11' ||
  item.name_owner == 'contractfa12'){
	  isContractEvent = true
  }
  
  if (is5vs5) {
    isWinner = item.status !== 3 ? true : checkWinStatus5vs5(item, user.name)
    rateTotal = item.price_owner
  } else {
    isWinner = item.steam_id_winner === user.steam.steamId
	if(User.symbol == 'LNX'){
		rateTotal = item.rate_total / 100000000
	} else {
		rateTotal = item.rate_total / 10000
	}
  }
  
  let multi = 2

  let sum = {
    loss: rateTotal,
    won: (rateTotal * multi * (100 - currency.commission)) / 100
  }
  
  if(item.lobby_sponsored){
	  multi = 1
	  sum = {
		  loss: 0,
		  won: (rateTotal * multi * (100 - currency.commission)) / 100
	  }
  }

  const copyToClipboard = () => {
    copy(parseInt(item.key))
  }

  const goToEventPage = () => {
    history.push(`/event/${item.key}`)
  }
  
  if(item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && isContractEvent){
	  imgSrcHomeSponsor = "/img/farmAvatar.png" 
  } else {
	  imgSrcHomeSponsor = item.avatarUrl
  }
  
  return (
    <div
      className={`${styles.row} ${styles.profileItemRow} ${styles.profileItemRowDesktop}`}
      onClick={goToEventPage}>
      <div className={`${styles.cell} ${styles.cellProfile1}`}>
        {item.discipline == 'CS:GO' && (
			<img className={styles.dota} src="img/csgo.png" alt="CS:GO" />
		)}
		{item.discipline == 'Dota 2' && (
			<img className={styles.dota} src="/img/dota2.svg" alt="Dota 2" />
		)}
      </div>
	  <div className={`${styles.cell} ${styles.cellProfile2}`}>#{item.key}</div>
	  <div className={`${styles.cell} ${styles.cellProfile3}`}>
		  <div className={styles.mobileInfoCell}>
			  <div className={item.lobby_sponsored ? `${styles.eventColumnSponsored}` : `${styles.eventColumnJustUser}`}>
				<div className={styles.userAvater}>
					<img src={imgSrcHomeSponsor} />
				</div>
				<div className={styles.userInfo}>
					<div className={styles.userName}>
						{item.event_name && item.event_name !== "[object Object]" ? item.event_name : item.name_owner}
					</div>
					{item.lobby_sponsored !== 0 && item.lobby_sponsored !== '0' && item.lobby_sponsored !== false && (
						<div className={styles.widthForIsSponsors}>
							<div className={styles.starShit}>
								<img src="/img/greenStart.png" />
							</div>
							<div className={styles.sponsoredText}>
								{currentLangData.isEventSponsored}
							</div>
						</div>
					)}
				</div>
			  </div>
		  </div>
	  </div>
      <div className={`${styles.cell} ${styles.cellProfile4}`}>{item.mode}</div>
      <div className={`${styles.cell} ${styles.cellProfile5}`}>
        <div className={styles.sum}>
		  
		  {item.realStatus < 6 && item.realStatus !== 4 && (
			<div className={`${styles.fg1} ${styles.switcherWholeBlock}`}>
					<div className={styles.forDollars}>
						<span>{currency.getUSD(sum.won)}</span> USD
					</div>
					<div className={styles.forCrypto}>
						<span>{currency.withUSD(sum.won)}</span> {currency.curr}
					</div>
				</div>
		  )}
		  {item.realStatus == 6  && (
			<div className={styles.resultBlockTable}>
			  {isWinner ? (
				<div className={`${styles.fg1} ${styles.switcherWholeBlock}`}>
					<div className={styles.forDollars}>
						<div className={styles.curvyBlock}>
							<span> + {currency.getUSD(sum.won)}</span> USD
						</div>
						<div className={styles.newButBlock}>
							<div className={styles.winnerEpt}>
								{currentLangData.winner}
							</div>
						</div>
					</div>
					<div className={styles.forCrypto}>
						<span> + {currency.withUSD(sum.won)}</span> {currency.curr}
					</div>
				</div>
			  ) : (
				<div className={`${styles.fg1} ${styles.switcherWholeBlock}`}>
					<div className={styles.forDollars}>
						<div className={styles.curvyBlock}>
							<span> - {currency.getUSD(sum.loss)}</span> USD
						</div>
						<div className={styles.newButBlock}>
							<div className={styles.looserEpt}>
								{currentLangData.looser}
							</div>
						</div>
					</div>
					<div className={styles.forCrypto}>
						<span> - {currency.withUSD(sum.loss)}</span> {currency.curr}
					</div>
				</div>
			  )}
			</div>
		  )}
		  

        </div>
      </div>
      <div className={`${styles.cell} ${styles.cellProfile6}`}>
        <FormattedDay time={is5vs5 ? item.created_at : item.accepted_at} />
      </div>
      <div className={`${styles.cell} ${styles.cellProfile7}`}>
        <SimpleButton
          title={currentLangData.details}
          className={`${styles.rowButton} ${styles.improveButton}`}
          onClick={goToEventPage}>
        </SimpleButton>
      </div>
    </div>
  )
})

const MobileProfileTableItem = observer(({ item }) => {
  const { currentLangData } = useContext(LangContext)
  const { currency, user } = useStores()
  const is5vs5 = item.mode === '5 vs 5'
  let isWinner, rateTotal
  if (is5vs5) {
    isWinner = item.status !== 3 ? true : checkWinStatus5vs5(item, user.name)
    rateTotal = parseFloat(item.price_owner)
  } else {
    isWinner = item.steam_id_winner === user.steam.steamId
	if(User.symbol == 'LNX'){
		rateTotal = item.rate_total / 100000000
	} else {
		rateTotal = item.rate_total > 0 ?  item.rate_total / 10000 : parseFloat(item.price_owner)
	}
  }
  
  let multi = 2

  let sum = {
    loss: rateTotal,
    won: (rateTotal * multi * (100 - currency.commission)) / 100
  }
  
  if(item.lobby_sponsored){
	  multi = 1
	  sum = {
		  loss: 0,
		  won: (rateTotal * multi * (100 - currency.commission)) / 100
	  }
  }

  const copyToClipboard = () => {
    copy(parseInt(item.key))
  }

  const goToEventPage = () => {
    history.push(`/event/${item.key}`)
  }

  return (
    <div
      className={styles.mobileProfileRow}
      onClick={goToEventPage}>
		<div className={styles.mobileProfileRowFirstHalf}>
		  <div className={styles.mobileProfileDiscipline}>
			{item.discipline == 'CS:GO' && (
				<img src="img/csgo.svg" alt="CS:GO" />
			)}
			{item.discipline == 'Dota 2' && (
				<img src="/img/dota2.svg" alt="Dota 2" />
			)}
		  </div>
		  <div className={styles.mobileProfileMode}>
			<div className={`${styles.mobileProfileTitleResult} ${!isWinner && item.realStatus == 6 ? styles.mobileProfileTitleResultRed : ''}`}>
				{item.status !== 3
				? `${currentLangData.mode}`
				: isWinner 
				? `${currentLangData.uWin}`
				: `${currentLangData.uLoos}`
				}
			</div>
			{item.mode}
		  </div>
	  </div>
	  <div className={styles.mobileProfileRowSecondHalf}>
		  <div className={styles.mobileProfileRate}>
			<div className={styles.mobileProfileRowTitle}>{currentLangData.rate}</div>
			<div className={styles.mobileProfilerateblock}>
			  {item.status !== 3
				? currency.withUSD(sum.won)
				: isWinner
				? `+ ${currency.withUSD(sum.won)} ${currency.curr}`
				: `- ${currency.withUSD(sum.loss)} ${currency.curr}`}
			</div>
		  </div>
		  <div className={styles.mobileProfileGoTO}>
			<img src="/img/gotoarrow.svg" />
		  </div>
	  </div>
    </div>
  )
})

const EventsTable = observer(() => {
  const { currentLangData } = useContext(LangContext)
  const headRef = useRef(null)
  const { events } = useStores()
  const onHeadClick = el => {
    if (el.target.classList.contains(styles.cell)) {
      if (el.target.classList.contains(styles.active)) {
        el.target.classList.toggle(styles.rotate)
        if (
          el.target.classList.contains(styles.cell3) ||
          el.target.classList.contains(styles.cell4) ||
          el.target.classList.contains(styles.cell5)
        ) {
          events.setEventsSort({ reverse: !events.eventsSort.reverse })
        }
      } else {
        el.target.classList.add(styles.active, styles.rotate)

        if (el.target.classList.contains(styles.cell3)) {
          events.setEventsSort({
            query: 'mode',
            type: 'string',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cell4)) {
          events.setEventsSort({
            query: 'rate_to',
            type: 'number',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cell5)) {
          events.setEventsSort({ query: 'key', type: 'number', reverse: false })
        }

        Array.from(headRef.current.children).map(item => {
          if (el.target.attributes['1'].value !== item.dataset.collum) {
            item.classList.remove(styles.active, styles.rotate)
          }
        })
      }
    }
  }
  const pagesCount = intDivision(events.events.length)
  const page = events.eventsPage
  const setPage = val => {
    events.setEventsPage(val)
  }

  return (
    <Fragment>
      <div className={styles.table}>
        <div className={styles.head} ref={headRef} onClick={onHeadClick}>
          <div className={`${styles.cell} ${styles.cell1}`} data-collum="1">
            {currentLangData.eventGame}
            {/* not sorting*/}
          </div>
          <div className={`${styles.cell} ${styles.cell2}`} data-collum="2">
            {currentLangData.nickOrTitle}
            {/* not sorting*/}
          </div>
          <div className={`${styles.cell} ${styles.cell3}`} data-collum="3">
            {currentLangData.mode}
            {/* sort rows */}
          </div>
		  <div className={`${styles.cell} ${styles.cell4}`} data-collum="4">
            {currentLangData.maxPricePool}
            {/* sort rows */}
          </div>
          <div className={`${styles.cell} ${styles.cell5}`} data-collum="5">
            {currentLangData.entryFee}
            {/* sort rows */}
          </div>
		   <div className={`${styles.cell} ${styles.cell6}`} data-collum="6">
            {currentLangData.server}
            {/* sort rows */}
          </div>
          <div
            className={`${styles.cell} ${styles.cell7} ${styles.rotate} ${styles.active}`}
            data-collum="5">
            {currentLangData.duration}
            {/* sort rows / sort rows id */}
          </div>
          <div className={`${styles.cellProfile8}`} />
        </div>
        {events.filteredEvents.slice((page - 1) * 10, page * 10).map(item => (
          <EventsTableItem item={item} key={item.key} />
        ))}
		{events.filteredEvents.slice((page - 1) * 10, page * 10).map(item => (
          <MobileEventsTableItem item={item} key={item.key} />
        ))}
      </div>
      {pagesCount !== 1 && (
        <Pagination pagesCount={pagesCount} initial={page} set={setPage} />
      )}
    </Fragment>
  )
})

const ProfileTable = observer(() => {
  const { currentLangData } = useContext(LangContext)
  const headRef = useRef(null)
  const { events } = useStores()

  const onHeadClick = el => {
    if (el.target.classList.contains(styles.cell)) {
      if (el.target.classList.contains(styles.active)) {
        el.target.classList.toggle(styles.rotate)
        if (
          el.target.classList.contains(styles.cellProfile2) ||
          el.target.classList.contains(styles.cellProfile3) ||
          el.target.classList.contains(styles.cellProfile4) ||
          el.target.classList.contains(styles.cellProfile5)
        ) {
          events.setMyEventsSort({ reverse: !events.myEventsSort.reverse })
        }
      } else {
        el.target.classList.add(styles.active, styles.rotate)
        if (el.target.classList.contains(styles.cellProfile2)) {
          events.setMyEventsSort({
            query: 'mode',
            type: 'string',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile3)) {
          events.setMyEventsSort({
            query: 'rate_total',
            type: 'number',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile4)) {
          events.setMyEventsSort({
            query: 'rate_total',
            type: 'number',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile5)) {
          events.setMyEventsSort({
            query: 'key',
            type: 'number',
            reverse: false
          })
        }

        Array.from(headRef.current.children).map(item => {
          if (el.target.attributes['1'].value !== item.dataset.collum) {
            item.classList.remove(styles.active, styles.rotate)
          }
        })
      }
    }
  }
  const pagesCount = intDivision(events.myEvents.length)
  const page = events.myEventsPage
  const setPage = val => {
    events.setMyEventsPage(val)
  }

  return (
    <Fragment>
      <div className={styles.table}>
        <div className={styles.head} ref={headRef} onClick={onHeadClick}>
          <div
            className={`${styles.cell} ${styles.cellProfile1}`}
            data-collum="1">
            {currentLangData.eventGame}
            {/* not sorting*/}
          </div>
		  <div
            className={`${styles.cell} ${styles.cellProfile2}`}
            data-collum="2">
            {currentLangData.eventId}
            {/* not sorting*/}
          </div>
		  <div
            className={`${styles.cell} ${styles.cellProfile3}`}
            data-collum="3">
            {currentLangData.nickOrTitle}
            {/* not sorting*/}
          </div>
          <div
            className={`${styles.cell} ${styles.cellProfile4}`}
            data-collum="4">
            {currentLangData.mode}
            {/* not sorting*/}
          </div>
          <div
            className={`${styles.cell} ${styles.cellProfile5}`}
            data-collum="5">
            {currentLangData.outcome}
            {/* sort rows */}
          </div>
          <div
            className={`${styles.cell} ${styles.cellProfile6} ${styles.rotate} ${styles.active}`}
            data-collum="6">
            {currentLangData.date}
            {/* sort rows / sort rows id */}
          </div>
          <div className={`${styles.cellProfile7}`} />
        </div>
        {events.filteredMyEvents.slice((page - 1) * 10, page * 10).map(item => (
          <ProfileTableItem item={item} key={item.key} />
        ))}
		{events.filteredMyEvents.slice((page - 1) * 10, page * 10).map(item => (
          <MobileProfileTableItem item={item} key={item.key} />
        ))}
      </div>
      {pagesCount !== 1 && (
        <Pagination pagesCount={pagesCount} initial={page} set={setPage} />
      )}
    </Fragment>
  )
})

const ProfileTableActive = observer(() => {
  const { currentLangData } = useContext(LangContext)
  const headRef = useRef(null)
  const { events } = useStores()
  console.log('chekprofile', events.myActiveEvents)
  const onHeadClick = el => {
    if (el.target.classList.contains(styles.cell)) {
      if (el.target.classList.contains(styles.active)) {
        el.target.classList.toggle(styles.rotate)
        if (
          el.target.classList.contains(styles.cellProfile2) ||
          el.target.classList.contains(styles.cellProfile3) ||
          el.target.classList.contains(styles.cellProfile4) ||
          el.target.classList.contains(styles.cellProfile5)
        ) {
          events.setMyEventsSort({ reverse: !events.myEventsSort.reverse })
        }
      } else {
        el.target.classList.add(styles.active, styles.rotate)
        if (el.target.classList.contains(styles.cellProfile2)) {
          events.setMyEventsSort({
            query: 'mode',
            type: 'string',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile3)) {
          events.setMyEventsSort({
            query: 'rate_total',
            type: 'number',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile4)) {
          events.setMyEventsSort({
            query: 'rate_total',
            type: 'number',
            reverse: false
          })
        } else if (el.target.classList.contains(styles.cellProfile5)) {
          events.setMyEventsSort({
            query: 'key',
            type: 'number',
            reverse: false
          })
        }

        Array.from(headRef.current.children).map(item => {
          if (el.target.attributes['1'].value !== item.dataset.collum) {
            item.classList.remove(styles.active, styles.rotate)
          }
        })
      }
    }
  }
  const pagesCount = intDivision(events.myActiveEvents.length)
  const page = events.myEventsPage
  const setPage = val => {
    events.setMyEventsPage(val)
  }

  return (
    <Fragment>
      <div className={styles.table}>
        <div className={styles.head} ref={headRef} onClick={onHeadClick}>
          <div className={`${styles.cell} ${styles.cell1}`} data-collum="1">
            {currentLangData.eventGame}
            {/* not sorting*/}
          </div>
          <div className={`${styles.cell} ${styles.cell2}`} data-collum="2">
            {currentLangData.nickOrTitle}
            {/* not sorting*/}
          </div>
          <div className={`${styles.cell} ${styles.cell3}`} data-collum="3">
            {currentLangData.mode}
            {/* sort rows */}
          </div>
		  <div className={`${styles.cell} ${styles.cell4}`} data-collum="4">
            {currentLangData.maxPricePool}
            {/* sort rows */}
          </div>
          <div className={`${styles.cell} ${styles.cell5}`} data-collum="4">
            {currentLangData.entryFee}
            {/* sort rows */}
          </div>
          <div
            className={`${styles.cell} ${styles.cell6} ${styles.rotate} ${styles.active}`}
            data-collum="5">
            {currentLangData.duration}
            {/* sort rows / sort rows id */}
          </div>
          <div className={`${styles.cellProfile7}`} />
        </div>
        {events.myActiveEvents.slice((page - 1) * 10, page * 10).map(item => (
          <EventsTableItem item={item} key={item.key} />
        ))}
		{events.myActiveEvents.slice((page - 1) * 10, page * 10).map(item => (
          <MobileEventsTableItem item={item} key={item.key} />
        ))}
      </div>
      {pagesCount !== 1 && (
        <Pagination pagesCount={pagesCount} initial={page} set={setPage} />
      )}
    </Fragment>
  )
})

export { ProfileTable, ProfileTableActive, EventsTable, RenderExpires }
//export { ProfileTable, EventsTable, RenderExpires, ProfileTableMobile, EventsTableMobile}
