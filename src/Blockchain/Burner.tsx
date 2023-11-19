import {
  Account,
  CallData,
  ec,
  hash,
  RpcProvider,
  stark,
  TransactionFinalityStatus,
} from "starknet";
import Storage from "../Cookies/storage";
import { ETHAdrs } from "../Blockchain/data/contracts";
const PREFUND_AMOUNT = "0x8AC7230489E80000"; // 10ETH

const provider = new RpcProvider({
  nodeUrl: process.env.REACT_APP_RPC_ENDPOINT!,
});

type BurnerStorage = {
  [address: string]: {
    privateKey: string;
    publicKey: string;
    deployTx: string;
    active: boolean;
  };
};

const admin = new Account(
  provider,
  process.env.REACT_APP_PUBLIC_ADMIN_ADDRESS!,
  process.env.REACT_APP_PUBLIC_ADMIN_PRIVATE_KEY!,
);

export default abstract class Burner {
  public static getFirstActiveBurner(): Account | undefined {
    const storage: BurnerStorage = Storage.get("burners");
    if (storage) {
      // set active account
      for (let address in storage) {
        if (storage[address].active) {
          const burner = new Account(
            provider,
            address,
            storage[address].privateKey,
          );
          return burner;
        }
      }
    }
    return undefined;
  }

  public static async createBurnerAccount() {
    const privateKey = stark.randomAddress();
    
    const publicKey = ec.starkCurve.getStarkKey(privateKey);
    
    const address = hash.calculateContractAddressFromHash(
      publicKey,
      process.env.REACT_APP_PUBLIC_ACCOUNT_CLASS_HASH!,
      CallData.compile({ publicKey }),
      0,
    );
    // console.log("address: ", publicKey);

    await prefundAccount(address, admin);

    // deploy burner
    const burner = new Account(provider, address, privateKey);
    const { transaction_hash: deployTx } = await burner.deployAccount(
      {
        classHash: process.env.REACT_APP_PUBLIC_ACCOUNT_CLASS_HASH!,
        constructorCalldata: CallData.compile({ publicKey }),
        addressSalt: publicKey,
      },
      { maxFee: 0 },
    );
    // save burner
    let storage = Storage.get("burners") || {};
    for (let address in storage) {
      storage[address].active = false;
    }
    storage[address] = {
      privateKey,
      publicKey,
      deployTx,
      active: true,
    };
    Storage.set("burners", storage);
    console.log("burner created: ", address);

    return burner;
  }
}

const prefundAccount = async (address: string, account: Account) => {
  const { transaction_hash } = await account.execute(
    {
      contractAddress: ETHAdrs,
      entrypoint: "transfer",
      calldata: CallData.compile([address, PREFUND_AMOUNT, "0x0"]),
    },
    undefined,
    { maxFee: 0 },
  );

  return await account.waitForTransaction(transaction_hash, {
    retryInterval: 200,
    successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
  });
};

// export const useBurner = () => {
//   const [account, setAccount] = useState<Account>();
//   const [isDeploying, setIsDeploying] = useState(false);

//   // init
//   useEffect(() => {
//     const storage: BurnerStorage = Storage.get("burners");
//     if (storage) {
//       // check one to see if exists, perhaps appchain restarted
//       const firstAddr = Object.keys(storage)[0];
//       admin.getTransactionReceipt(storage[firstAddr].deployTx).catch(() => {
//         setAccount(undefined);
//         Storage.remove("burners");
//         //throw new Error("burners not deployed, chain may have restarted");
//         console.log("burners not deployed, resetting local storage");
//         return;
//       });

//       // set active account
//       for (let address in storage) {
//         if (storage[address].active) {
//           const burner = new Account(
//             provider,
//             address,
//             storage[address].privateKey,
//           );
//           setAccount(burner);
//           return;
//         }
//       }
//     }
//   }, []);

//   const list = useCallback(() => {
//     let storage = Storage.get("burners") || {};
//     return Object.keys(storage).map((address) => {
//       return {
//         address,
//         active: storage[address].active,
//       };
//     });
//   }, []);

//   const select = useCallback((address: string) => {
//     let storage = Storage.get("burners") || {};
//     if (!storage[address]) {
//       throw new Error("burner not found");
//     }

//     for (let addr in storage) {
//       storage[addr].active = false;
//     }
//     storage[address].active = true;

//     Storage.set("burners", storage);
//     const burner = new Account(provider, address, storage[address].privateKey);
//     setAccount(burner);
//   }, []);

//   const create = useCallback(async () => {
//     setIsDeploying(true);
//     const privateKey = stark.randomAddress();
//     const publicKey = ec.starkCurve.getStarkKey(privateKey);
//     const address = hash.calculateContractAddressFromHash(
//       publicKey,
//       process.env.REACT_APP_PUBLIC_ACCOUNT_CLASS_HASH!,
//       CallData.compile({ publicKey }),
//       0,
//     );

//     await prefundAccount(address, admin);

//     // deploy burner
//     const burner = new Account(provider, address, privateKey);
//     const { transaction_hash: deployTx } = await burner.deployAccount(
//       {
//         classHash: process.env.REACT_APP_PUBLIC_ACCOUNT_CLASS_HASH!,
//         constructorCalldata: CallData.compile({ publicKey }),
//         addressSalt: publicKey,
//       },
//       { maxFee: 0 },
//     );

//     // save burner
//     let storage = Storage.get("burners") || {};
//     for (let address in storage) {
//       storage[address].active = false;
//     }
//     storage[address] = {
//       privateKey,
//       publicKey,
//       deployTx,
//       active: true,
//     };

//     setAccount(burner);
//     setIsDeploying(false);
//     Storage.set("burners", storage);
//     console.log("burner created: ", address);

//     return address;
//   }, []);

//   return {
//     list,
//     select,
//     create,
//     account,
//     isDeploying,
//   };
// };
