import React, { useState, useEffect } from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';
import { parseUnits } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useReadContracts, useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { convertAmount, convertTvl } from '@/lib/utils';
import { GovContract, MockERC20Contract } from '@/constant/contracts';

export const Stake = (): JSX.Element => {

  const [amount, setAmount] = useState<string>('10');
  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });


  const {
    data: hash,
    isPending,
    writeContractAsync
  } = useWriteContract({
    mutation: {
      async onSuccess(data) {
        console.log(1)        
      },
      onError(error) {
        console.log(1, error)   
      }
    }
  });

  const handleWriteContract = async (amount: number) => {
    const params = [
      `${address}`,
      parseUnits((amount).toString(), 18)
    ];

    console.log('wallet address is: ', `${address}`);
    try {
      const tx = await writeContractAsync({
        ...MockERC20Contract,
        functionName: 'mint',
        args: params,
      });  
    } catch (e) {
      console.log('error:', e);
    }
  }

  const handleDepositContract = async (poolId: string, day: number) => {
    console.log("Deposit is ", GovContract, BigInt(poolId), BigInt(day.toString()));
    const realAmount = convertAmount(amount);
    const params = [
      Number(poolId),
      Number(day)
    ];

    console.log("params ", params)
    console.log("Balance: ", balance, "AMOUNT: ", realAmount);

    try {
      const tx = await writeContractAsync({
        abi: GovContract.abi,
        address: GovContract.address as `0x${string}`,
        functionName: 'deposit',
        args: params,
        value: parseUnits((amount).toString(), 18)
      });
      // console.log(GovContract.address as `0x${string}`, tx)
    } catch (e) {
      console.log('error:', e);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  return (
    <div className='bg-background-100 flex max-w-[570px] flex-auto flex-col gap-4 rounded-[15px] p-5'>
      <div className='flex flex-col gap-6'>
      <div className='text-2xl font-bold'>BQ Token Faucet:</div>
        {/* <div className='flex items-center gap-6'>
          <Input className='border-border-200 border px-6' 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
          />
          <button className='min-w-[100px]'
              onClick={() => setAmount(convertTvl(Number(balance?.value)).toString())}
          >Max</button>
        </div> */}
        <div className='mb-2 mt-4 flex justify-center'>
          <Button variant='primary' size='lg' className='min-w-[216px]'
            onClick={async () => isConnected ? await handleWriteContract(10) : open()}
          >
          {isConnected ? 'Claim Now' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  );
};
