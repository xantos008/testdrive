import React, { Fragment, useContext } from 'react'
import styles from './button.module.css'
import { Loader } from '../../ui/index'
import { useStores } from '../../utils/hooks'
import LangContext from '../../components/Lang/context/LangContext';

function ScatterLoadingButton({ loading, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${styles.btn} ${styles.btnIcon} ${
        loading ? styles.disable : ''
      }`}>
      {title}
      <Loader visible={loading} className={styles.loader} />
      <div className={styles.square}>
        <div className={styles.circle}>
          <img
            className={styles.icon}
            src="/img/icon/scatter.png"
            alt="scatter"
          />
        </div>
      </div>
    </div>
  )
}

function LynxButton({ loading, title, onClick}) {
  return (
    <div
      onClick={onClick}
      className={`${styles.btn} ${styles.btnIcon} ${
        loading ? styles.disable : ''
      }`}>
      {title}
	  <Loader visible={loading} className={styles.loader} />
      <div className={styles.square}>
        <div className={styles.circle}>
          <img
            className={styles.icon}
            src="/img/icon/lynx.png"
            alt="lynx wallet"
          />
        </div>
      </div>
    </div>
  )
}

function ChainButton({ title, onClick, src, isActive}) {
  return (
    <div
      onClick={onClick}
      className={`${styles.chainButton} ${isActive ? styles.activevka : ''}`}>
      {title}
        <div className={`${styles.chainButtonCircle}`}>
          <img
            className={`${styles.chainButtonIcon}`}
            src={src}
            alt="login farm.game"
          />
        </div>
    </div>
  )
}

function AllLoginButton({ loading, title, onClick}) {
  return (
    <div
      onClick={onClick}
      className={`${styles.wombatBtn} ${styles.wombatBtnIcon} ${
        loading ? styles.disable : ''
      }`}>
      {loading ? '' : title}
	  <Loader visible={loading} className={styles.loader} />
      <div className={styles.wombatSquare}>
        <div className={styles.wombatCircle}>
          <img
            className={styles.wombatIcon}
            src="/img/icon/alllogin.svg"
            alt="all wallets crypto login farm.game"
          />
        </div>
      </div>
    </div>
  )
}

function ExtensionButton({ loading, title, onClick}) {
  return (
    <div
      onClick={onClick}
      className={`${styles.SecondWombatBtn} ${styles.SecondWombatBtnIcon} ${
        loading ? styles.disable : ''
      }`}>
      {loading ? '' : title}
	  <Loader visible={loading} className={styles.loader} />
      <div className={styles.SecondWombatSquare}>
        <div className={styles.SecondWombatCircle}>
          <img
            className={styles.SecondWombatIcon}
            src="/img/icon/extensionInstall.svg"
            alt="all wallets crypto login farm.game"
          />
        </div>
      </div>
    </div>
  )
}

function SwitchNetButton({ loading, onClick, locationt, title}){
	return (
		<div
		  onClick={onClick}
		  className={`${styles.btnSwitch} ${loading ? styles.disable : ''}`}>
		  {title}
		  <Loader visible={loading} className={styles.loaderButton} />
		</div>
	  )
}

function LoadingButton({ loading, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${styles.btn} ${loading ? styles.disable : ''}`}>
      {title}
      <Loader visible={loading} className={styles.loaderButton} />
    </div>
  )
}

function CreateEventButtonLoading({ onClick, loading }) {
  const { currentLangData } = useContext(LangContext);
  return (
    <div
      className={`${styles.btn} ${styles.btnIcon} ${
        loading ? styles.disable : ''
      }`}
      onClick={onClick}>
      {currentLangData.createEventModalBig}
      <Loader visible={loading} className={styles.loader} />
      <div className={`${styles.square} ${styles.squareText}`}>+</div>
    </div>
  )
}

