import React, { useContext, useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { CreateEventButton, Loader, Switch, Avatar, IconButton } from '../../ui/index'
import styles from './header.module.css'
import { useStores, useModal } from '../../utils/hooks'
import { observer } from 'mobx-react'
import LangSwitch from '../../components/Lang/LangSwitch'
import LangContext from '../../components/Lang/context/LangContext';
import { WombatModal, WombatExistModal } from '../../components/Modals/index'
import history from '../../history'

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function Header() {	

  const { user, currency, modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const [hamburgerState, setHamburgerState] = useState('')
  const wombatModal = useModal()
  const wombatExistModal = useModal()
  
  user.checkParticipation()
  
  const isGuest = user.isGuest
  
  const logout = () => {
	if(!isGuest){
		user.logout()
	} else {
		modal.open('loginPageLoadModal')
		
		  user
		  .allLogin('TLOS', 'wombatAccount', '')
		  .then(() => {
			user.init().then(() => {
				modal.close('loginPageLoadModal')
				location.reload()
			})
		  })
		  .catch((err) => {
			  modal.close('loginPageLoadModal')
			  console.log(err)
			  if(err == 'wombat found, but not TLOS chain'){
				  wombatExistModal.open()
			  } else {
				wombatModal.open()
			  }
		  })
  
	}
  }

  const openCreateEventModal = () => {
	modal.openCreateEvent()
  }
  
  const openPandasBotModal = () => {
	  user.checkParticipation()
	  modal.open('pandasBotModal')
  }
  const openSteam = () => {
	  user.checkParticipation()
	  modal.open('steam')
  }
  
  const isExistSteam = getParameterByName('existSteam', window.location) ? true : false
  
  if(isExistSteam){
	  if(!localStorage.getItem('showExistSteamModal')){
		  localStorage.setItem('showExistSteamModal',0)
		  modal.open('existSteamModal')
	  }
  }
  
  const goToProfile = () => {
	  history.push('/profile')
  }
  
  const openPanda = () => {
	const newTabBrowser = window.open('https://telegram.im/@PandasPaymentBot', '_blank');
	newTabBrowser.focus();
  }
  
  const hamburger = () => {
	 
	  if(hamburgerState == ''){
		setHamburgerState(styles.active)
		document.body.style.overflow = 'hidden'
		setTimeout(function(){
			setHamburgerState(`${styles.active} ${styles.overflowActive}`)
		},600)
	  } else {
		setHamburgerState('')
		document.body.removeAttribute("style"); 
	  }
  }
  let headerTotle = currentLangData.eventsMenu
  let title = currentLangData.eventsMenu + ' | FARM.GAME'
	  if(location.pathname == '/'){
		  title = currentLangData.eventsMenu + ' | FARM.GAME'
		  headerTotle = currentLangData.eventsMenu
		  document.title = title
	  }
	  if(location.pathname.split('/profile').length > 1){
		  title = currentLangData.profileMenu + ' | FARM.GAME'
		  headerTotle = currentLangData.profileMenu
		  document.title = title
	  }
	  if(location.pathname == '/create-event'){
		  title = currentLangData.createEventMenu + ' | FARM.GAME'
		  headerTotle = currentLangData.createEventMenu
		  document.title = title
	  }
	
	const guestClick = () => {
		modal.open('loginPageModal')
	}
 
  return (
	<div>
	<div className={styles.headerheader}></div>
    <header className={`${styles.header} ${hamburgerState}`}>
	  <div className={styles.flexOnMobile}>
		  <div><Link className={styles.logo} to="/">
			<img src="/img/logo.svg" alt="logo" className={styles.desktopHeaderLogo} />
			<img src="/img/logo.svg" alt="logo" className={styles.mobileHeaderLogo} />
		  </Link></div>
		  <div className={styles.headerPageTitle}>
			  {headerTotle}
		  </div>
		  <div className={`${styles.hamburger} ${hamburgerState}`} onClick={hamburger}>
			<span></span>
			<span></span>
			<span></span>
		  </div>
	  </div>
      <nav className={`${styles.nav} ${styles.navDesktop}`}>
        <NavLink
          exact
          activeClassName={styles.navItemActive}
          className={styles.navItem}
          to="/">
			<div className={styles.headNewTabIcon}>
				<svg width="33" height="18" viewBox="0 0 33 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" clipRule="evenodd" d="M13.6683 0.857143C13.6683 0.383756 14.0526 0 14.5268 0H17.9218C18.396 0 18.7804 0.383756 18.7804 0.857143V2.32671H21.5211C21.5324 2.32648 21.5437 2.32648 21.555 2.32671H24.756C24.7666 2.32671 24.7773 2.3269 24.7879 2.3273C26.0859 2.37561 28.013 2.81025 29.64 3.98256C31.3071 5.18382 32.625 7.1412 32.625 10.0981C32.625 13.05 31.3131 15.057 29.6548 16.3016C28.0336 17.5184 26.0962 18 24.756 18C22.8318 18 19.7935 17.0886 18.0456 14.3037H14.5794C12.8315 17.0886 9.79316 18 7.86904 18C7.03705 18 5.99623 17.8155 4.95168 17.4027C4.5108 17.2285 4.29486 16.7304 4.46938 16.2902C4.64389 15.8501 5.14277 15.6345 5.58365 15.8087C6.44216 16.148 7.26913 16.2857 7.86904 16.2857C9.46004 16.2857 12.0221 15.4682 13.3297 13.0406C13.4794 12.7627 13.7699 12.5894 14.0859 12.5894H18.5391C18.8551 12.5894 19.1456 12.7627 19.2953 13.0406C20.6029 15.4682 23.165 16.2857 24.756 16.2857C25.7563 16.2857 27.3241 15.9063 28.623 14.9314C29.8848 13.9843 30.9079 12.4689 30.9079 10.0981C30.9079 7.73237 29.8889 6.27609 28.6351 5.37263C27.3474 4.44481 25.7783 4.08263 24.7394 4.04099H22.0513L20.7068 6.54577C20.5573 6.82424 20.2665 6.99804 19.95 6.99804H17.4368C16.9627 6.99804 16.5783 6.61428 16.5783 6.1409C16.5783 5.66751 16.9627 5.28375 17.4368 5.28375H19.4361L20.1031 4.04099H12.3896L13.0567 5.28375H15.0559C15.5301 5.28375 15.9145 5.66751 15.9145 6.1409C15.9145 6.61428 15.5301 6.99804 15.0559 6.99804H12.5427C12.2262 6.99804 11.9354 6.82424 11.786 6.54577L10.4415 4.04099H7.88564C6.84666 4.08263 5.2776 4.44481 3.98993 5.37263C2.73607 6.27609 1.71711 7.73237 1.71711 10.0981C1.71711 11.8989 2.30647 13.1922 3.11986 14.1179C3.43255 14.4738 3.39707 15.0154 3.04062 15.3275C2.68417 15.6397 2.14172 15.6043 1.82903 15.2484C0.737852 14.0066 0 12.3103 0 10.0981C0 7.1412 1.31787 5.18382 2.98504 3.98256C4.61204 2.81025 6.53906 2.37561 7.83706 2.3273C7.84772 2.3269 7.85838 2.32671 7.86904 2.32671H10.9377C10.949 2.32648 10.9603 2.32648 10.9716 2.32671H13.6683V0.857143ZM15.3854 2.32671H17.0633V1.71429H15.3854V2.32671ZM5.90821 6.92365C5.90821 6.45026 6.2926 6.0665 6.76677 6.0665H8.92723C9.4014 6.0665 9.78579 6.45026 9.78579 6.92365V8.15383H11.0436C11.5178 8.15383 11.9022 8.53759 11.9022 9.01097V11.1418C11.9022 11.6152 11.5178 11.9989 11.0436 11.9989H9.78579V13.2291C9.78579 13.7025 9.4014 14.0863 8.92723 14.0863H6.76677C6.2926 14.0863 5.90821 13.7025 5.90821 13.2291V11.9989H4.65039C4.17623 11.9989 3.79184 11.6152 3.79184 11.1418V9.01097C3.79184 8.53759 4.17623 8.15383 4.65039 8.15383H5.90821V6.92365ZM7.62532 7.78079V9.01097L6.76677 9.86812H5.50894V10.2846H6.76677L7.62532 11.1418V12.372H8.06868V11.1418L8.92723 10.2846H10.1851V9.86812H8.92723L8.06868 9.01097V7.78079H7.62532ZM26.3432 7.78079C26.0283 7.78079 25.7909 8.02986 25.7909 8.3152C25.7909 8.60053 26.0283 8.8496 26.3432 8.8496C26.6582 8.8496 26.8956 8.60053 26.8956 8.3152C26.8956 8.02986 26.6582 7.78079 26.3432 7.78079ZM24.0738 8.3152C24.0738 7.06347 25.0997 6.0665 26.3432 6.0665C27.5867 6.0665 28.6127 7.06347 28.6127 8.3152C28.6127 9.56693 27.5867 10.5639 26.3432 10.5639C25.0997 10.5639 24.0738 9.56693 24.0738 8.3152ZM23.2569 11.4336C22.9419 11.4336 22.7045 11.6827 22.7045 11.968C22.7045 12.2534 22.9419 12.5024 23.2569 12.5024C23.5718 12.5024 23.8092 12.2534 23.8092 11.968C23.8092 11.6827 23.5718 11.4336 23.2569 11.4336ZM20.9874 11.968C20.9874 10.7163 22.0133 9.71933 23.2569 9.71933C24.5004 9.71933 25.5263 10.7163 25.5263 11.968C25.5263 13.2198 24.5004 14.2167 23.2569 14.2167C22.0133 14.2167 20.9874 13.2198 20.9874 11.968Z" fill="#7CA59E"/>
				</svg>
			</div>
			<div className={styles.headNewTabText}>
				{currentLangData.eventsMenu}
			</div>
        </NavLink>
        
		{isGuest ? (
			<div className={styles.navItem} onClick={guestClick}>
				<div className={styles.headNewTabIcon}>
					<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.7159 8.18182H10.4432V4.90909H8.80682V8.18182H5.53409V9.81818H8.80682V13.0909H10.4432V9.81818H13.7159V8.18182Z" fill="#7CA59E"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M9.625 18C4.65444 18 0.625 13.9706 0.625 9C0.625 4.02944 4.65444 0 9.625 0C14.5956 0 18.625 4.02944 18.625 9C18.625 13.9706 14.5956 18 9.625 18ZM9.625 16.3636C13.6918 16.3636 16.9886 13.0668 16.9886 9C16.9886 4.93318 13.6918 1.63636 9.625 1.63636C5.55818 1.63636 2.26136 4.93318 2.26136 9C2.26136 13.0668 5.55818 16.3636 9.625 16.3636Z" fill="#7CA59E"/>
					</svg>
				</div>
				<div className={styles.headNewTabText}>
					{currentLangData.createEventMenu}
				</div>
			</div>
		) : (
			<div className={styles.navItem} onClick={openCreateEventModal}>
				<div className={styles.headNewTabIcon}>
					<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.7159 8.18182H10.4432V4.90909H8.80682V8.18182H5.53409V9.81818H8.80682V13.0909H10.4432V9.81818H13.7159V8.18182Z" fill="#7CA59E"/>
						<path fillRule="evenodd" clipRule="evenodd" d="M9.625 18C4.65444 18 0.625 13.9706 0.625 9C0.625 4.02944 4.65444 0 9.625 0C14.5956 0 18.625 4.02944 18.625 9C18.625 13.9706 14.5956 18 9.625 18ZM9.625 16.3636C13.6918 16.3636 16.9886 13.0668 16.9886 9C16.9886 4.93318 13.6918 1.63636 9.625 1.63636C5.55818 1.63636 2.26136 4.93318 2.26136 9C2.26136 13.0668 5.55818 16.3636 9.625 16.3636Z" fill="#7CA59E"/>
					</svg>
				</div>
				<div className={styles.headNewTabText}>
					{currentLangData.createEventMenu}
				</div>
			</div>
		)}
        
      </nav>

	  <nav className={`${styles.nav} ${styles.navMobile}`}>
		<div className={styles.logoAndAge}>
			<NavLink
			  exact
			  activeClassName={`${styles.navItemActive} $styles.navItemLogo`}
			  className={`${styles.navItem} ${styles.navItemLogo}`}
			  to="/">
			  <img src="/img/logo-footer.svg" alt="logo" />
			</NavLink>
			<span className={styles.sixteen}>
				16+
			</span>
		</div>
		{!isGuest && (
		<div className={styles.balance}>
          <div className={styles.balanceTitle}>{currentLangData.yourBalance}</div>
          <div className={styles.balanceInfo}>
            <span className={styles.balanceCount}>
              {currency.chosenSymbol == 'LNX' && (
				currency.withUSD(currency.valueLNX)
			  )}
			  {currency.chosenSymbol == 'EOS' && (
				currency.withUSD(currency.valueEOS)
			  )}
			  {currency.chosenSymbol == 'TLOS' && (
				currency.withUSD(currency.valueEOS)
			  )}
            </span>
            <span>{currency.curr}</span>
          </div>
        </div>
		)}

		<div className={styles.copyright}>
			{(new Date().getFullYear())} © farm.game
		</div>
		<div className={styles.headerLangugages}>
			<div className={styles.lang}>
				<LangSwitch />
			</div>
		</div>
      </nav>
	  
	  {!isGuest && (
      <div className={`${styles.fg1} ${styles.switcherWholeBlock}`}>
		<div className={styles.forDollars}>
			<span>{currency.getUSD(currency.valueEOS)}</span> USD
		</div>
		<div className={styles.forCrypto}>
			<span>{currency.withUSD(currency.valueEOS)}</span> TLOS
		</div>
      </div>
	  )}
	  
	  {!isGuest && user && user.steam && user.steam.avatarUrl && (
	  <div className={`${styles.fg1} ${styles.profileHeaderView}`}>
		<div className={styles.profileOut} onClick={goToProfile}>
			<div className={styles.profilePodlozka}>
				<div className={styles.profilePicture}>
					<img src={user.steam.avatarUrl} />
				</div>
				<div className={styles.profileName}>
					{user.name}
				</div>
				<div className={styles.isOnliner}>
					<div className={user.isProgramOn ? styles.online : styles.offline}>
					</div>
				</div>
			</div>
		</div>
      </div>
	  )}
	  
      <div className={styles.logout} onClick={logout}>
		<div className={styles.headerTabIcon}>
			{isGuest ? (
				<svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.79956e-08 6.72222L8.2968 6.72222L5.71593 4.16108L6.82435 3.06114L11.2974 7.5L6.82435 11.9389L5.71593 10.8389L8.2968 8.27778H0L6.79956e-08 6.72222Z" fill="#94B4C4"/>
					<path d="M12.5238 14.5H14.1905C15.4604 12.0593 18 7.24434 18 7.5106V7.4894C18 7.75566 15.4604 2.94073 14.1905 0.5H12.5238C13.7937 2.94073 16.3333 7.75566 16.3333 7.4894V7.5106C16.3333 7.24434 13.7937 12.0593 12.5238 14.5Z" fill="#94B4C4"/>
					<path d="M8 0.5H13.4762V2H8V0.5Z" fill="#94B4C4"/>
					<path d="M8 13H13.4762V14.5H8V13Z" fill="#94B4C4"/>
				</svg>

			) : (
				<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M11.2974 6.72222L3.0006 6.72222L5.58146 4.16108L4.47305 3.06114L0 7.5L4.47305 11.9389L5.58146 10.8389L3.0006 8.27778L11.2974 8.27778V6.72222Z" fill="#94B4C4"/>
					<path d="M11.5238 14.5H13.1905C14.4604 12.0593 17 7.24434 17 7.5106V7.4894C17 7.75566 14.4604 2.94073 13.1905 0.5H11.5238C12.7937 2.94073 15.3333 7.75566 15.3333 7.4894V7.5106C15.3333 7.24434 12.7937 12.0593 11.5238 14.5Z" fill="#94B4C4"/>
					<path d="M7 0.5H12.4762V2H7V0.5Z" fill="#94B4C4"/>
					<path d="M7 13H12.4762V14.5H7V13Z" fill="#94B4C4"/>
				</svg>

			)}
		</div>
		<div className={styles.headerTabText}>
			{isGuest ? currentLangData.logInModaltitle : currentLangData.loginOut}
		</div>
      </div>
    </header>
	<WombatModal
        visible={wombatModal.visible}
        closeModal={wombatModal.close}
    />
	<WombatExistModal
        visible={wombatExistModal.visible}
        closeModal={wombatExistModal.close}
    />
	</div>
  )
}

export default observer(Header)
