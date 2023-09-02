import "./Navbar.css"
import { connect, disconnect, type ConnectOptions, type DisconnectOptions, type StarknetWindowObject } from "get-starknet"
import { useState } from 'react'
import { truncateAddress } from "../utils/addressHandler"

type NavBarProps = {
  setWalletAdrsParent: (walletAdrs: string) => void
  setWalletParent: (wallet: StarknetWindowObject) => void
}

export default function NavBar({setWalletAdrsParent, setWalletParent}: NavBarProps) {

  const [walletAdrs, setWalletAdrs] = useState("")
  const [hasDisconnected, setHasDisconnected] = useState(false)

  function handleConnect(options?: ConnectOptions) {
    return async () => {
      const res = await connect(options)
      // console.log(res)
      if(res){
        setWalletAdrsParent(res?.selectedAddress || "")
        setWalletAdrs(res?.selectedAddress || "")
        setWalletParent(res)
      }
    }
  }
  
  function handleDisconnect(options?: DisconnectOptions) {
    return async () => {
      await disconnect(options)
      setWalletAdrs("")
      setWalletAdrsParent("")
      setHasDisconnected(true)
    }
  }

  if(walletAdrs === "" && !hasDisconnected){
    handleConnect({ modalMode: "neverAsk" })()
  }


  return(
  <div className="navBarContainer">
    {walletAdrs === "" &&
      <div className="walletContainer">
        <div className="connectButton" onClick={handleConnect({ modalMode: "canAsk" })}>
          Connect
        </div>
      </div>
    }
    {walletAdrs != "" &&
      <div className="walletContainer">
        <div className="navbarWalletAdrs">
          {truncateAddress(walletAdrs)}
        </div>
        <div className="disconnectButton" onClick={handleDisconnect()}>
          Disconnect
        </div>
      </div>
    }
  </div>
  )
}