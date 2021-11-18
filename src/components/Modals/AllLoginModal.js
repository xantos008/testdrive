import React, { useState, useContext } from 'react'
import { Modal, Head, Body } from './Modal'
import { Button, ChainButton } from '../../ui/index'
import { useStores, useModal } from '../../utils/hooks'
import { ScatterModal, LynxModal, SqrlModal } from '../../components/Modals/index'
import styles from './AllLoginModal.module.css'
import LangContext from '../../components/Lang/context/LangContext';
import {
  downloadScatter,
  downloadLynx,
  downloadSqrl,
  scatterHome,
  lynxHome,
  sqrlHome
} from '../../config'

function AllLoginModal({ visible, closeModal }) {
  
  let newTabBrowser = ''
  
  const { currentLangData } = useContext(LangContext);
  const { user } = useStores()
  const scatterModal = useModal()
  const lynxModal = useModal()
  const sqrlModal = useModal()
  const [localLoading, setLocalLoading] = useState(false)
  const [localLynxLoading, setLocalLynxLoading] = useState(false)
	
  //Lynx Wallet detect user works only here
  const [lynxName, setLynxName] = useState('')

  const signin = () => {
	  if(window.lynxMobile){
	  return window.lynxMobile.requestSetAccountName()
	  .then((accountName) => window.lynxMobile.requestSetAccount(accountName))
	  } else {
		  return false
	  }
	}
	const populateWelcomeScreen = () => {
	  if(signin()){
	  signin()
	  .then((accountData) => {
		  console.log(accountData)
		if (accountData) {
		  const tokens = accountData.tokens.filter(tokenEntry => tokenEntry.symbol === 'LNX').shift()
		  //accountData.account.account_name
		  //parseFloat(tokens.amount)
		  //console.log(accountData)
		  setLynxName(accountData)
		  clearInterval(loginInterval)
		}
	  })
	  }
	}
	let loginInterval = setInterval(populateWelcomeScreen(), 1000)
	
  const loginScatter = () => {
    setLocalLoading(true)
    user
      .login()
      .then(() => {
        user.init()
      })
      .catch(() => {
        scatterModal.open()
        setLocalLoading(false)
      })
  }
  
  const loginLynx = () => {
    setLocalLynxLoading(true)
	if(lynxName){
    user
      .loginLynx(lynxName)
      .then(() => {
        user.init()
      })
      .catch(() => {
        lynxModal.open()
        setLocalLynxLoading(false)
      })
	} else {
		lynxModal.open()
        setLocalLynxLoading(false)
	}
  }
	
  const [chainName, setChainName] = useState('LNX')
  const [chainWallet, setChainWallet] = useState('lynxAccount')
  const [allLoginLoading, setAllLoginLoading] = useState(false)
  
  const toggleChainName = (chainTitle) => {
    setChainName(chainTitle)
  }
  const toggleChainWallet = (chainTitleWallet) => {
    setChainWallet(chainTitleWallet)
  }
  const allLogs = () => {
	  setAllLoginLoading(true)
	  user
	  .allLogin(chainName, chainWallet, lynxName)
	  .then(() => {
        user.init()
      })
	  .catch(() => {
		if(chainWallet == 'lynxAccount'){
			if(downloadLynx){
				newTabBrowser = window.open(downloadLynx, '_blank');
				newTabBrowser.focus();
			} else {
				newTabBrowser = window.open(lynxHome, '_blank');
				newTabBrowser.focus();
			}
			lynxModal.open()
			setAllLoginLoading(false)
		}
		if(chainWallet == 'scatterAccount'){
			if(downloadScatter){
				newTabBrowser = window.open(downloadScatter, '_blank');
				newTabBrowser.focus();
			} else {
				newTabBrowser = window.open(scatterHome, '_blank');
				newTabBrowser.focus();
			}
			scatterModal.open()
			setAllLoginLoading(false)
		}
		if(chainWallet == 'sqrlAccount'){
			if(downloadSqrl){
				newTabBrowser = window.open(downloadSqrl, '_blank');
				newTabBrowser.focus();
			} else {
				newTabBrowser = window.open(sqrlHome, '_blank');
				newTabBrowser.focus();
			}
			sqrlModal.open()
			setAllLoginLoading(false)
		}
      })
  }

  const cleanIt = () => {
	  setChainName('')
	  setChainWallet('')
  }
  
  return (
	<div>
    <Modal visible={visible} onBackgroundPress={closeModal}>
	  <div className={`${styles.allLogin}`}>
		  <Head>{currentLangData.logInModaltitle} <div className={`${styles.closeIcon}`} onClick={closeModal}><img src="/img/close.svg" /></div></Head>
		  <Body hideBack="on">
		    <div className={`${styles.flexity}`}>
				<div className={`${styles.leftOneBlock}`}>
					<div className={`${styles.blockTitle}`}>{currentLangData.chooseYourCrypto}</div>
					<div className={`${styles.crypList}`}>
						{chainName == "LNX" && (
							<div>
								<div className={`${styles.activeOnBlock}`}>
									<ChainButton title="LNX" isActive="1" onClick={() => toggleChainName('LNX')} src="/img/lynx.svg" />
								</div>
								<div className={`${styles.orBlock}`}>{currentLangData.orBig}</div>
								<div className={`${styles.offtenOnBlock}`}>
									<ChainButton title="TLOS" onClick={() => toggleChainName('TLOS')} src="/img/telos.svg" />
								</div>
							</div>
						)}
						{chainName == "TLOS" && (
							<div>
								<div className={`${styles.activeOnBlock}`}>
									<ChainButton title="TLOS" isActive="1" onClick={() => toggleChainName('TLOS')} src="/img/telos.svg" />
								</div>
								<div className={`${styles.orBlock}`}>{currentLangData.orBig}</div>
								<div className={`${styles.offtenOnBlock}`}>
									<ChainButton title="LNX" onClick={() => toggleChainName('LNX')} src="/img/lynx.svg" />
								</div>
							</div>
						)}
					</div>
				</div>
				<div className={`${styles.rightOneBlock}`}>
					<div className={`${styles.blockTitle}`}>{currentLangData.chooseYourWallet}</div>
					<div className={`${styles.crypList}`}>
						{chainWallet == "lynxAccount" && (
							<div>
								<div className={`${styles.activeOnBlock}`}>
									<ChainButton title="Lynx Wallet" isActive="1" onClick={() => toggleChainWallet('lynxAccount')} src="/img/lynx.svg" />
								</div>
								<div className={`${styles.orBlock}`}>{currentLangData.orBig}</div>
								<div className={`${styles.offtenOnBlock}`}>
									<ChainButton title="Scatter" onClick={() => toggleChainWallet('scatterAccount')} src="/img/scatter.svg" />
									<ChainButton title="SQRL" onClick={() => toggleChainWallet('sqrlAccount')} src="/img/sqrl.svg" />
								</div>
							</div>
						)}
						{chainWallet == "scatterAccount" && (
							<div>
								<div className={`${styles.activeOnBlock}`}>
									<ChainButton title="Scatter" isActive="1" onClick={() => toggleChainWallet('scatterAccount')} src="/img/scatter.svg" />
								</div>
								<div className={`${styles.orBlock}`}>{currentLangData.orBig}</div>
								<div className={`${styles.offtenOnBlock}`}>
									<ChainButton title="Lynx Wallet" onClick={() => toggleChainWallet('lynxAccount')} src="/img/lynx.svg" />
									<ChainButton title="SQRL" onClick={() => toggleChainWallet('sqrlAccount')} src="/img/sqrl.svg" />
								</div>
							</div>
						)}
						{chainWallet == "sqrlAccount" && (
							<div>
								<div className={`${styles.activeOnBlock}`}>
									<ChainButton title="SQRL" isActive="1" onClick={() => toggleChainWallet('sqrlAccount')} src="/img/sqrl.svg" />
								</div>
								<div className={`${styles.orBlock}`}>{currentLangData.orBig}</div>
								<div className={`${styles.offtenOnBlock}`}>
									<ChainButton title="Lynx Wallet" onClick={() => toggleChainWallet('lynxAccount')} src="/img/lynx.svg" />
									<ChainButton title="Scatter" onClick={() => toggleChainWallet('scatterAccount')} src="/img/scatter.svg" />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			
			
			
			<div className={styles.blockCenter}>
				<Button loading={allLoginLoading} title={currentLangData.login} className={`${styles.allLoginModalButton}`} color="gradientText" onClick={() => allLogs()} />
				<br />
				{chainWallet == 'lynxAccount' && (
					<a href="https://downloads.lynxwallet.io/" className={styles.noWallet}>{currentLangData.dontHaveWallet}</a>
				)}
				{chainWallet == 'scatterAccount' && (
					<a href="https://get-scatter.com/download" className={styles.noWallet}>{currentLangData.dontHaveWallet}</a>
				)}
				{chainWallet == 'sqrlAccount' && (
					<a href="https://sqrlwallet.io/" className={styles.noWallet}>{currentLangData.dontHaveWallet}</a>
				)}
			</div>
		  </Body>
	  </div>
    </Modal>
	<LynxModal
        visible={lynxModal.visible}
        closeModal={lynxModal.close}
    />
	<ScatterModal
        visible={scatterModal.visible}
        closeModal={scatterModal.close}
    />
	<SqrlModal
        visible={sqrlModal.visible}
        closeModal={sqrlModal.close}
    />
	</div>
  )
}

export default AllLoginModal
