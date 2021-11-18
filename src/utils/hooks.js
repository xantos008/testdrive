import React, { useState, useEffect, useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import LangContext from '../components/Lang/context/LangContext'
import stylesEvent from '../views/Event/event.module.css'
import stylesTable from '../components/Table/table.module.css'
import stylesFooter from '../components/Footer/footer.module.css'

function useStores() {
  return React.useContext(MobXProviderContext)
}

function useUpdate() {
  const { currentLangData } = useContext(LangContext)
  const { user, tournaments } = useStores()
  
  useEffect(() => {
    let interval
    if (user.isAuthenticated || user.isGuest) {
      interval = setInterval(() => {
        user.update()
		tournaments.getParticipators()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [user.isAuthenticated])
  
  //Update user referral system stats
  useEffect(() => {
    let interval
    if (user.isAuthenticated) {
      interval = setInterval(() => {
        user.updateStatsRefs()
		
      }, 300000)
    }
    return () => clearInterval(interval)
  }, [user.isAuthenticated])
  
  //Set page title
  useEffect(() => {
	  let title = currentLangData.eventsMenu
	  if(location.pathname == '/'){
		  title = currentLangData.eventsMenu + ' | FARM.GAME'
		  document.title = title
		  user.pageTitleUpdate()
		  window.scrollTo(0,0)
	  }
	  if(location.pathname.split('/profile').length > 1){
		  title = currentLangData.profileMenu + ' | FARM.GAME'
		  document.title = title
		  user.pageTitleUpdate()
		  window.scrollTo(0,0)
		  document.getElementById('root').classList.add('eventBackground')
	  }
	  if(location.pathname == '/create-event'){
		  title = currentLangData.createEventMenu + ' | FARM.GAME'
		  document.title = title
		  user.pageTitleUpdate()
		  window.scrollTo(0,0)
	  }
	  
	  if(location.pathname.split('/event').length > 1){
		  document.getElementById('root').classList.add('eventBackground')
	  } else {
		  document.getElementById('root').classList.remove('eventBackground')
	  }
	  
  }, []);
  
  //Make dinamical content
	let lastScrollTop = 0;
	let tableElement, tableElementOffset, timeToRemoveTableHeadLine

	useEffect(() => {
		tableElement = document.getElementsByClassName(`${stylesTable.table}`)[0]
		if(tableElement){
			tableElementOffset = tableElement.offsetTop - document.getElementsByTagName('header')[0].clientHeight
		}
	}, [])
	
	
	
	document.getElementById('root').removeAttribute('data-scroll-direction')
	if(localStorage.getItem('smallFooter')){
		document.getElementById('root').setAttribute('smaller', '')
	}
	window.addEventListener("scroll", function(){
	   var st = window.pageYOffset || document.body.scrollTop;
	   var mobileFooter = document.getElementsByClassName(`${stylesFooter.mobileStyky}`)[0];
	   
	   if (st > lastScrollTop){
			document.getElementById('root').setAttribute('data-scroll-direction', 'DOWN')
			localStorage.setItem('smallFooter', 1)
			if(mobileFooter){
				if(!mobileFooter.classList.contains(stylesFooter.smallFooter)){
					mobileFooter.classList.add(stylesFooter.smallFooter)
				}
			}
			document.getElementById('root').setAttribute('smaller', '')
	   } else {
			document.getElementById('root').setAttribute('data-scroll-direction', 'UP')
			localStorage.setItem('smallFooter', 1)
			if(mobileFooter){
				if(!mobileFooter.classList.contains(stylesFooter.smallFooter)){
					mobileFooter.classList.add(stylesFooter.smallFooter)
				}
			}
			document.getElementById('root').setAttribute('smaller', '')
	   }
	   
	   lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
	   if(tableElement && window.innerWidth >= 768){
			   timeToRemoveTableHeadLine = tableElement.clientHeight + tableElementOffset - 110 > st
			   if( st > tableElementOffset && !tableElement.classList.contains(`${stylesTable.fixed}`)) {
				   tableElement.classList.add(`${stylesTable.fixed}`)
			   }

			   if( st < tableElementOffset && tableElement.classList.contains(`${stylesTable.fixed}`)) {
				   tableElement.classList.remove(`${stylesTable.fixed}`)
			   }
			   
			   if(!timeToRemoveTableHeadLine && tableElement.classList.contains(`${stylesTable.fixed}`)){
				   tableElement.classList.remove(`${stylesTable.fixed}`)
			   }

	   }
	}, false);
	
	document.addEventListener('click', function(e){
		
		let teamItemContainer = document.getElementsByClassName(`${stylesEvent.teamItemContainer}`)
		let miniModal
		
		if(teamItemContainer.length > 0){
			for(let i = 0; i < teamItemContainer.length; i++){
				if (!teamItemContainer[i].contains(e.target)){
					miniModal = teamItemContainer[i].getElementsByClassName(`${stylesEvent.miniModal}`)[0]
					
					if(miniModal && miniModal.classList.contains(`${stylesEvent.miniModalShown}`)){
						miniModal.classList.remove(`${stylesEvent.miniModalShown}`);
						miniModal.classList.add(`${stylesEvent.miniModalHidden}`);
					}
					
				}
				if (teamItemContainer[i].contains(e.target)){
					miniModal = teamItemContainer[i].getElementsByClassName(`${stylesEvent.miniModal}`)[0]
					
					if(miniModal){
						if(miniModal.classList.contains(`${stylesEvent.miniModalHidden}`)){
							miniModal.classList.remove(`${stylesEvent.miniModalHidden}`);
							miniModal.classList.add(`${stylesEvent.miniModalShown}`);
						} else {
							miniModal.classList.remove(`${stylesEvent.miniModalShown}`);
							miniModal.classList.add(`${stylesEvent.miniModalHidden}`);
						}
					}
				}
			}
		}
		
	})
  
}

function useModal() {
  const [modalVisible, setModalVisible] = useState(false)

  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return {
    visible: modalVisible,
    open: openModal,
    close: closeModal
  }
}

export { useStores, useModal, useUpdate }
