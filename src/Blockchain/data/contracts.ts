let AccountsAdrs = "";
let GameAdrs = "";
let ETHAdrs = "";

if(process.env.REACT_APP_ENV == "DEV") {
  AccountsAdrs = "0x057725b5274be5e4ede289aca70e0ef60f19de1130b4afeeb90b006532109d99";
  GameAdrs = "0x00811151934e2220b7cfb58643215433536e2db997ca18c4353b2c86fbd7896b";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "TEST") {
  AccountsAdrs = "0x030a345c7e6db591c91604bcae4033c2543dce3aa51fb4fe295c012da4effc8a";
  GameAdrs = "0x02138e2348c6e477be10b5b7f3a852b949efb66112f039afabaf2de641b79bd9";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "PROD") {
  AccountsAdrs = "0x07f8b470057f47f3c2c4f60db801f4df4a23d4b6969b200876685607e50f6a53";
  GameAdrs = "0x02e798fa9fb684fe729823fa68e594d6885a159ac4261a09f761bc0ff96ed43d";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}


export { AccountsAdrs, GameAdrs, ETHAdrs }