async function getBalance(ownerAdrs:string, walletAccount:string){
  // try {
  //   const contract = new Contract(nftAbi, contractAddress, walletAccount);
  //   const res = await contract.balanceOf(ownerAdrs);
  //   return Number(res.balance.low);
  // }
  // catch(error){
  //   console.log('getBalance ', error.message)
  //   return 0;
  // }
}


// import { Contract, uint256, stark, Provider } from "starknet"

export { getBalance }