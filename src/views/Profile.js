import React, { Fragment, useEffect, useContext } from 'react'
import ProfileData from '../components/ProfileData/index'
import User from '../store/user'
import {
  SteamConnected,
  LinkSteamButton,
  UnlinkSteamButton,
  Pie,
  Loader
} from '../ui/index'
import { useStores, useUpdate } from '../utils/hooks'
import { observer } from 'mobx-react'
import { FindAnotherEvents } from '../components/FindAnother/index'
import { ProfileTable, ProfileTableActive } from '../components/Table/index'
import LangContext from '../components/Lang/context/LangContext'
import history from '../history'

function Profile() {
  const { user, currency, common, events, modal } = useStores()
  const { currentLangData } = useContext(LangContext)
  useUpdate()
  user.pageTitleUpdate()
  
  if(user.isGuest){
	  history.push('/')
	  modal.open('loginPageModal')
  }
  
  let sumWonMoney
  sumWonMoney = user.stats.wonMoney
  
  
  return (
    <div className="content">
      <div className="main-wrap main-wrap--profile">
        <div className="main-mask">
          <div className="main main-profile">
            <ProfileData inProfile={true}>
              {user.isSteamLinked ? (
                <Fragment>
                  <SteamConnected />
                </Fragment>
              ) : (
                <LinkSteamButton />
              )}
            </ProfileData>
          </div>
        </div>
      </div>
      {events.loading ? (
        <Loader visible={true} className="main-loader" />
      ) : events.myEvents.length === 0 && events.myActiveEvents.length === 0 ? (
		<div className="mobilePadsEmptyTable">
			<FindAnotherEvents />
		</div>
      ) : (
	  <div>
		{events.myActiveEvents.length !== 0 && (
			<div className="mobilePadsFullTable activeEventsTable">
				<div className="mobileFinishedEvents">
					{currentLangData.activeEvents}
				</div>
				<ProfileTableActive />
			</div>
		)}
		{events.myEvents.length !== 0 && (
		<div className="mobilePadsFullTable">
			<div className="mobileFinishedEvents">
				{currentLangData.finishedEvents}
			</div>
			<ProfileTable />
		</div>
		)}
	  </div>
      )}
    </div>
  )
}

export default observer(Profile)
