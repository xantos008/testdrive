import React, { useState, Fragment, useContext } from 'react'
import styles from './style.module.css'
import { useStores, useUpdate } from '../../utils/hooks'
import { observer } from 'mobx-react'
import User from '../../store/user'
import {
  Dropdown,
  CreateEventButtonLoading,
  Checkbox,
  CheckboxMobile,
  Button
} from '../../ui/index'
import Rate from '../Rate/index'
import RateContainer from '../Rate/RateContainer'
import SponsorshipContainer from '../SponsorshipContainer/index'

import RateMobile from '../RateMobile/index'
import RateContainerMobile from '../RateMobile/RateContainerMobile'
import SponsorshipContainerMobile from '../SponsorshipContainerMobile/index'

import history from '../../history'

import { serverList } from '../../config'
const localServerList = [
  {
    title: 'Local',
    value: 0,
	group: 'EUROPE'
  },
]
import LangContext from '../../components/Lang/context/LangContext'

const modeList = ['1 vs 1 Mid', '5 vs 5']
const modeListCsgo = ['1 vs 1', '5 vs 5']
const modeListOfften = ['1 vs 1']
const disciplineList = [
	<img className={styles.dotaMore} src="/img/dota.png" alt="Dota 2" />,
	<img className={styles.selfPic} src="/img/battleship-icon-new.png" alt="Battleship" />,
	<img className={styles.selfPic} src="/img/rock-paper-scissors-icon-5-new.png" alt="Rock Paper Scissors" />
	//<img className={styles.dota} src="/img/csgo.png" alt="CS:GO" />
]

export const ChoiceSideCsgo = ({value, setValue}) => {
	const chooseCtSide = () => {
		setValue('CT-side')
	}
	
	const chooseTSide = () => {
		setValue('T-side')
	}
	
	return (
    <div id="ccss" className={styles.side}>
      <div
        onClick={chooseCtSide}
        className={`${styles.sideButton} ${
          value === 'CT-side' ? styles.sideActive : ''
        }`}>
        CT-side
      </div>
      <span className={styles.sideText}>or</span>
      <div
        onClick={chooseTSide}
        className={`${styles.sideButton} ${
          value === 'T-side' ? styles.sideActive : ''
        }`}>
        T-side
      </div>
    </div>
  )
  
}

export const ChoiceSideDota2 = ({ value, setValue }) => {
  const { currentLangData } = useContext(LangContext)
  const chooseDire = () => {
    setValue('Dire')
  }
  const chooseRadiant = () => {
    setValue('Radiant')
  }

  return (
    <div className={styles.side}>
      <div
        onClick={chooseDire}
        className={`${styles.sideButton} ${
          value === 'Dire' ? styles.sideActive : ''
        }`}>
        Dire
      </div>
      <span className={styles.sideText}>{currentLangData.or}</span>
      <div
        onClick={chooseRadiant}
        className={`${styles.sideButton} ${
          value === 'Radiant' ? styles.sideActive : ''
        }`}>
        Radiant
      </div>
    </div>
  )
}

const LobbyPassword = ({ value, setValue, active, setActive }) => {
  const { currentLangData } = useContext(LangContext)
  const toggleActive = () => {
    setActive(val => !val)
  }
  const changePassword = e => {
    setValue(e.target.value)
  }

  return (
    <div className={styles.password}>
      <div
        className={`${styles.passwordToggle} ${
          active ? styles.passwordToggleActive : ''
        }`}
        onClick={toggleActive}>
        <i className={`icon ion-md-${active ? '' : 'un'}lock`} />
      </div>
      <div className={styles.passwordInput}>
        <span>{currentLangData.password}</span>
        <input
          placeholder={currentLangData.typeDots}
          disabled={!active}
          maxLength={6}
          type="text"
          defaultValue={value}
          onChange={changePassword}
        />
      </div>
    </div>
  )
}

