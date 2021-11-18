import React, { useState, Fragment, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import styles from './modal.module.css'
import { useStores } from '../../utils/hooks'
import { observer } from 'mobx-react'
import { LoadingButton, NewIconButton } from '../../ui/index'
import Rate from '../Rate/index'
import { ChoiceSideDota2 } from './CreateEventModal'
import ChoiceSideCsgo from './CreateEventModal'
import LangContext from '../../components/Lang/context/LangContext'

import RateMobile from '../RateMobile/index'
import RateContainerMobile from '../RateMobile/RateContainerMobile'
import SponsorshipContainerMobile from '../SponsorshipContainerMobile/index'

function Participate5vs5Modal() {
  const { currentLangData } = useContext(LangContext)
  const { modal, currency, events } = useStores()
  const [localLoading, setLocalLoading] = useState(false)
  const [password, setPassword] = useState('')
  
  console.log(modal.currentData.pickedSide)
  
  const [side, setSide] = useState(modal.currentData.pickedSide ? modal.currentData.pickedSide : 'Dire')
  const [sideCsgo, setSideCsgo] = useState('CT')
  const isMobile = window.innerWidth < 768
  const [canClick, setCanClick] = useState(true)
  
  
  let chosenSide = side
  
  if(modal.currentData.discipline == 'Dota 2'){
	  chosenSide = side
  }
  if(modal.currentData.discipline == 'CS:GO'){
	  chosenSide = sideCsgo
  }
  
  const data = {
    sponsorship: modal.currentData.lobby_sponsored,
    private: modal.currentData.lobby_private !== '0',
    rate: modal.currentData.price_owner
  }
  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const closeModal = () => {
    modal.close('participate5vs5')
  }
  
  const participate = () => {
	setCanClick(false)
    setLocalLoading(true)
    events
      .participate5vs5(modal.currentData, password, chosenSide.toLowerCase())
      .catch(() => {
        setLocalLoading(false)
      })
  }
  const multiAbove = data.sponsorship ? 1 : 2
  const multiDelete = data.sponsorship ? 5 : 1
  let maxPosibleWin = ((currency.withUSD(data.rate) * multiAbove / multiDelete * (100 - currency.commission)) / 100).toFixed(2)
  const widthOfInput = currency.withUSD(data.rate).length * 10
  let styledInput
  if(widthOfInput > 40){
	  styledInput = widthOfInput + 'px'
  } else {
	  styledInput = '40px'
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
				calulatedHeight = (windowHeight - (headHeight + (bodyHeight - changingElementHeight) ) + 10) / 2
				
				styleOfChangingElement = changingElement.currentStyle || window.getComputedStyle(changingElement);

				if(!dinamicStyle.marginTop){
					setDinamicStyle( {
						marginTop: parseFloat(styleOfChangingElement.marginTop) + calulatedHeight + 'px',
						marginBottom: parseFloat(styleOfChangingElement.marginBottom) + calulatedHeight + 'px',
					})
				}
				
			}
		}
	}, 100);
  
  return (
    <Modal
      visible={modal.visible.participate5vs5}
      onBackgroundPress={closeModal}
      style={{ minWidth: 676 }}>
	  {!isMobile && (
		<div>
		  <Head>
			5 vs 5 {data.sponsorship && currentLangData.sponsorship}{' '}
			{data.private && (
			  <i className={`icon ion-md-lock ${styles.participateLockIcon}`} />
			)}
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeDesktop.png" /></div>
		  </Head>
		  <Body>
			{data.private && (
			  <div className={`${styles.rate} ${styles.participatePassword}`}>
				<div>Enter the Password</div>
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
			<Rate
			  rate={currency.withUSD(data.rate)/5}
			  mode="5 vs 5"
			  sponsored={data.sponsorship}
			  className={styles.participateRate}>
			  <div className={styles.rateForm}>
				<div className={styles.rateFormContent}>
				  <input disabled defaultValue={currency.withUSD(data.rate)} style={{width: styledInput}}/>
				  <span>{currency.curr}</span>
				</div>
			  </div>
			</Rate>
			<div className={styles.blockCenter}>
			  {modal.currentData.discipline == 'Dota 2' && (
				<ChoiceSideDota2 value={side} setValue={setSide} />
			  )}
			  {modal.currentData.discipline == 'CS:GO' && (
				<ChoiceSideCsgo value={sideCsgo} setValue={setSideCsgo} />
			  )}
			</div>

			<div className={`${styles.blockCenter} ${styles.mt20}`}>
			  <NewIconButton 
			    title={currentLangData.participate}
				img="/img/buttonIcons/plus.png"
				onClick={canClick ? participate : null}
			  />
			</div>

			<div className={styles.descSub}>
			  {data.sponsorship ? (
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
		<div className={`${styles.createModalOnMobile} ${styles.otherBigModal} ${styles.calculatedHeight}`}>
		  <Head>
			5 vs 5 {data.sponsorship && currentLangData.sponsorship}{' '}
			{data.private && (
			  <i className={`icon ion-md-lock ${styles.participateLockIcon}`} />
			)}
			<div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
		  </Head>
		  <Body>
			{data.private && (
			  <div className={`${styles.rate} ${styles.participatePassword}`}>
				<div>Enter the Password</div>
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
			<RateMobile
			  rate={currency.withUSD(data.rate)/5}
			  mode="5 vs 5"
			  sponsored={data.sponsorship}
			  className={styles.participateRate}>
			  <div className={styles.rateForm}>
				<div className={styles.rateFormContent}>
				  <input disabled defaultValue={currency.withUSD(data.rate)} />
				  <span>{currency.curr}</span>
				</div>
			  </div>
			</RateMobile>
			<div className={`${styles.blockCenter} ${styles.noflex}`}>
			  <div className={styles.eventnameTitle}>{currentLangData.choiseOfSide}</div>
			  {modal.currentData.discipline == 'Dota 2' && (
				<ChoiceSideDota2 value={side} setValue={setSide} />
			  )}
			  {modal.currentData.discipline == 'CS:GO' && (
				<ChoiceSideCsgo value={sideCsgo} setValue={setSideCsgo} />
			  )}
			</div>

			<div className={`${styles.descSub} ${styles.dynamicStyle}`} style={dinamicStyle}>
			  {data.sponsorship ? (
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
						  <div className={styles.blockCenter}>
							<LoadingButton
							  title={currentLangData.participate}
							  loading={localLoading}
							  onClick={canClick ? participate : null}
							/>
						  </div>
					</div>
					
				</div>
			
		  </Body>
		</div>
	  )}
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
    </Modal>
  )
}

export default observer(Participate5vs5Modal)
