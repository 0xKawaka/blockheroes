import { StarknetWindowObject } from "get-starknet"
import "./Register.css"
import { GameAccount } from "../../Types/apiTypes"
import { Sender } from "../../Blockchain/Sender"
import { Getter } from "../../Blockchain/Getter"
import { useState } from "react"
import { Account } from "starknet";

type RegisterProps = {
  localWallet: Account,
  wallet: StarknetWindowObject | undefined,
  handleNewAccount: () => void,
} 

export default function Register({localWallet, wallet, handleNewAccount}: RegisterProps) {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  function handleInputChange(event: any) {
    setUsername(event.target.value)
  }
  async function handleRegister(username: string) {
    setIsRegistering(true);
    await Sender.createAccount(localWallet, username);
    handleNewAccount();
    setIsRegistering(false);
  }

  return(
    <div className="RegisterContainer">
      <div className="RegisterInputTitle">Username</div>
      <input className="RegisterInput" onChange={handleInputChange} value={username}/>
      {!isRegistering &&
        <div className="RegisterButton" onClick={() => handleRegister(username)} >Register</div>
      }
      {isRegistering &&
        <div className="RegisterButton">Registering ...</div>
      }
    </div>
  )
}