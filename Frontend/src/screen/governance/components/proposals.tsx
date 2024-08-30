import Link from 'next/link';
import React, { useEffect } from 'react';

import Button from '@/components/button/button';

import { ProposalDetail, TempProposalType } from '@/screen/governance/constants';
import { ProposalType } from '@/types/main';
import { convertTempProposalTypeData, convertTvl } from '@/lib/utils';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useReadContracts, useWriteContract, useAccount, useBalance, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { GovContract } from '@/constant/contracts';
import { toast } from 'react-toastify';
import { useUserVoted } from '@/hooks/contracts/governance/useUserVoted';

type CurrencyProps = {
  proposals: ProposalType[] | undefined;
};

export const Proposals = ({ proposals }: CurrencyProps): JSX.Element => {
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

  const handleAcceptWriteContract = async (proposalId: number) => {
    const params = [
      proposalId,
      true
    ];

    console.log('ProposalId: ', proposalId);
    try {
      const tx = await writeContractAsync({
        ...GovContract,
        functionName: 'vote',
        args: params,
      });
      toast.success("Accept Vote Sucess!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        } else {
          errorMsg = "Already voted";
        }
      } else {
        errorMsg = "Unexpected error";
      }

      toast.error(errorMsg);
    }
  }

  const handleDeclineWriteContract = async (proposalId: number) => {
    const params = [
      proposalId,
      false
    ];

    console.log('ProposalId: ', proposalId);
    try {
      const tx = await writeContractAsync({
        ...GovContract,
        functionName: 'vote',
        args: params,
      });  
      toast.success("Decline Vote Sucess!");
    } catch (err) {
      let errorMsg = "";
      if (err instanceof Error) {
        if (err.message.includes("User denied transaction signature")) {
          errorMsg = "User denied transaction signature";
        } else {
          errorMsg = "Already voted";
        }
      } else {
        errorMsg = "Unexpected error";
      }
      toast.error(errorMsg);
    }
  }

  return (
    <div className='flex w-full flex-col gap-6'>
      {convertTempProposalTypeData(proposals ? proposals : []).map((proposal, index) => (
        <div
          key={index}
          className='bg-background-100 flex w-full gap-5 rounded-[15px] p-4'
        >
          {Object.keys(proposal).map((key, i) => (
            <div key={i} className='flex w-full flex-col items-center gap-6'>
              <div className='border-border-200 w-full rounded-full border px-5 py-3 text-center'>
                {ProposalDetail[key as keyof typeof ProposalDetail]}
              </div>
              <div className='font-semibold'>
                {key === 'incentive' && (
                  <div>100 BQ</div>
                )}
                {key !== 'incentive' && proposal[key as keyof typeof proposal]}
              </div>
            </div>
          ))}
          <div className='flex w-full flex-col gap-[13px]'>
            <Button variant='primary' size='lg' className='w-full' onClick={() => handleAcceptWriteContract(index+1)}>
              Accept
            </Button>
            <Button
              variant='gradient-outline'
              size='lg'
              className='bg-background-100 w-full'
              onClick={() => handleDeclineWriteContract(index+1)}
            >
              Decline
            </Button>
          </div>
          {/* <div className='flex w-full items-end justify-center gap-6'>
            <Link
              href='/'
              className='font-semibold underline underline-offset-4'
            >
              Details
            </Link>
          </div> */}
        </div>
      ))}
    </div>
  );
};
