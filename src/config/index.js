import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import serverList from './servers'

import Eos from 'eosjs'
import EosApi from 'eosjs-api'

let wombatHome, scatterHome, lynxHome, sqrlHome, downloadWombat, downloadScatter, downloadLynx, downloadSqrl, allNets, contractName, contractNameLynx, contractNameTelos, contractName5vs5, contractName5vs5Lynx, contractName5vs5Telos, contractsNameList, environment, network, networkLynx, networkTelos;

const OS = () => {
	let userDeviceArray = [
		{device: 'Android', platform: /Android/},
		{device: 'iPhone', platform: /iPhone/},
		{device: 'iPad', platform: /iPad/},
		{device: 'Symbian', platform: /Symbian/},
		{device: 'Windows Phone', platform: /Windows Phone/},
		{device: 'Tablet OS', platform: /Tablet OS/},
		{device: 'Linux', platform: /Linux/},
		{device: 'Windows', platform: /Windows NT/},
		{device: 'Macintosh', platform: /Macintosh/}
	]
	
	let platform = navigator.userAgent;
	for (let i in userDeviceArray) {
		if (userDeviceArray[i].platform.test(platform)) {
			return userDeviceArray[i].device;
		}
	}
	return platform;
}
	
if(OS() == 'Windows') {
	downloadScatter = 'https://github.com/GetScatter/ScatterDesktop/releases/download/12.0.0/win-scatter-12.0.0.exe'
	downloadLynx = 'https://download.lynxwallet.io/Lynx-Wallet-Setup-2-14-3-c4fe424-.exe'
	downloadSqrl ='https://github.com/Telos-Foundation/Sqrl/releases/download/1.2.0/win-Sqrl-1.2.0.exe'
	downloadWombat = 'https://chrome.google.com/webstore/detail/wombat-eos-wallet/amkmjjmmflddogmhpjloimipbofnfjih'
} else if(OS() == 'Macintosh') {
	downloadScatter = 'https://github.com/GetScatter/ScatterDesktop/releases/download/12.0.0/mac-scatter-12.0.0.dmg'
	downloadLynx = 'https://download.lynxwallet.io/Lynx-Wallet-2-14-4-ec5a8dd.AppImage'
	downloadSqrl = 'https://github.com/Telos-Foundation/Sqrl/releases/download/1.2.0/mac-Sqrl-1.2.0.dmg'
	downloadWombat = 'https://chrome.google.com/webstore/detail/wombat-eos-wallet/amkmjjmmflddogmhpjloimipbofnfjih'
} else if(OS() == 'Linux'){
	downloadScatter = 'https://github.com/GetScatter/ScatterDesktop/releases/download/12.0.0/linux-scatter-12.0.0-x86_64.AppImage'
	downloadLynx = 'https://download.lynxwallet.io/Lynx-Wallet-2-14-4-ec5a8dd.dmg'
	downloadSqrl = 'https://github.com/Telos-Foundation/Sqrl/releases/download/1.2.0/linux-Sqrl-1.2.0-x86_64.AppImage'
	downloadWombat = 'https://chrome.google.com/webstore/detail/wombat-eos-wallet/amkmjjmmflddogmhpjloimipbofnfjih'
}else if(OS() == 'iPhone' || OS() == 'iPad'){
	downloadLynx = 'https://apps.apple.com/us/app/lynx-wallet/id1401398759'
	downloadWombat = 'https://apps.apple.com/de/app/wombat-wallet/id1474392110'
}else if(OS() == 'Android'){
	downloadScatter = 'https://play.google.com/store/apps/details?id=com.scatternative&hl=en_US'
	downloadLynx = 'https://play.google.com/store/apps/details?id=com.needly.eoslynx&hl=en'
	downloadWombat = 'https://play.google.com/store/apps/details?id=io.getwombat.android'
}

scatterHome = 'https://get-scatter.com/download'
lynxHome = 'https://create.lynxwallet.io/'
sqrlHome = 'https://sqrlwallet.io/earn/'
wombatHome = 'https://www.getwombat.io/'


