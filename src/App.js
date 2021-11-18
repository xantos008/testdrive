import React, { Fragment, useEffect, useState, useContext } from 'react'
import Footer from './components/Footer/index'
import Header from './components/Header/index'
import { Switch, Route, Redirect } from 'react-router-dom'
import Events from './views/Events'
import Initial from './views/Initial/index'
import Profile from './views/Profile'
import CreateEvent from './components/CreateEvent'
import Event from './views/Event/index'
import { useStores } from './utils/hooks'
import { observer } from 'mobx-react'
import { preCheckEvents, anyState, forcedCancelEvent, apiLobbyDestroy, sendReady, setOnline } from './services/utils'


import {
  SteamModal,
  CreateEventModal,
  PandasBotModal,
  CreateEventErrorModal,
  CreateEventSuccessModal,
  ErrorModal,
  AcceptModal,
  TestGamesEnd,
  AcceptTrueModal,
  OpponentFoundModal,
  AnswerFalseModal,
  AnswerAcceptModal,
  RejectAcceptModal,
  LobbyErrorModal,
  LobbyCreatingModal,
  CreateEventAbuseModal,
  Participate5vs5Modal,
  ErrorModal2,
  ExistSteamModal,
  CantParticipateModal,
  LeaveEventModal,
  CreateEventSponsModal,
  YouWereKickedModal,
  YouWereKickedAndBannedModal,
  PlayerWasDeletedFromEvent,
  ReferralInfoModal,
  MonthsLevelInfoModal,
  LoginPageModal,
  LoginPageLoadModal,
  LobbyLeavingModal,
  ConfirmedFailedModal,
  ConfirmingReadyModal,
  InvitesWasSendedModal,
  ReadyConfirmedModal,
  TimerKickedModal,
  TimerKickedPlayersListModal,
  WombatRestartModal,
  WombatLoginRestartModal,
  OpponentSelfLeavedModal,
  TournamentParticipateModal
} from './components/Modals/index'
import withSplashScreen from './components/Splashscreen'
import createActivityDetector from 'activity-detector'

function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}

function LoginRouteMainscreen({ isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        (
          <Initial {...props} path="/" />
        )
      }
    />
  )
}

function LoginRoute({ isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        (
          <Events {...props} />
        )
      }
    />
  )
}

function useIdle(options){
	const { user } = useStores()
	let now = user.time
	const [isIdle, setIsIdle] = useState({online: false, lastTimeSeen: now})
	useEffect(()=>{
		const activityDetector = createActivityDetector(options)
		activityDetector.on('idle', () => {
			now = user.time
			setIsIdle({online: false, lastTimeSeen: now})
			if(user && user.steam && user.steam.steamId){
				(async () => {
					try {
						await setOnline(user.name, user.wallet, now)
					} catch (e) {
						console.log(e)
					}
				})();
			}
		})
		activityDetector.on('active', () => {
			now = user.time
			setIsIdle({online: true, lastTimeSeen: now})
			if(user && user.steam && user.steam.steamId){
				(async () => {
					try {
						await setOnline(user.name, user.wallet, now)
					} catch (e) {
						console.log(e)
					}
				})();
			}
		})
		
	}, [])
	return isIdle
}



