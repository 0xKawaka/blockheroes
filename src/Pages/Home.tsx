import { Link } from "react-router-dom";
import './Home.css'
// import { StarknetWindowObject } from "get-starknet";
// import { Account } from "starknet";

type HomeProps = {
}


function Home({}: HomeProps) {
  return (
    <div className="HomeContainerAndNavbar">
      {/* <div className="HomeContainer">
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
              This is a demo.
              The state of your session will be lost when you refresh the page.
            </div>
            <Link className="GameButton" to={{pathname: '/game'}}>
              Start Playing
            </Link>
          </div>
        }
      </div> */}
    <div className="HomeContainer">
      <div className="disclaimerAndPlayContainer">
        <Link className="GameButton" to={{pathname: '/game'}}>
          Start Playing
        </Link>
        </div>
      </div>
    </div>
  )
}

export default Home



