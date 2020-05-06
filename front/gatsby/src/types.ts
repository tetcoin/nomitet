// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidatorPrefs } from '@polkadot/types/interfaces';
import BN from 'bn.js';

export interface Nomination {
  validatorController: string;
  validatorStash: string;
  nominatorController: string;
  nominatorStash: string;
  stakedAmount: string;
}

export interface Validator {
  controller: string;
  stash: string;
  preferences: ValidatorPrefs;
}

export interface OfflineValidator {
  validatorId: string;
}

export interface TableRowData {
  [validatorStash: string]: {
    validatorController: string;
    validatorStash: string;
    nominators: Set<string>; // by stash, deduped
    stakedAmount: BN; // sum up all the staked amounts
    preferences?: ValidatorPrefs,
    wasOfflineThisSession: boolean;
  };
}