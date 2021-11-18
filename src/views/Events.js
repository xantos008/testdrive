import React, {useContext} from 'react'
import ProfileData from '../components/ProfileData/index'
import { CreateEventButton, Loader, NewCreateEventButton, NewIconButton } from '../ui/index'
import { useStores, useUpdate } from '../utils/hooks'
import { observer } from 'mobx-react'
import { FindAnotherEvents } from '../components/FindAnother'
import { EventsTable } from '../components/Table'
import { CancelModal } from '../components/Modals/index'
import LangContext from '../components/Lang/context/LangContext'
import Banner from '../components/Banner/index'

function Events() {
  const { events, user, modal } = useStores()
  useUpdate()
  user.pageTitleUpdate()
  const { currentLangData } = useContext(LangContext)
  const isGuest = user.isGuest
  const guestClick = () => {
		modal.open('loginPageModal')
  }

  return (
    <div className="content">
      <CancelModal />
	  <div className="pageTitleBlock">
		<div className="pageTitleBlockWords">
			<h1>{currentLangData.tournamentsTitle}</h1>
		</div>
	  </div>
	  
	  <Banner />
	  
	  <div className="pageTitleBlock" style={{paddingTop: "50px"}}>
		<div className="pageTitleBlockWords">
			<h1>{currentLangData.eventsMenu}</h1>
		</div>
		<div className="pageTitleBlockButton">
			{isGuest ? (
				<NewIconButton 
					title={currentLangData.createEventButton} 
					onClick={guestClick} 
					img="/img/buttonIcons/plus.png"
				/>
			) : (
				<NewCreateEventButton />
			)}
		</div>
	  </div>
	  
      {events.loading ? (
        <Loader visible={true} className="main-loader" />
      ) : events.events.length === 0 ? (
        <FindAnotherEvents />
      ) : (
		<div>
			<EventsTable />
			<FindAnotherEvents />
		</div>
      )}
	  
    </div>
  )
}

export default observer(Events)