const LobbyPasswordMobile = ({ value, setValue, active, setActive }) => {
  const { currentLangData } = useContext(LangContext)
  const [activePasswordField, setActivePasswordField] = useState(false)
  const toggleActive = () => {
    setActive(val => !val)
	if(activePasswordField){
		setActivePasswordField(false)
	} else {
		setActivePasswordField(true)
	}
	console.log(activePasswordField)
  }
  const changePassword = e => {
    setValue(e.target.value)
  }
  
  

  return (
    <div className={styles.password}>
      <div
        className={`${styles.passwordToggle} ${
          activePasswordField ? styles.passwordToggleActive : ''
        }`}
        >
		<label className={styles.mobilePasswordSwitcher} >
		  <input type="checkbox" onChange={toggleActive} />
		  <span className={`${styles.sliderPassword} ${styles.sliderRoundPassword}`}></span>
		</label>
		<span className={styles.typeOfLobby}>{activePasswordField ? currentLangData.private : currentLangData.public}</span>
      </div>
      <div className={styles.passwordInput}>
        <input
          placeholder={currentLangData.typePassword}
          disabled={!activePasswordField}
          maxLength={6}
          type="text"
          defaultValue={value}
          onChange={changePassword}
        />
      </div>
    </div>
  )
}

// todo исправить костыль с img + dropdown
function CreateEvent() {
  const isGuest = User.isGuest
  const { currentLangData } = useContext(LangContext)
  const { modal, currency, events } = useStores()
  if(isGuest){
	  history.push('/')
	  modal.open('loginPageModal')
  }
  const [discipline, setDiscipline] = useState(<img className={styles.dota} src="/img/dota.png" alt="Dota 2" />)
  const [mode, setMode] = useState('1 vs 1 Mid')
  const [server, setServer] = useState(serverList[0])
  const [side, setSide] = useState('Dire')
  const [sideCsgo, setSideCsgo] = useState('CT-side')
  const [localLoading, setLocalLoading] = useState(false)
  const [rateFrom, setRateFrom] = useState(1)
  const [rateTo, setRateTo] = useState(5)
  const [rate, setRate] = useState(10)
  const [eventName, setEventName] = useState(User.steam.username)
  const [password, setPassword] = useState('')
  const [isPasswordActive, setIsPasswordActive] = useState(false)
  const [isSponsorship, setIsSponsorship] = useState(false)
  const is5vs5 = mode === '5 vs 5'
  const isBetValid = is5vs5 || Number(rateTo) > Number(rateFrom) || isSponsorship
  const isMobile = window.innerWidth < 768
  const multiAbove = isSponsorship ? 1 : 2
  useUpdate()
  
  const maxPosibleWin = is5vs5 ? ((rate * multiAbove * (100 - currency.commission)) / 100).toFixed(2) : ((rateTo * multiAbove * (100 - currency.commission)) / 100).toFixed(2)

  //console.log(eventName)

  User.checkParticipation()
  
  const onChangeRate = event => {
    setRate(event.target.value)
  }
  const toggleIsSponsorship = () => {
    setIsSponsorship(val => !val)
  }
  const onChangeRateTo = event => {
    setRateTo(event.target.value)
  }
  const onChangeRateFrom = event => {
    setRateFrom(event.target.value)
  }
  const changeEventName = event => {
	  setEventName(event.target.value)
  }

  const closeModal = () => {
    modal.close('createEvent')
  }
  
  const createEvent = async () => {
	User.checkParticipation()
	if(User.canParticipate){
		setLocalLoading(true)
		try {
		  if (is5vs5) {
			if(discipline.props.alt == 'Dota 2'){
				await events.createEvent5vs5({
				  discipline: discipline.props.alt,
				  mode: mode,
				  server: server.value,
				  rate: Number(rate),
				  isSponsorship: isSponsorship,
				  eventName: eventName,
				  password: password,
				  isPrivate: isPasswordActive || password.trim() === '',
				  side: side.toLowerCase()
				})
			}
			if(discipline.props.alt == 'CS:GO'){
				await events.createEvent5vs5({
				  discipline: discipline.props.alt,
				  mode: mode,
				  server: server.value,
				  rate: Number(rate),
				  isSponsorship: isSponsorship,
				  eventName: eventName,
				  password: password,
				  isPrivate: isPasswordActive || password.trim() === '',
				  side: sideCsgo.toLowerCase()
				})
			}
		  } else {
			await events.createEvent({
			  discipline: discipline.props.alt,
			  mode: mode,
			  server: server.value,
			  rateTo: Number(rateTo),
			  rateFrom: Number(rateFrom),
			  isSponsorship: isSponsorship,
			  eventName: eventName,
			  password: password,
			  rate: Number(rate)
			})
		  }
		} catch (err) {
			console.log('error ofcreation', err)
		  if (typeof err === 'string') {
			let detais
			if(err == 'Modal Closed.'){
				detais = err
				modal.openError(detais)
			} else {
				detais = JSON.parse(err).error.details[0].message
				modal.openError(detais)
			}
			
			
		  }
		} finally {
		  setLocalLoading(false)
		}
	} else {
		modal.open('cantParticipateModal')
	}
	history.push("/")
  }
  

  return (
    <div className={styles.createEventIdol}	>	
		{isMobile && (
			<div className={styles.createModalOnMobile}>
			  <div className={styles.head}>
				{currentLangData.createEventModalTitle}
				<div className={`${styles.closeIcon} ${styles.topfiftenn}`} onClick={closeModal}><img src="/img/closeWombat.svg" /></div>
			  </div>
			  <div className={styles.body}>
				<div className={styles.selectsRow}>
				  <div className={styles.dropdownGroupSerega}>
					<div className={styles.dropdownTitle}>{currentLangData.discipline}</div>
					<Dropdown list={disciplineList} value={discipline} setValue={setDiscipline}  mobileSerega={true} hideArrow={true} />
				  </div>
				  <div className={styles.dropdownGroupSerega}>
					<div className={styles.dropdownTitle}>{currentLangData.mode}</div>
						{discipline.props.alt == 'Dota 2' && (
							<Dropdown list={modeList} value={mode} setValue={setMode}  mobileSerega={true} hideScroll={true} />
						)}
						{discipline.props.alt == 'CS:GO' && (
							<Dropdown list={modeListCsgo} value={mode} setValue={setMode}  mobileSerega={true} hideScroll={true} />
						)}
						{discipline.props.alt == 'Battleship' && (
							<Dropdown list={modeListOfften} value="1 vs 1" setValue={setMode}  mobileSerega={true} hideScroll={true} />
						)}
						{discipline.props.alt == 'Rock Paper Scissors' && (
							<Dropdown list={modeListOfften} value="1 vs 1" setValue={setMode}  mobileSerega={true} hideScroll={true} />
						)}
				  </div>
				  {discipline.props.alt !== 'Battleship' && discipline.props.alt !== 'Rock Paper Scissors' ? (
				  <div className={styles.dropdownGroupSerega}>
					<div className={styles.dropdownTitle}>{currentLangData.server}</div>
					<Dropdown
					  valueType="obj"
					  list={serverList}
					  value={server}
					  setValue={setServer}
					  mobileSerega={true}
					/>
				  </div>
				  ) : (
				  <div className={styles.dropdownGroupSerega}>
					<div className={styles.dropdownTitle}>{currentLangData.server}</div>
					<Dropdown
					  valueType="obj"
					  list={localServerList}
					  value={localServerList[0]}
					  setValue={setServer}
					  mobileSerega={true}
					/>
				  </div>
				  )}
				</div>
				
				{!isSponsorship && (
					<RateMobile rate={is5vs5 ? rate : rateTo} mode={mode}>
					  <div className={styles.rateForm}>
						{is5vs5 ? (
						  <Fragment>
							<div className={styles.rateFormContent}>
							  <input
								onChange={onChangeRate}
								defaultValue={rate}
								type="text"
								name="rate"
							  />
							  <span className={styles.goba}>{currency.curr}</span>
							</div>
						  </Fragment>
						) : (
						  <Fragment>
							<input
							  onChange={onChangeRateFrom}
							  defaultValue={rateFrom}
							  type="text"
							  name="rate_from"
							/>
							<span>{currentLangData.toBetween}</span>
							<input
							  onChange={onChangeRateTo}
							  type="text"
							  name="rate_to"
							  defaultValue={rateTo}
							/>
							<span className={styles.goba}>{currency.curr}</span>
						  </Fragment>
						)}
					  </div>
					</RateMobile>
				)}
				
			   {is5vs5 && !isSponsorship && discipline.props.alt == 'Dota 2' && (
				  <RateContainerMobile
					left={<ChoiceSideDota2 value={side} setValue={setSide} />}
				  />
				)}
				{is5vs5 && !isSponsorship && discipline.props.alt == 'CS:GO' && (
				  <RateContainerMobile
					left={<ChoiceSideCsgo value={sideCsgo} setValue={setSideCsgo} />}
				  />
				)}
				
				<div className={styles.privOrPubCont}>
					<div className={styles.dropdownTitle}>{currentLangData.publicOrPrivateModal}</div>
					<div className={styles.passSwitcherAndField}>
						<div className={styles.passwordoFieldo}>
							<LobbyPasswordMobile
								value={password}
								setValue={setPassword}
								active={isPasswordActive}
								setActive={setIsPasswordActive}
							  />
						</div>
					</div>
				</div>
				
				{!is5vs5 && isSponsorship && (
				  <SponsorshipContainerMobile
					left={
						<Fragment>
						<div className={styles.rateFormContent}>
						  <input
							onChange={onChangeRate}
							defaultValue={rate}
							type="text"
							name="rate"
						  />
						  <span>{currency.curr}</span>
						</div>
					  </Fragment>
					}
				  />
				)}
				
				{is5vs5 && isSponsorship && (
				  <SponsorshipContainerMobile
					left={
						<Fragment>
						<div className={styles.rateFormContent}>
						  <input
							onChange={onChangeRate}
							defaultValue={rate}
							type="text"
							name="rate"
						  />
						  <span>{currency.curr}</span>
						</div>
					  </Fragment>
					}
				  />
				)}
				

				{isSponsorship && (
					<div className={styles.eventname}>
						<div className={styles.eventnameTitle}>{currentLangData.eventName}</div>
						<div className={styles.eventnameFlex}>
							<input
								onChange={changeEventName}
								type="text"
								name="eventname"
								defaultValue={eventName}
							/>
						</div>
					</div>
				)}
				{discipline.props.alt !== 'Battleship' && discipline.props.alt !== 'Rock Paper Scissors' && (
				<div className={styles.isSponsorshipBlock}>
					<div className={styles.isSponsorshipBlockBigText}>
						{currentLangData.youWantSponsor}
					</div>
					<div className={styles.sponsorSwitcherMa}>	
						<CheckboxMobile
							value={isSponsorship}
							onToggle={toggleIsSponsorship}
							label={currentLangData.sponsorship}
						/>
					</div>

					<div className={styles.dibitedText}>
						{currentLangData.whenCreateEventInfo}
					</div>
					<div className={styles.ifEventCanceledWholeText}>
						{currentLangData.ifEventCanceledText}
						<br />
						{currentLangData.ifEventCanceledSubText}
					</div>
				</div>
				)}
				
				<div className={styles.blockOfEsse}>
					{!isSponsorship && (
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
					)}
					<div className={styles.itogysubmitButton}>
						{isBetValid ? (
						  <div className={styles.blockCenter}>
							<CreateEventButtonLoading
							  onClick={createEvent}
							  loading={localLoading}
							/>
						  </div>
						) : (
						  <Fragment>
							<div className={styles.blockCenter}>
							  <Button title={currentLangData.createEventModalBig} disabled />
							</div>

							<div className={`${styles.desc} ${styles.descErr}`}>
							  {currentLangData.betIsInvalid}
							</div>
						  </Fragment>
						)}
					</div>
					
				</div>

			  </div>
			</div>
		)}
		
		
		
		
		
		
		
		
		
    </div>
  )
}

export default observer(CreateEvent)

