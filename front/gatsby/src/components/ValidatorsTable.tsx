// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { ApiRx } from '@polkadot/api';
import {
  ValidatorPrefs
} from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import { Spinner } from '@substrate/design-system';
import { FadedText, Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import shortid from 'shortid';

import { AddressSummary, Table, Tb, Tc, Th, Thead, Tr } from '../components';
import { addToCart, joinDataIntoTableRow } from '../util';
import { CURRENT_NOMINATIONS, CURRENT_VALIDATORS, OFFLINE_VALIDATORS } from '../util/graphql';
import { TableRowData } from '../types';

interface Props {
  api: ApiRx;
  currentSession: number;
}

const ValidatorsTable = (props: Props): React.ReactElement => {
  const { api, currentSession } = props;

  const [tableData, setTableData] = useState<TableRowData>();

  const currentNominations = useQuery(CURRENT_NOMINATIONS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  const currentOffline = useQuery(OFFLINE_VALIDATORS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  const currentValidators = useQuery(CURRENT_VALIDATORS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  useEffect(() => {
    if (
      api &&
      currentNominations &&
      currentNominations.data &&
      currentOffline &&
      currentOffline.data &&
      currentValidators &&
      currentValidators.data
    ) {
      const result: TableRowData = joinDataIntoTableRow(
        api,
        currentNominations.data.nominations,
        currentOffline.data.offlineValidators,
        currentValidators.data.validators
      );

      setTableData(result);
    }
  }, [api, currentNominations, currentOffline]);

  const handleAddToCart = ({
    currentTarget: {
      dataset: { stash },
    },
  }: React.MouseEvent<HTMLButtonElement>): void => {
    if (stash) {
      addToCart(stash);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Was Offline This Session</Th>
          <Th>Validator Stash</Th>
          <Th>Validator Controller</Th>
          <Th>Nominators</Th>
          <Th>Staked Amount</Th>
          <Th>Commission</Th>
          <Th> </Th>
        </Tr>
      </Thead>
      <Tb>
        {tableData ? (
          Object.values(tableData).map(
            ({
              validatorController,
              validatorStash,
              nominators,
              stakedAmount,
              preferences,
              wasOfflineThisSession,
            }) => {
              return (
                <Tr key={shortid.generate()}>
                  <Tc>
                    <FadedText>
                      {JSON.stringify(wasOfflineThisSession)}
                    </FadedText>
                  </Tc>
                  <Tc>
                    <AddressSummary
                      address={validatorStash}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Tc>
                  <Tc>
                    <AddressSummary
                      address={validatorController}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Tc>
                  <Tc>{nominators.size}</Tc>
                  <Tc>{formatBalance(stakedAmount.toString())}</Tc>
                  <Tc>
                  <FadedText>
                    {
                      preferences
                        ? formatBalance(api.createType('ValidatorPrefs', preferences)
                        .commission.toString())
                        : '0'
                    }
                  </FadedText>
                </Tc>
                  <Tc>
                    <Icon
                      onClick={handleAddToCart}
                      data-stash={validatorStash}
                      name='add to cart'
                    />
                  </Tc>
                </Tr>
              );
            }
          )
        ) : (
          <Spinner inline />
        )}
      </Tb>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
