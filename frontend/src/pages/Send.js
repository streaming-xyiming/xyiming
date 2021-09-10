import React from 'react';
import useSWR from 'swr';

import {useNear} from '../features/near-connect/useNear';
import {TokenFormatter} from '../lib/formatting.js';
import {CreateStreamForm} from '../features/create-stream/CreateStreamForm';

function SendPage() {
  const near = useNear();
  const profileId = near.auth.signedAccountId;

  async function createStreamClick(values) {
    const {
      owner: ownerId,
      receiver: receiverId,
      autoDeposit,
      comment,
      deposit,
      speed,
      token: tokenName,
    } = values;
    const formatter = TokenFormatter(tokenName);

    console.log('creating', tokenName);
    console.log('token', near.near.fts[tokenName]);

    const res =
      tokenName === 'NEAR'
        ? await near.contractApi.createStream({
            deposit: formatter.toInt(deposit),
            description: comment,
            ownerId: ownerId,
            receiverId: receiverId,
            token: tokenName,
            speed: String(speed),
            autoDepositEnabled: autoDeposit,
          })
        : await near.near.fts[tokenName].contract.ft_transfer_call(
            {
              receiver_id: near.near.contractName,
              amount: deposit,
              memo: 'xyiming transfer',
              msg: JSON.stringify({
                Create: {
                  description: comment,
                  owner_id: ownerId,
                  receiver_id: receiverId,
                  token_name: tokenName,
                  balance: formatter.toInt(deposit),
                  tokens_per_tick: String(speed),
                  auto_deposit_enabled: autoDeposit,
                },
              }),
            },
            '200000000000000',
            1,
          );
  }

  const fetchAccount = async (...args) => {
    try {
      if (!profileId) {
        return [];
      }
      return await near.near.contract.get_account({account_id: profileId});
    } catch (e) {
      console.log('near error', e);
    }
    return [];
  };

  const {data: account} = useSWR(['account', profileId], fetchAccount, {
    errorRetryInterval: 250,
  });

  return (
    <div className="twind-container twind-m-auto twind-px-5 twind-py-12">
      <div className="twind-text-center">
        <h1 className="twind-text-5xl twind-mb-4 twind-text-center">
          Create a stream
        </h1>
        <p className="twind-text-gray">
          Stream your tokens to the receiver directly
        </p>
      </div>
      <CreateStreamForm onSubmit={createStreamClick} />
    </div>
  );
}

export default SendPage;
