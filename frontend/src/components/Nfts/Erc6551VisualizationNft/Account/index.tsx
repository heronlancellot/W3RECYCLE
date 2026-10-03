import * as Sentry from "@sentry/react";
// import { rpcClient } from "src/models/viem";
import { erc6551AccountAbi, erc6551RegistryAbi } from "@tokenbound/sdk-ethers" ;
import { ethers } from "ethers";

// import implementationArtifact from "src/contracts/implementation.json";
import tokenboundArtifact from "src/contracts/tokenbound.json";
import implementationArtifact from "src/contracts/implementation.json";

import { useNetwork } from 'wagmi';

const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY;
const tokenboundAddress = process.env.REACT_APP_TOKENBOUND_ADDRESS;
const implementationAddress = process.env.REACT_APP_IMPLEMENTATION_ADDRESS;
const salt = Number(process.env.REACT_APP_SALT) || 0;

const hasInjectedWallet =
  typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined";

const provider = hasInjectedWallet
  ? new ethers.providers.Web3Provider((window as any).ethereum)
  : null;

const tokenBoundContract = provider
  ? new ethers.Contract(
      tokenboundAddress as string,
      tokenboundArtifact,
      provider.getSigner()
    )
  : null;

const implementationContract = provider
  ? new ethers.Contract(
      tokenboundAddress as string,
      implementationArtifact,
      provider.getSigner()
    )
  : null;

interface GetAccountStatus {
  data?: boolean;
  error?: string;
}

export async function getAccountStatus(account: string): Promise<GetAccountStatus> {
  if (implementationContract == null) {
    return {
      error: `failed getting account status for account: ${account}. Wallet not available.`,
    };
  }
  try {
    console.log("ENTROU NO GETACCOUNTSTATUS")
    const response = (implementationContract.isLocked()) as boolean;
    return { data: response };
  } catch (error) {
    console.error(error);
    Sentry.captureMessage(`getAccountStatus error`, {
      tags: {
        reason: "isLocked",
      },
      extra: {
        prepareError: error,
        account,
      },
    });

    return {
      error: `failed getting account status for account: ${account}. It may not exist yet.`,
    };
  }
}

interface GetAccount {
  data?: string;
  error?: string;
}

export async function getAccount(tokenId: number, contractAddress: string): Promise<GetAccount> {
  const { chain } = useNetwork();
  if (tokenBoundContract == null || chain == null) {
    return { error: "failed getting account because wallet or chain is not available" };
  }
  try {
    console.log("ENTROU NO GETACCOUNT")
    const response = (tokenBoundContract.account(implementationAddress, chain.id, contractAddress, tokenId, salt)) as string;
    console.log("response", response)
    return { data: response };
  } catch (err) {
    console.error(err);
    Sentry.captureMessage(`getAccount error`, {
      tags: {
        reason: "account",
      },
      extra: {
        prepareError: err,
        tokenId,
      },
    });

    return { error: `failed getting account for token $id: {tokenId}` };
  }
}