// for steam
function SteamConnectModalButton({ onClick }) {
  const { user, modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const linkSteam = () => {
    user.linkSteam().then(() => {
      modal.close('steam')
    })
    // user.isSteamLinked = true
    // modal.close('steam')
  }

  return (
		<div className={styles.shadowBlock}>
			<div className={`${styles.newBtn}`} onClick={linkSteam}>
				<div className={styles.bordered}>
					<div className={styles.backgroundBlock}>
						<div className={styles.textPadBlock}>
							<div className={styles.iconText}>{currentLangData.connectSteamModal}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

function LinkSteamButton({ onClick }) {
  const { user, modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const linkSteam = () => {
      modal.open('steam')
    // user.isSteamLinked = true
    // modal.close('steam')
  }

  return (
		<div className={styles.shadowBlock}>
			<div className={`${styles.newBtn}`} onClick={linkSteam}>
				<div className={styles.bordered}>
					<div className={styles.backgroundBlock}>
						<div className={styles.textPadBlock}>
							<div className={styles.iconText}>{currentLangData.steamLink}</div>
							<div className={`${styles.newSquare} ${styles.newSquareText}`}><img src="/img/buttonIcons/steam.png" /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

function SteamConnected({ onClick }) {
  const { currentLangData } = useContext(LangContext)
  const { modal } = useStores()
  const openSteamModal = () => {
      modal.open('steam')
  }
  return (
		<div className={styles.shadowBlock}>
			<div className={`${styles.newBtn}`} onClick={openSteamModal}>
				<div className={styles.bordered}>
					<div className={styles.backgroundBlock}>
						<div className={styles.textPadBlock}>
							<div className={styles.iconText}>{currentLangData.steamConnected}</div>
							<div className={`${styles.newSquare} ${styles.newSquareText}`}><img src="/img/buttonIcons/steam.png" /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}
function UnlinkSteamButton() {
  const { user, modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const unLinkSteam = () => {
    user.unLinkSteam().then(() => {
		modal.close('steam')
	})
  }

  return (
	<div className={styles.shadowBlock}>
		<div className={`${styles.offtenSimpleButton}`} onClick={unLinkSteam}>
			<div className={styles.bordered}>
				<div className={styles.backgroundBlock}>
					<div className={styles.textPadBlock}>
						<div className={styles.iconText}>{currentLangData.steamUnlink}</div>
					</div>
				</div>
			</div>
		</div>
    </div>
  )
}

// end For Steam

function CreateEventButton() {
  const { modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const openModal = () => {
    modal.openCreateEvent()
  }

  return (
    <div className={`${styles.btn} ${styles.btnIcon}`} onClick={openModal}>
		{currentLangData.createEventButton}
      <div className={`${styles.square} ${styles.squareText}`}>+</div>
    </div>
  )
}

function Button({ loading, onClick, title, color, className, disabled }) {
  return (
    <div
      className={`${styles.btn} ${
        color === 'red' ? styles.red : ''
      } ${className} ${disabled ? styles.btnDisable : ''}`}
      onClick={onClick}>
	  <Loader visible={loading} className={styles.loaderAllModal} />
	  {color == 'gradientText' && !loading && (
		<p>{title}</p>
	  )}
	  {color !== 'gradientText' && !loading && (
		<p>{title}</p>
	  )}
    </div>
  )
}

function IconButton({ onClick, title, children, className }) {
  return (
    <div
      className={`${styles.btn} ${styles.btnIcon} ${className}`}
      onClick={onClick}>
      {title}
      <div className={`${styles.square} ${styles.squareText}`}>{children}</div>
    </div>
  )
}

function IconButtonForFooter({ onClick, className }) {
  return (
    <div
      className={`${styles.btn} ${styles.btnIconFooter} ${className}`}
      onClick={onClick}>
      <div className={`${styles.square} ${styles.squareText}`}>+</div>
    </div>
  )
}






function SimpleButton({ onClick, title, grey, className }) {
  return (
	<div className={styles.shadowBlock}>
		<div className={`${styles.offtenSimpleButton} ${className}`} onClick={onClick}>
			<div className={styles.bordered}>
				<div className={styles.backgroundBlock}>
					<div className={styles.textPadBlock}>
						<div className={styles.iconText}>{title}</div>
					</div>
				</div>
			</div>
		</div>
    </div>
  )
}

function SimpleSmallButton({ onClick, img, grey, className }) {
  return (
	<div className={styles.shadowBlock}>
		<div className={`${styles.simpleButton} ${className}`} onClick={onClick}>
			<div className={styles.bordered}>
				<div className={styles.backgroundBlock}>
					<div className={styles.textPadBlock}>
						<div className={styles.simpleButtonImage}><img src={img} /></div>
					</div>
				</div>
			</div>
		</div>
    </div>
  )
}

function NewIconButton({ onClick, title, img, grey, className }) {
  return (
	  <div className={styles.shadowBlock}>
			<div className={`${styles.newBtn} ${className}`} onClick={onClick}>
				<div className={styles.bordered}>
					<div className={styles.backgroundBlock}>
						<div className={styles.textPadBlock}>
							<div className={styles.iconText}>{title}</div>
							<div className={`${styles.newSquare} ${styles.newSquareText}`}><img src={img} /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

function NewIconGreyButton({ onClick, title, img, grey, className }) {
  return (
	  <div className={styles.shadowBlock}>
			<div className={`${styles.newBtn} ${styles.grey} ${className}`} onClick={onClick}>
				<div className={styles.bordered}>
					<div className={styles.backgroundBlock}>
						<div className={styles.textPadBlock}>
							<div className={styles.iconText}>{title}</div>
							<div className={`${styles.newSquare} ${styles.newSquareText}`}><img src={img} /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

function NewCreateEventButton() {
  const { user, modal } = useStores()
  const { currentLangData } = useContext(LangContext);
  const openModal = () => {
	if(user && user.steam && user.steam.username){
		modal.openCreateEvent()
	} else {
		modal.open('steam')
	}
  }

  return (
	<div className={styles.shadowBlock}>
		<div className={`${styles.newBtn}`} onClick={openModal}>
			<div className={styles.bordered}>
				<div className={styles.backgroundBlock}>
					<div className={styles.textPadBlock}>
						<div className={styles.iconText}>{currentLangData.createEventButton}</div>
						<div className={`${styles.newSquare} ${styles.newSquareText}`}><img src="/img/buttonIcons/plus.png" /></div>
					</div>
				</div>
			</div>
		</div>
    </div>
  )
}

export {
  LoadingButton,
  ExtensionButton,
  UnlinkSteamButton,
  SteamConnected,
  SwitchNetButton,
  ScatterLoadingButton,
  LynxButton,
  AllLoginButton,
  ChainButton,
  LinkSteamButton,
  SteamConnectModalButton,
  CreateEventButton,
  Button,
  IconButton,
  CreateEventButtonLoading,
  IconButtonForFooter,
  NewIconButton,
  NewCreateEventButton,
  SimpleSmallButton,
  SimpleButton,
  NewIconGreyButton
}
