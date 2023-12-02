let AccountsAdrs = "";
let GameAdrs = "";
let ETHAdrs = "";

if(process.env.REACT_APP_ENV == "DEV") {
  AccountsAdrs = "0x03ec2325aa97ce10103b49b14e7ad5098ee0e06236606c95d2e5eaa6d65d34cd";
  GameAdrs = "0x00811151934e2220b7cfb58643215433536e2db997ca18c4353b2c86fbd7896b";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "TEST") {
  AccountsAdrs = "0x030a345c7e6db591c91604bcae4033c2543dce3aa51fb4fe295c012da4effc8a";
  GameAdrs = "0x02138e2348c6e477be10b5b7f3a852b949efb66112f039afabaf2de641b79bd9";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}
else if(process.env.REACT_APP_ENV == "PROD") {
  AccountsAdrs = "0x030a345c7e6db591c91604bcae4033c2543dce3aa51fb4fe295c012da4effc8a";
  GameAdrs = "0x02138e2348c6e477be10b5b7f3a852b949efb66112f039afabaf2de641b79bd9";
  ETHAdrs = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
}


export { AccountsAdrs, GameAdrs, ETHAdrs }