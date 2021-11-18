import React, { useState, Fragment, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, LoadingButton, NewIconButton } from '../../ui/index'
import Rate from '../Rate/index'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import User from '../../store/user'
import { observer } from 'mobx-react'
import LangContext from '../../components/Lang/context/LangContext'

import RateMobile from '../RateMobile/index'
import RateContainerMobile from '../RateMobile/RateContainerMobile'
import SponsorshipContainerMobile from '../SponsorshipContainerMobile/index'

function AcceptModal() {
  const { currentLangData } = useContext(LangContext)
  const { modal, currency, events } = useStores()
  const data = modal.currentData
  const isMobile = window.innerWidth < 768
  const [canClick, setCanClick] = useState(true)
  
  const [password, setPassword] = useState('')
  
  let rate_from, rate_to, rate
  
  if(User.symbol == 'LNX'){
	  rate_from = currency.withUSD(data.rate_from / 100000000)
  } else if(User.symbol == 'TLOS'){
	  rate_from = currency.withUSD(data.rate_from / 10000)
  } else {
	  rate_from = currency.withUSD(data.rate_from / 10000)
  }
  const [bet, setBet] = useState(() => rate_from)
  const [localLoading, setLocalLoading] = useState(false)
  if(User.symbol == 'LNX'){
	  rate_to = currency.withUSD(data.rate_to / 100000000)
  } else if(User.symbol == 'TLOS'){
	  rate_to = currency.withUSD(data.rate_to / 10000)
  } else {
	  rate_to = currency.withUSD(data.rate_to / 10000)
  }
  
  const onChangeBet = event => {
    setBet(event.target.value)
  }
  
  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const closeModal = () => {
    modal.close('accept')
  }

  const participate = () => {
	setCanClick(false)
	User.checkParticipation()
    events.participate(data, bet, password).finally(() => {
		User.checkParticipation()
    })
  }
  
  if(User.symbol == 'LNX'){
	rate = (data.rate / 100000000).toFixed(2)
  } else  if(User.symbol == 'TLOS'){
	rate = data.rate / 10000
  } else {
	rate = data.rate / 10000
  }
  
  let maxPosibleWin = data.lobby_sponsored == 0 ? ((bet * (100 - currency.commission)) / 100).toFixed(2) : ((rate * (100 - currency.commission)) / 100).toFixed(2)
  
  const isBetValid =
    Number(bet) <= Number(rate_to) && Number(bet) >= Number(rate_from)
	
	const closest = (el, predicate) => {
	  do if (predicate(el)) return el;
	  while (el = el && el.parentNode);
	}
	
  const [dinamicStyle, setDinamicStyle] = useState({})
	let thisModal, changingElement, changingElementHeight, headHeight, bodyHeight, posWinHeight, calulatedHeight, windowHeight, styleOfChangingElement
	
	setTimeout(function(){
		windowHeight = window.outerHeight
		changingElement = document.getElementsByClassName(`${styles.dynamicStyle}`)[0]
		if(changingElement){
			if(changingElement.parentNode){
				if(changingElement.parentNode.parentNode){
					thisModal = changingElement.parentNode.parentNode
				}
			}
		}
		
		
		if(thisModal){
			headHeight = thisModal.childNodes[0].clientHeight
			bodyHeight = thisModal.childNodes[1].clientHeight
			
			if( (headHeight + bodyHeight) < windowHeight) {
				
				changingElementHeight = changingElement.clientHeight
				calulatedHeight = (windowHeight - (headHeight + bodyHeight)) / 2
				
				styleOfChangingElement = changingElement.currentStyle || window.getComputedStyle(changingElement);

				if(!dinamicStyle.marginTop){
					setDinamicStyle( {
						marginTop: parseFloat(styleOfChangingElement.marginTop) + calulatedHeight - 1 + 'px',
						marginBottom: parseFloat(styleOfChangingElement.marginBottom) + calulatedHeight + 'px',
					})
				}
				
			}
		}
	}, 100);
	
	const widthOfInput = currency.withUSD(rate).length * 10
	let styledInput
	if(widthOfInput > 40){
		styledInput = widthOfInput + 'px'
	} else {
		styledInput = '40px'
	}
	
  return (
    <Modal visible={modal.visible.accept} onBackgroundPress={closeModal} style={data.lobby_sponsored ? { minWidth: 676 } : {}}>
	  {!isMobile && (
		<div>
		  <Head>
			{data.lobby_sponsored ?  data.mode + ' ' + currentLangData.sponsorshipModalAccept : currentLangData.enterYourRate }
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  </Head>
		  <Body>
			{data.lobby_private != 0 && (
			  <div className={`${styles.rate} ${styles.participatePassword}`}>
				<div>{currentLangData.enterThePassword}</div>
				<div className={styles.descSub}>
				  {currentLangData.closedLobbyPassword}
				  <br />
				  {currentLangData.closedLobbyPassword2}
				</div>
				<div className={styles.participatePasswordInput}>
				  <span>{currentLangData.password}</span>
				  <input
					type="text"
					defaultValue={password}
					maxLength={6}
					onChange={onChangePassword}
				  />
				</div>
			  </div>
			)}
			<div style={!data.lobby_sponsored ? { display: 'none' } : {}}>
			{data.lobby_sponsored && (
				<Rate
				  rate={currency.withUSD(rate)}
				  mode={data.mode}
				  sponsored={data.lobby_sponsored}
				  className={styles.participateRate}>
				  <div className={styles.rateForm}>
					<div className={styles.rateFormContent}>
					  <input disabled defaultValue={currency.withUSD(rate)} style={{width: styledInput}}/>
					  <span>{currency.curr}</span>
					</div>
				  </div>
				</Rate>
			)}
			</div>
			{!data.lobby_sponsored && (
				<div className={styles.selectsRow}>
				  <div>
					<div className={styles.inputTitle}>{currentLangData.formYourRate}</div>
					<div className={styles.inputGroup}>
					  <input
						type="text"
						onChange={onChangeBet}
						defaultValue={rate_from}
						id="your-bet"
					  />
					  <div className={styles.inputSub}>{currency.curr}</div>
					</div>
				  </div>
				</div>
			)}
			{!data.lobby_sponsored && (
				<div className={styles.rate}>
				  {`${rate_from} - ${rate_to} ${currency.curr}`}
				</div>
			)}
			
			{isBetValid ? (
			  <div className={styles.blockCenter}>
				<NewIconButton 
					title={currentLangData.participate}
					img="/img/buttonIcons/plus.png"
					onClick={canClick ? participate : null}
				/>
			  </div>
			) : (
			  <Fragment>
				<div className={styles.blockCenter}>
				  <Button title={currentLangData.participate} disabled />
				</div>

				<div className={`${styles.desc} ${styles.descErr}`}>
					{currentLangData.betMistake}
				</div>
			  </Fragment>
			)}
			<div className={styles.descSub}>
			  {data.lobby_sponsored ? (
				<Fragment>
				  {currentLangData.sponsorshipModeModalText}
				  <br /> {currentLangData.sponsorshipModeModalSubText}
				</Fragment>
			  ) : (
				<Fragment>
				  {currentLangData.acceptSubMessage1} <br />
				  {currentLangData.acceptSubMessage2} <br />
				  {currentLangData.acceptSubMessage3}
				</Fragment>
			  )}
			</div>
		  </Body>
		</div>
	  )}
	  
	  {isMobile && (
		<div className={`${styles.createModalOnMobile} ${styles.otherBigModal}`}>
		  <Head>
			{data.lobby_sponsored ?  data.mode + ' ' + currentLangData.sponsorshipModalAccept : currentLangData.enterYourRate }
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
		  </Head>
		  <Body>
			{data.lobby_private != 0 && (
			  <div className={`${styles.rate} ${styles.participatePassword}`}>
				<div>{currentLangData.enterThePassword}</div>
				<div className={styles.descSub}>
				  {currentLangData.closedLobbyPassword}
				  <br />
				  {currentLangData.closedLobbyPassword2}
				</div>
				<div className={styles.participatePasswordInput}>
				  <input
					type="text"
					placeholder={currentLangData.typePassword}
					defaultValue={password}
					maxLength={6}
					onChange={onChangePassword}
				  />
				</div>
			  </div>
			)}
			<div style={!data.lobby_sponsored ? { display: 'none' } : {}}>
			{data.lobby_sponsored && (
				<RateMobile
				  rate={currency.withUSD(rate)}
				  mode={data.mode}
				  sponsored={data.lobby_sponsored}
				  className={styles.participateRate}>
				  <div className={styles.rateForm}>
					<div className={styles.rateFormContent}>
					  <input disabled defaultValue={currency.withUSD(rate)} />
					  <span>{currency.curr}</span>
					</div>
				  </div>
				</RateMobile>
			)}
			</div>
			{!data.lobby_sponsored && (
				<div className={`${styles.selectsRow} ${styles.fixSelectsRowMobile}`}>
				  <div>
					<div className={styles.inputTitle}>{currentLangData.formYourRate}</div>
					<div className={styles.inputGroup}>
					  <input
						type="text"
						onChange={onChangeBet}
						defaultValue={rate_from}
						id="your-bet"
					  />
					  <div className={styles.inputSub}>{currency.curr}</div>
					</div>
				  </div>
				</div>
			)}
			{!data.lobby_sponsored && (
				<div className={styles.rate}>
				  {`${rate_from} - ${rate_to} ${currency.curr}`}
				</div>
			)}

			<div className={`${styles.descSub} ${styles.dynamicStyle} ${data.lobby_private !== 0 && data.lobby_private !== "0" ? styles.moveTextBlock : styles.unmoveTextBlock}`} style={dinamicStyle}>
			  {data.lobby_sponsored ? (
				<Fragment>
				  {currentLangData.sponsorshipModeModalText}
				  <br /> {currentLangData.sponsorshipModeModalSubText}
				</Fragment>
			  ) : (
				<Fragment>
				  {currentLangData.acceptSubMessage1} <br />
				  {currentLangData.acceptSubMessage2} <br />
				  {currentLangData.acceptSubMessage3}
				</Fragment>
			  )}
			</div>
			
			<div className={styles.blockOfEsse}>
						<div className={styles.itogy}>
							<div className={styles.maxWinText}>
								{currentLangData.maximumPossibleWin}
							</div>
							<div className={styles.currencyWinner}>
								{maxPosibleWin}
								<span>{currency.curr}</span>
							</div>
							<div className={styles.forTakeCom}>
								{currentLangData.takingCommission}
							</div>
						</div>
					<div className={styles.itogysubmitButton}>
						{isBetValid ? (
						  <div className={styles.blockCenter}>
							<LoadingButton
							  title={currentLangData.participate}
							  loading={localLoading}
							  onClick={canClick ? participate : null}
							/>
						  </div>
						) : (
						  <Fragment>
							<div className={styles.blockCenter}>
							  <Button title={currentLangData.participate} disabled />
							</div>

							<div className={`${styles.desc} ${styles.descErr}`}>
								{currentLangData.betMistake}
							</div>
						  </Fragment>
						)}
					</div>
					
				</div>
		  </Body>
		</div>
	  )}
	  
    </Modal>
  )
}

export default observer(AcceptModal)
