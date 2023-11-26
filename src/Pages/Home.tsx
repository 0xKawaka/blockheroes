import { Link } from "react-router-dom";
import './Home.css'
import { StarknetWindowObject } from "get-starknet";
import { Account } from "starknet";
import NavBar from "./Components/Navbar";

type HomeProps = {
  localWallet: Account | undefined
  isDeploying: boolean
  wallet: StarknetWindowObject | undefined
  setWallet: React.Dispatch<React.SetStateAction<StarknetWindowObject | undefined>>
  setHasDisconnected: React.Dispatch<React.SetStateAction<boolean>>
}


function Home({localWallet, isDeploying, wallet, setWallet, setHasDisconnected}: HomeProps) {
  return (
    <div className="HomeContainerAndNavbar">
      {/* <NavBar wallet={wallet} setWallet={setWallet} setHasDisconnected={setHasDisconnected} /> */}
      <div className="HomeContainer">
        {!localWallet && !isDeploying &&
          <div className="LocalWalletLoading">
            Loading local test wallet...
          </div>      
        }
        {!localWallet && isDeploying &&
          <div className="LocalWalletLoading">
            Deploying local test wallet...
          </div>      
        }
        {localWallet &&
          <div className="disclaimerAndPlayContainer">
            <div className="disclaimerHome">
              This is a preview demo, the state of your session will be lost when you refresh the page.
            </div>
            <Link className="GameButton" to={{pathname: '/game'}}>
              Start Playing
            </Link>
          </div>
        }
      </div>

      {/* <div className="HomeContainer">
        {(wallet === undefined || !wallet?.isConnected) &&
          <div className="WalletError">
            Please connect your Starknet Wallet
          </div>
        }
        {wallet !== undefined && wallet?.isConnected &&
        <Link className="GameButton" to={{pathname: '/game'}}>
          Start Playing
        </Link>
        }
      </div> */}
    </div>
  )
}

export default Home