function App() {
  const isIdle = useIdle({timeToIdle: 2000, activityEvents: ['mousemove', 'click', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'focus']})
  const { user, modal, events } = useStores()
  console.log(isIdle)
  const onlyMainScreen = location.hostname === "farm.game"
  const [isMobile, setIsMobie] = useState(window.innerWidth < 1000)
  //const io = require('socket.io')();

  window.addEventListener('resize', function(){
	  if(window.innerWidth > 999){
		  setIsMobie(false)
	  } else {
		  setIsMobie(true)
	  }
  })

  return (
    <Fragment>
      {(user.isAuthenticated || user.isGuest) && !onlyMainScreen && !isMobile && <Header />}
	  {(onlyMainScreen || isMobile) ? (
		
			<LoginRouteMainscreen isAuthenticated={false} exact />
		
	  ) : (
		<Switch>
			<PrivateRoute
			  exact
			  path="/"
			  isAuthenticated={user.isAuthenticated}
			  component={Events}
			/>
			<PrivateRoute
			  path="/profile"
			  isAuthenticated={user.isAuthenticated}
			  component={Profile}
			/>
			<PrivateRoute
			  path="/event/:key"
			  isAuthenticated={user.isAuthenticated}
			  component={Event}
			/>
			<PrivateRoute
			  path="/create-event"
			  isAuthenticated={user.isAuthenticated}
			  component={CreateEvent}
			/>
			<LoginRoute isAuthenticated={user.isAuthenticated} exact />
		</Switch>
	  )}
      {modal.visible.accept && !onlyMainScreen && <AcceptModal />}
      {modal.visible.testGamesEnd && !onlyMainScreen && <TestGamesEnd />}
      {modal.visible.lobbyLeaving && !onlyMainScreen && <LobbyLeavingModal />}
      {modal.visible.loginPageModal && !onlyMainScreen && <LoginPageModal />}
      {modal.visible.loginPageLoadModal && !onlyMainScreen && <LoginPageLoadModal />}
      {modal.visible.createEventSponsModal && !onlyMainScreen && <CreateEventSponsModal />}
      {modal.visible.timerKicked && !onlyMainScreen && <TimerKickedModal />}
      {modal.visible.timerKickedPlayersList && !onlyMainScreen && <TimerKickedPlayersListModal />}
      {modal.visible.wombatRestartModal && <WombatRestartModal />}
      {modal.visible.wombatLoginRestartModal && <WombatLoginRestartModal />}
      {modal.visible.opponentSelfLeaved && <OpponentSelfLeavedModal />}
	  
	  {modal.visible.confirmedFailed && !onlyMainScreen && <ConfirmedFailedModal />}
	  {modal.visible.confirmingReady && !onlyMainScreen && <ConfirmingReadyModal />}
	  {modal.visible.invitesWasSended && !onlyMainScreen && <InvitesWasSendedModal />}
	  {modal.visible.readyConfirmed && !onlyMainScreen && <ReadyConfirmedModal />}
  
      {modal.visible.youWereKickedModal && !onlyMainScreen && <YouWereKickedModal />}
      {modal.visible.youWereKickedAndBannedModal && !onlyMainScreen && <YouWereKickedAndBannedModal />}
      {modal.visible.playerWasDeletedFromEvent && !onlyMainScreen && <PlayerWasDeletedFromEvent />}
      {modal.visible.referralInfoModal && !onlyMainScreen && <ReferralInfoModal />}
      {modal.visible.monthsLevelInfoModal && !onlyMainScreen && <MonthsLevelInfoModal />}
      {modal.visible.existSteamModal && !onlyMainScreen && <ExistSteamModal />}
      {modal.visible.leaveEvent && !onlyMainScreen && <LeaveEventModal />}
      {modal.visible.cantParticipateModal && !onlyMainScreen && <CantParticipateModal />}
      {modal.visible.answerFalse && !onlyMainScreen && <AnswerFalseModal />}
      {modal.visible.answerAccept && !onlyMainScreen && <AnswerAcceptModal />}
      {modal.visible.rejectAccept && !onlyMainScreen && <RejectAcceptModal />}
      {modal.visible.lobbyError && !onlyMainScreen && <LobbyErrorModal />}
      {modal.visible.lobbyCreating && !onlyMainScreen && <LobbyCreatingModal />}
      {modal.visible.opponentFound && !onlyMainScreen && <OpponentFoundModal />}
      {modal.visible.steam && !onlyMainScreen && <SteamModal />}
      {modal.visible.createEvent && !onlyMainScreen && <CreateEventModal />}
      {modal.visible.pandasBotModal && !onlyMainScreen && <PandasBotModal />}
      {modal.visible.createEventSuccess && !onlyMainScreen && <CreateEventSuccessModal />}
      {modal.visible.createEventError && !onlyMainScreen && <CreateEventErrorModal />}
      {modal.visible.createEventAbuse && !onlyMainScreen && <CreateEventAbuseModal />}
      {modal.visible.error && !onlyMainScreen && <ErrorModal />}
      {modal.visible.acceptTrue && !onlyMainScreen && <AcceptTrueModal />}
      {modal.visible.participate5vs5 && !onlyMainScreen && <Participate5vs5Modal />}
      {modal.visible.error2 && !onlyMainScreen && <ErrorModal2 />}
      {modal.visible.tournamentParticipateModal && !onlyMainScreen && <TournamentParticipateModal />}
      <Footer />
    </Fragment>
  )
}

export default withSplashScreen(observer(App))
