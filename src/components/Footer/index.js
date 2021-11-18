import React, { Fragment, useState, useContext } from 'react'
import { useStores } from '../../utils/hooks'
import styles from './footer.module.css'
import headerStyles from '../Header/header.module.css'
import { Dropdown, IconButtonForFooter } from '../../ui/index'
import { Link as RouteLink } from 'react-router-dom'
import LangSwitch from '../../components/Lang/LangSwitch'
import LangContext from '../../components/Lang/context/LangContext';
import { NavLink } from 'react-router-dom'
import history from '../../history'
        
const servers = ['Europe', 'USA']
function Footer() {
  const [currentServer, setCurrentServer] = useState('Europe')
  const { user, modal } = useStores()  
  const { currentLangData } = useContext(LangContext);
  const smallFooter = localStorage.getItem('smallFooter') ? styles.smallFooter : ''
  const isGuest = user.isGuest
  const Link = ({ title, url }) => {
    return (
      <RouteLink className={styles.navItem} to={url} target={title == currentLangData.footerHelpDesk ? '_blank' : '_self'}>
        {title}
      </RouteLink>
    )
  }

  const NavBarItem = ({ links }) => {
    return (
      <Fragment>
        <nav className={styles.item}>
          {links.map((data, index) => (
            <Link title={data.title} key={index} url={data.url} />
          ))}
        </nav>
      </Fragment>
    )
  }

  const NavBar = ({ items }) => {
    return (
      <Fragment>
        {items.map((links, index) => (
          <NavBarItem links={links} key={index} />
        ))}
      </Fragment>
    )
  }
  
  const items = [
  [
    {
      title: currentLangData.footerHelpDesk,
      url: '//helpdesk.farm.game'
    },
    {
      title: currentLangData.footerAbout,
      url: '/about'
    },
    {
      title: currentLangData.footerPrivacyPolicy,
      url: '/privacy'
    }
  ]
]
  
  const goTo = (goPath) => {
	  
  }
  
  const closeHeaderMenu = () => {
	  let headerElement = document.getElementsByClassName(`${headerStyles.active}`)[0]
	  let headerHamburgerElement = document.getElementsByClassName(`${headerStyles.hamburger}`)[0]
	  if(headerElement){
		  headerElement.classList.remove(`${headerStyles.active}`)
		  headerElement.classList.remove(`${headerStyles.overflowActive}`)
		  
		  headerHamburgerElement.classList.remove(`${headerStyles.active}`)
		  headerHamburgerElement.classList.remove(`${headerStyles.overflowActive}`)

		  document.body.removeAttribute("style")
	  }
  }
  
  const openCreateEventModal = () => {
	user.checkParticipation()
	if(!user.canParticipate){
		modal.open('cantParticipateModal')
		history.push('/')
	} else {
		history.push('/create-event')
	}
  }
  
  const openPandasBotModal = () => {
	  modal.open('pandasBotModal')
  }
  const openSteam = () => {
	  modal.open('steam')
  }
  const openPanda = () => {
	const newTabBrowser = window.open('https://telegram.im/@PandasPaymentBot', '_blank');
	newTabBrowser.focus();
  }
  const onlyMainScreen = location.hostname === "farm.game"
  
  return !onlyMainScreen ? (
	
    <Fragment>
      <footer className={(user.isAuthenticated || isGuest) ? styles.footer : styles.footerOfften}>
	  <div className={styles.footerContainer}>
			<div className={styles.item}>
			  <div className={styles.ageLineLink}>
				  <RouteLink className={styles.logo} to="/">
					<img src="/img/logo-footer.svg" alt="logo" />
				  </RouteLink>
				  <div className={styles.age}>16+</div>
			  </div>
			</div>

			<div className={styles.item}>
			  <div className={`${styles.item} ${styles.inlineItems}`}>
				<div className={styles.credits}>
				  {(new Date().getFullYear())} © farm.game
				</div>
			  </div>
			  <div className={`${styles.item} ${styles.inlineItems}`}>
				  <div className={styles.lang}>
					<LangSwitch />
				  </div>
			  </div>
			</div>
		</div>
      </footer>
	  
	  

	  <footer className={(user.isAuthenticated || isGuest) ? `${styles.footer} ${styles.mobileStyky} ${smallFooter}` : `${styles.footerOfften} ${styles.mobileStyky}`}>
		<div className={styles.mobileFooterContainer}>
			<div className={styles.mobileFooterTab} >
				<NavLink
				  exact
				  activeClassName={styles.mobileNavLinkActive}
				  className={styles.mobileNavLink}
				  to="/"
				  onClick={closeHeaderMenu}
				  >
					<div className={styles.footerTabIcon}>
						<svg width="38" height="21" viewBox="0 0 38 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M15.9201 1C15.9201 0.447715 16.3678 0 16.9201 0H20.8745C21.4268 0 21.8745 0.447715 21.8745 1V2.71449H25.0667C25.0799 2.71423 25.093 2.71423 25.1062 2.71449H28.8345C28.8469 2.71449 28.8594 2.71472 28.8718 2.71518C30.3836 2.77155 32.6281 3.27862 34.5232 4.64632C36.465 6.04779 38 8.3314 38 11.7811C38 15.225 36.472 17.5665 34.5405 19.0186C32.6522 20.4382 30.3956 21 28.8345 21C26.5934 21 23.0545 19.9367 21.0186 16.6876H16.9814C14.9455 19.9367 11.4066 21 9.16548 21C8.19641 21 6.98411 20.7847 5.76748 20.3031C5.25396 20.0999 5.00245 19.5188 5.20571 19.0053C5.40898 18.4918 5.99005 18.2403 6.50356 18.4435C7.50351 18.8393 8.46673 19 9.16548 19C11.0186 19 14.0028 18.0463 15.5258 15.214C15.7002 14.8898 16.0385 14.6876 16.4066 14.6876H21.5934C21.9615 14.6876 22.2998 14.8898 22.4742 15.214C23.9972 18.0463 26.9814 19 28.8345 19C29.9996 19 31.8258 18.5573 33.3387 17.4199C34.8084 16.315 36 14.5471 36 11.7811C36 9.02109 34.8132 7.3221 33.3527 6.26806C31.8529 5.18561 30.0253 4.76307 28.8152 4.71449H25.6842L24.1182 7.63673C23.9441 7.96161 23.6054 8.16438 23.2368 8.16438H20.3096C19.7573 8.16438 19.3096 7.71667 19.3096 7.16438C19.3096 6.6121 19.7573 6.16438 20.3096 6.16438H22.6382L23.4152 4.71449H14.4308L15.2078 6.16438H17.5364C18.0887 6.16438 18.5364 6.6121 18.5364 7.16438C18.5364 7.71667 18.0887 8.16438 17.5364 8.16438H14.6091C14.2405 8.16438 13.9018 7.96161 13.7277 7.63673L12.1617 4.71449H9.1848C7.97465 4.76307 6.14709 5.18561 4.64728 6.26806C3.18684 7.3221 2 9.02109 2 11.7811C2 13.8821 2.68647 15.3909 3.63386 16.4709C3.99807 16.8861 3.95674 17.5179 3.54157 17.8821C3.12639 18.2463 2.49457 18.205 2.13037 17.7898C0.859413 16.341 0 14.362 0 11.7811C0 8.3314 1.53499 6.04779 3.47683 4.64632C5.37188 3.27862 7.61637 2.77155 9.12822 2.71518C9.14064 2.71472 9.15306 2.71449 9.16548 2.71449H12.7397C12.7529 2.71423 12.7661 2.71423 12.7792 2.71449H15.9201V1ZM17.9201 2.71449H19.8745V2H17.9201V2.71449ZM6.8816 8.07759C6.8816 7.5253 7.32931 7.07759 7.8816 7.07759H10.398C10.9503 7.07759 11.398 7.5253 11.398 8.07759V9.5128H12.8631C13.4153 9.5128 13.8631 9.96052 13.8631 10.5128V12.9988C13.8631 13.551 13.4153 13.9988 12.8631 13.9988H11.398V15.434C11.398 15.9863 10.9503 16.434 10.398 16.434H7.8816C7.32931 16.434 6.8816 15.9863 6.8816 15.434V13.9988H5.41655C4.86426 13.9988 4.41655 13.551 4.41655 12.9988V10.5128C4.41655 9.96052 4.86426 9.5128 5.41655 9.5128H6.8816V8.07759ZM8.8816 9.07759V10.5128L7.8816 11.5128H6.41655V11.9988H7.8816L8.8816 12.9988V14.434H9.398V12.9988L10.398 11.9988H11.8631V11.5128H10.398L9.398 10.5128V9.07759H8.8816ZM30.6833 9.07759C30.3165 9.07759 30.0399 9.36817 30.0399 9.70106C30.0399 10.034 30.3165 10.3245 30.6833 10.3245C31.0501 10.3245 31.3267 10.034 31.3267 9.70106C31.3267 9.36817 31.0501 9.07759 30.6833 9.07759ZM28.0399 9.70106C28.0399 8.24071 29.2349 7.07759 30.6833 7.07759C32.1317 7.07759 33.3267 8.24071 33.3267 9.70106C33.3267 11.1614 32.1317 12.3245 30.6833 12.3245C29.2349 12.3245 28.0399 11.1614 28.0399 9.70106ZM27.0884 13.3392C26.7216 13.3392 26.4451 13.6298 26.4451 13.9627C26.4451 14.2956 26.7216 14.5862 27.0884 14.5862C27.4553 14.5862 27.7318 14.2956 27.7318 13.9627C27.7318 13.6298 27.4553 13.3392 27.0884 13.3392ZM24.4451 13.9627C24.4451 12.5023 25.6401 11.3392 27.0884 11.3392C28.5368 11.3392 29.7318 12.5023 29.7318 13.9627C29.7318 15.423 28.5368 16.5862 27.0884 16.5862C25.6401 16.5862 24.4451 15.423 24.4451 13.9627Z" fill="#6AB74F"/></svg>
					</div>
					<div className={styles.footerTabText}>
						{currentLangData.eventsMenu}
					</div>
				</NavLink>
			</div>
			<div className={styles.marginForButton}>
				{user.isSteamLinked ? (
					user.canParticipate ? (
						<div
						  className={styles.navItemNew}
						  onClick={openCreateEventModal}
						  >
						  <IconButtonForFooter />
						</div>
					) : (
						<div
						  className={styles.navItemNew}
						  onClick={openCreateEventModal}
						  >
						  <IconButtonForFooter />
						</div>
					)
				) : (
					<NavLink
					  exact
					  activeClassName={styles.navItemNew}
					  className={styles.navItemNew}
					  onClick={openSteam}
					  to="/"
					  >
					  <IconButtonForFooter />
					</NavLink>
				)}
			</div>
			<div className={styles.mobileFooterTab} >
				<NavLink
				  exact
				  activeClassName={styles.mobileNavLinkActive}
				  className={styles.mobileNavLink}
				  to="/profile"
				  onClick={closeHeaderMenu}
				  >
					<div className={styles.footerTabIcon}>
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 14C8.76086 14 7 12.4274 7 9C7 6.75576 8.5791 5 11 5C13.4142 5 15 6.92158 15 9.2C15 12.4796 13.2181 14 11 14ZM9 9C9 11.2693 9.81821 12 11 12C12.1777 12 13 11.2984 13 9.2C13 7.95042 12.2157 7 11 7C9.73374 7 9 7.81582 9 9Z" fill="#ADCCC7"/><path fillRule="evenodd" clipRule="evenodd" d="M11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22ZM18.3995 16.1246C19.4086 14.6703 20 12.9042 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 12.9042 2.59138 14.6703 3.6005 16.1246C4.72595 14.6381 7.3706 14 11 14C14.6294 14 17.274 14.6381 18.3995 16.1246ZM16.9647 17.7398C16.672 16.6874 14.5694 16 11 16C7.43062 16 5.328 16.6874 5.03532 17.7398C6.6233 19.1462 8.71194 20 11 20C13.2881 20 15.3767 19.1462 16.9647 17.7398Z" fill="#ADCCC7"/></svg>
					</div>
					<div className={styles.footerTabText}>
						{currentLangData.profileMenu}
					</div>
				</NavLink>
			</div>
		</div>
      </footer>
	  
	  
	  
    </Fragment>
  ) : (
	<Fragment>
      <footer className={styles.footer}>
	  <div className={styles.footerContainer}>
			<div className={styles.item}>
			  <div className={styles.ageLineLink}>
				  <RouteLink className={styles.logo} to="/">
					<img src="/img/logo-footer.svg" alt="logo" />
				  </RouteLink>
				  <div className={styles.age}>16+</div>
			  </div>
			</div>

			<div className={styles.item}>
			  <div className={`${styles.item} ${styles.inlineItems}`}>
				<div className={styles.credits}>
				  {(new Date().getFullYear())} © farm.game
				</div>
			  </div>
			  <div className={`${styles.item} ${styles.inlineItems}`}>
				  <div className={styles.lang}>
					<LangSwitch />
				  </div>
			  </div>
			</div>
		</div>
      </footer>  
	  
    </Fragment>
  )
}

export default Footer
