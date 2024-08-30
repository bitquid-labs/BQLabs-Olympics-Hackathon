import React, { useEffect, useState } from 'react';

import Button from '@/components/button/button';
import Input from '@/components/input';

import { StakeType } from '@/screen/stake/constants';

import { useReadContracts, useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { InsurancePoolContract, MockERC20Contract } from '@/constant/contracts';
import { InsurancePoolType } from '@/types/main';
import { parseUnits } from 'ethers';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { convertAmount, convertTvl } from '@/lib/utils';
import { toast } from 'react-toastify';

type CurrencyProps = {
  pool: StakeType | undefined;
};

export const Currency = ({ pool }: CurrencyProps): JSX.Element => {

  const [amount, setAmount] = useState<string>('1');
  const [period, setPeriod] = useState<number>(30);
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

  const handleDepositContract = async (poolId: string, day: number) => {
    console.log("Deposit is ", InsurancePoolContract, BigInt(poolId), BigInt(day.toString()));
    const realAmount = convertAmount(amount);
    const params = [
      Number(poolId),
      Number(day)
    ];

    console.log("params ", params)
    console.log("Balance: ", balance, "AMOUNT: ", realAmount);

    try {
      const tx = await writeContractAsync({
        abi: InsurancePoolContract.abi,
        address: InsurancePoolContract.address as `0x${string}`,
        functionName: 'deposit',
        args: params,
        value: parseUnits((amount).toString(), 18)
      });
      toast.success("Deposit Success!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        }
      }
      toast.error(errorMsg);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })


  return (
    <div className='flex w-full flex-col gap-10'>
      <div className='text-[40px] font-bold leading-[50px]'>
        {`Deposit Currency - BTCP`}
      </div>
      <div className='bg-background-100 flex flex-auto flex-col gap-4 rounded-[15px] p-5'>
        <div className='text-2xl font-bold'>Pool Details:</div>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-6'>
            <Input
              className='border-border-200 border px-6'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className='min-w-[100px]'
              onClick={() => setAmount(convertTvl(Number(balance?.value)).toString())}
            >
              Max
            </button>
          </div>
          <div className='grid grid-cols-3 gap-11'>
            <Button variant={ period === 90 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(90)}>
              3 months
            </Button>
            <Button variant={ period === 180 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(180)}>
              6 months
            </Button>
            <Button variant={ period === 365 ? 'primary' : 'outline'} size='lg' className='w-full' onClick={() => setPeriod(365)}>
              1 year
            </Button>
          </div>
          <div className='mb-2 mt-4 flex justify-center'>
            {/* <Button variant='primary' size='lg' className='min-w-[216px] mr-6' onClick={() => handleApproveTokenContract(amount)}>
              Approve Token
            </Button> */}
            <Button variant='primary' size='lg' className='min-w-[216px]'
              // disabled={!isConfirmed}
              onClick={async () => isConnected ? await handleDepositContract(pool?.poolId ? pool?.poolId : '1', period) : open()}
            >
              {isConnected ? 'Deposit BTCP' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
