import React, { useState, useEffect } from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';
import { parseUnits } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import {
  useReadContracts,
  useWriteContract,
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useConnect,
} from 'wagmi';
import { convertAmount, convertTvl } from '@/lib/utils';
import { GovContract, MockERC20Contract } from '@/constant/contracts';
import Grid from '~/svg/grid.svg';
import { addTokenToMetaMask } from '@/hooks/global';
import { toast } from 'react-toastify';

export const Stake = (): JSX.Element => {
  const [amount, setAmount] = useState<string>('10');
  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const {
    data: hash,
    isPending,
    writeContractAsync,
  } = useWriteContract({
    mutation: {
      async onSuccess(data) {
        console.log(1);
      },
      onError(error) {
        console.log(1, error);
      },
    },
  });

  const handleWriteContract = async (amount: number) => {
    const params = [`${address}`, parseUnits(amount.toString(), 18)];

    console.log('wallet address is: ', `${address}`);
    try {
      const tx = await writeContractAsync({
        ...MockERC20Contract,
        functionName: 'mint',
        args: params,
      });
      toast.success("Faucet Sent!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        }
      }
      toast.error(errorMsg);
    }
  };

    

  // const handleDepositContract = async (poolId: string, day: number) => {
  //   console.log(
  //     'Deposit is ',
  //     GovContract,
  //     BigInt(poolId),
  //     BigInt(day.toString())
  //   );
  //   const realAmount = convertAmount(amount);
  //   const params = [Number(poolId), Number(day)];

  //   console.log('params ', params);
  //   console.log('Balance: ', balance, 'AMOUNT: ', realAmount);

  //   try {
  //     const tx = await writeContractAsync({
  //       abi: GovContract.abi,
  //       address: GovContract.address as `0x${string}`,
  //       functionName: 'deposit',
  //       args: params,
  //       value: parseUnits(amount.toString(), 18),
  //     });
  //   } catch (e) {
  //     console.log('error:', e);
  //   }
  // };

  const handleAddNetworkAndToken = async () => {
    try {
      await addTokenToMetaMask(); // Then add the token
      toast.success("BQ Token Added on Metamask!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        }
      }
      toast.error(errorMsg);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className='bg-background-100 relative flex max-w-[570px] flex-auto flex-col gap-4 rounded-[15px] bg-gradient-to-br from-[#FCC608] to-[#FFDC5EA1]/45 p-5'>
      <Grid className='absolute inset-0 h-[100px] w-[500px] ' />
      <div className='flex items-center justify-around gap-6'>
        <div className='text-3xl font-bold text-black'>BQ Token Faucet</div>
        {/* <div className='flex items-center gap-6'>
          <Input className='border-border-200 border px-6' 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
          />
          <button className='min-w-[100px]'
              onClick={() => setAmount(convertTvl(Number(balance?.value)).toString())}
          >Max</button>
        </div> */}
      </div>
      <div className='mb-2 mt-4 flex justify-center'>
        <Button
          variant='primary'
          size='lg'
          className='min-w-[216px]'
          onClick={async () =>
            isConnected ? await handleWriteContract(10) : open()
          }
        >
          {isConnected ? 'Claim Now' : 'Connect Wallet'}
        </Button>
      </div>
      <div className='justify-center mb-2 flex'>
        <Button
          variant='primary'
          size='lg'
          className='min-w-[216px]'
          onClick={handleAddNetworkAndToken}
        >
          {isConnected ? 'Add Token To Metamask' : 'Connect Wallet'}
        </Button>
      </div>
    </div>
  );
};