if (location.hostname === "farmgame.io" || location.hostname === "farm.game" || location.hostname === "test.farm.game" || location.hostname === "localhost" || location.hostname === "dapp.farm.game") {
  environment = 'mainnet'
  
  contractName = 'contractfa11'
  contractNameLynx = 'farmgamem1v1'
  contractNameTelos = 'farmgamem1v1'
  contractName5vs5 = 'contractfa12'
  contractName5vs5Lynx = 'farmgamem5v5'
  contractName5vs5Telos = 'farmgamem5v5'

  network = {
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https'
  }
  networkLynx = Eos({
	chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
	//keyProvider: ['5JQ9zJJHEMMnjjShxXenZTCJLD4MZjf2MV4pMeJXQuKc9rrjLGx'], // WIF string or array of keys.. 
	httpEndpoint: 'https://lynx.cryptolions.io',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  })
  networkTelos = {
    blockchain: 'tlos',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    host: 'api.eos.miami',
    port: 443,
    protocol: 'https'
  }
  
  //definition of array
  allNets = []
  
  allNets["scatterAccount"] = []
  allNets["scatterAccount"]["EOS"] = []
  allNets["scatterAccount"]["LNX"] = []
  allNets["scatterAccount"]["TLOS"] = []
  
  allNets["wombatAccount"] = []
  allNets["wombatAccount"]["EOS"] = []
  allNets["wombatAccount"]["LNX"] = []
  allNets["wombatAccount"]["TLOS"] = []
  
  allNets["sqrlAccount"] = []
  allNets["sqrlAccount"]["EOS"] = []
  allNets["sqrlAccount"]["LNX"] = []
  allNets["sqrlAccount"]["TLOS"] = []
  
  allNets["lynxAccount"] = []
  allNets["lynxAccount"]["EOS"] = []
  allNets["lynxAccount"]["LNX"] = []
  allNets["lynxAccount"]["TLOS"] = []
  
  //Scatter
  allNets["scatterAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["EOS"]["contractName"] = contractName
  allNets["scatterAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["scatterAccount"]["LNX"]["network"] = {
	blockchain: 'eos',
    chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
    host: 'lynx.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["scatterAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["scatterAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    host: 'api.telosfoundation.io',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["scatterAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //Wombat
  allNets["wombatAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["EOS"]["contractName"] = contractName
  allNets["wombatAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["wombatAccount"]["LNX"]["network"] = {
	blockchain: 'eos',
    chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
    host: 'lynx.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["wombatAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["wombatAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    host: 'api.telosfoundation.io',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["wombatAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //SQRL
  allNets["sqrlAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'nodes.get-scatter.com',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["EOS"]["contractName"] = contractName
  allNets["sqrlAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["sqrlAccount"]["LNX"]["network"] = {
	blockchain: 'lynx',
    chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
    host: 'lynx.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["sqrlAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["sqrlAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
    host: 'api.telosfoundation.io',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["sqrlAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //Lynx Wallet
  allNets["lynxAccount"]["EOS"]["network"] = {
	chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
	httpEndpoint: 'https://nodes.get-scatter.com',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  }
  allNets["lynxAccount"]["EOS"]["contractName"] = contractName
  allNets["lynxAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["lynxAccount"]["LNX"]["network"] = {
	chainId: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
	httpEndpoint: 'https://lynx.cryptolions.io',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  }
  allNets["lynxAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["lynxAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["lynxAccount"]["TLOS"]["network"] = {
	chainId: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
	httpEndpoint: 'https://api.telosfoundation.io',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  }
  allNets["lynxAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["lynxAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos

  contractsNameList = [contractName, contractNameLynx, contractNameTelos, contractName5vs5, contractName5vs5Lynx, contractName5vs5Telos]
  
  
} else {
	
	
  environment = 'staging'
  contractName = 'farmstaonee1'
  contractNameLynx = 'farmlynxm1v1'
  contractNameTelos = 'farmgamem1v1'
  contractName5vs5 = 'farmstafive1'
  contractName5vs5Lynx = 'farmlynxm5v5'
  contractName5vs5Telos = 'farmgamem5v5'

  network = {
    blockchain: 'eos',
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    host: 'jungle2.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  networkLynx = Eos({
	chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',
	//keyProvider: ['5JQ9zJJHEMMnjjShxXenZTCJLD4MZjf2MV4pMeJXQuKc9rrjLGx'], // WIF string or array of keys.. 
	httpEndpoint: 'https://testnet.lynxchain.io',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  })
  networkTelos = {
    blockchain: 'eos',
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
    host: 'testnet.eos.miami',
    port: 443,
    protocol: 'https'
  }
  
  //definition of array
  allNets = []
  
  allNets["scatterAccount"] = []
  allNets["scatterAccount"]["EOS"] = []
  allNets["scatterAccount"]["LNX"] = []
  allNets["scatterAccount"]["TLOS"] = []
  
  allNets["wombatAccount"] = []
  allNets["wombatAccount"]["EOS"] = []
  allNets["wombatAccount"]["LNX"] = []
  allNets["wombatAccount"]["TLOS"] = []
  
  allNets["sqrlAccount"] = []
  allNets["sqrlAccount"]["EOS"] = []
  allNets["sqrlAccount"]["LNX"] = []
  allNets["sqrlAccount"]["TLOS"] = []
  
  allNets["lynxAccount"] = []
  allNets["lynxAccount"]["EOS"] = []
  allNets["lynxAccount"]["LNX"] = []
  allNets["lynxAccount"]["TLOS"] = []
  
  //Scatter
  allNets["scatterAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    host: 'jungle2.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["EOS"]["contractName"] = contractName
  allNets["scatterAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["scatterAccount"]["LNX"]["network"] = {
    blockchain: 'eos',
    chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',
    host: 'lynxtest.csx.io',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["scatterAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["scatterAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
    host: 'testnet.eos.miami',
    port: 443,
    protocol: 'https'
  }
  allNets["scatterAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["scatterAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //Wombat
  allNets["wombatAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    host: 'jungle2.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["EOS"]["contractName"] = contractName
  allNets["wombatAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["wombatAccount"]["LNX"]["network"] = {
    blockchain: 'eos',
    chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',
    host: 'lynxtest.csx.io',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["wombatAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["wombatAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
    host: 'testnet.eos.miami',
    port: 443,
    protocol: 'https'
  }
  allNets["wombatAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["wombatAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //SQRL
  allNets["sqrlAccount"]["EOS"]["network"] = {
    blockchain: 'eos',
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
    host: 'jungle2.cryptolions.io',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["EOS"]["contractName"] = contractName
  allNets["sqrlAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["sqrlAccount"]["LNX"]["network"] = {
    blockchain: 'eos',
    chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',
    host: 'lynxtest.csx.io',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["sqrlAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["sqrlAccount"]["TLOS"]["network"] = {
    blockchain: 'eos',
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
    host: 'testnet.eos.miami',
    port: 443,
    protocol: 'https'
  }
  allNets["sqrlAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["sqrlAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos
  
  //Lynx Wallet
  allNets["lynxAccount"]["EOS"]["network"] = {
    chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
	httpEndpoint: 'https://jungle2.cryptolions.io',
	expireInSeconds: 60,
	symbol: 'EOS',
	broadcast: true,
	verbose: true, // API activity
	sign: true
  }
  allNets["lynxAccount"]["EOS"]["contractName"] = contractName
  allNets["lynxAccount"]["EOS"]["contractName5vs5"] = contractName5vs5
  
  allNets["lynxAccount"]["LNX"]["network"] = {
	chainId: 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b',
	httpEndpoint: 'https://testnet.lynxchain.io',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false, // API activity
	sign: true
  }
  allNets["lynxAccount"]["LNX"]["contractName"] = contractNameLynx
  allNets["lynxAccount"]["LNX"]["contractName5vs5"] = contractName5vs5Lynx
  
  allNets["lynxAccount"]["TLOS"]["network"] = {
    chainId: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
	httpEndpoint: 'testnet.eos.miami',
	expireInSeconds: 60,
	symbol: 'TLOS',
	broadcast: true,
	verbose: true, // API activity
	sign: true
  }
  allNets["lynxAccount"]["TLOS"]["contractName"] = contractNameTelos
  allNets["lynxAccount"]["TLOS"]["contractName5vs5"] = contractName5vs5Telos

  contractsNameList = [contractName, contractNameLynx, contractNameTelos, contractName5vs5, contractName5vs5Lynx, contractName5vs5Telos]
  
  
}

const mainServerUrl = 'https://api.farm.game/api/v1'


const scatterRegex = /^[a-z1-5]{12}$/
// const network_http = ScatterJS.Network.fromJson({
//   blockchain: 'eos',
//   chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
//   host: 'jungle2.cryptolions.io',
//   port: 80,
//   protocol: 'http'
// })
// const network_kylin = ScatterJS.Network.fromJson({
//   blockchain: 'eos',
//   chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
//   host: 'api.kylin.alohaeos.com',
//   port: 443,
//   protocol: 'https'
// })

export {
  allNets,
  network,
  networkLynx,
  networkTelos,
  contractName,
  contractNameLynx,
  contractNameTelos,
  environment,
  contractName5vs5,
  contractName5vs5Lynx,
  contractName5vs5Telos,
  contractsNameList,
  scatterRegex,
  mainServerUrl,
  serverList,
  downloadScatter,
  downloadLynx,
  downloadSqrl,
  scatterHome,
  lynxHome,
  sqrlHome,
  wombatHome,
  downloadWombat
}
