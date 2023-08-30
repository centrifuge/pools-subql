// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::AccountData<Balance>>
   **/
  FrameSystemAccountInfo: {
    nonce: 'u32',
    consumers: 'u32',
    providers: 'u32',
    sufficients: 'u32',
    data: 'PalletBalancesAccountData'
  },
  /**
   * Lookup5: pallet_balances::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    miscFrozen: 'u128',
    feeFrozen: 'u128'
  },
  /**
   * Lookup7: frame_support::dispatch::PerDispatchClass<sp_weights::weight_v2::Weight>
   **/
  FrameSupportDispatchPerDispatchClassWeight: {
    normal: 'SpWeightsWeightV2Weight',
    operational: 'SpWeightsWeightV2Weight',
    mandatory: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup8: sp_weights::weight_v2::Weight
   **/
  SpWeightsWeightV2Weight: {
    refTime: 'Compact<u64>',
    proofSize: 'Compact<u64>'
  },
  /**
   * Lookup13: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>'
  },
  /**
   * Lookup15: sp_runtime::generic::digest::DigestItem
   **/
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: 'Bytes',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Consensus: '([u8;4],Bytes)',
      Seal: '([u8;4],Bytes)',
      PreRuntime: '([u8;4],Bytes)',
      __Unused7: 'Null',
      RuntimeEnvironmentUpdated: 'Null'
    }
  },
  /**
   * Lookup18: frame_system::EventRecord<development_runtime::RuntimeEvent, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>'
  },
  /**
   * Lookup20: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      ExtrinsicFailed: {
        dispatchError: 'SpRuntimeDispatchError',
        dispatchInfo: 'FrameSupportDispatchDispatchInfo',
      },
      CodeUpdated: 'Null',
      NewAccount: {
        account: 'AccountId32',
      },
      KilledAccount: {
        account: 'AccountId32',
      },
      Remarked: {
        _alias: {
          hash_: 'hash',
        },
        sender: 'AccountId32',
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup21: frame_support::dispatch::DispatchInfo
   **/
  FrameSupportDispatchDispatchInfo: {
    weight: 'SpWeightsWeightV2Weight',
    class: 'FrameSupportDispatchDispatchClass',
    paysFee: 'FrameSupportDispatchPays'
  },
  /**
   * Lookup22: frame_support::dispatch::DispatchClass
   **/
  FrameSupportDispatchDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory']
  },
  /**
   * Lookup23: frame_support::dispatch::Pays
   **/
  FrameSupportDispatchPays: {
    _enum: ['Yes', 'No']
  },
  /**
   * Lookup24: sp_runtime::DispatchError
   **/
  SpRuntimeDispatchError: {
    _enum: {
      Other: 'Null',
      CannotLookup: 'Null',
      BadOrigin: 'Null',
      Module: 'SpRuntimeModuleError',
      ConsumerRemaining: 'Null',
      NoProviders: 'Null',
      TooManyConsumers: 'Null',
      Token: 'SpRuntimeTokenError',
      Arithmetic: 'SpArithmeticArithmeticError',
      Transactional: 'SpRuntimeTransactionalError',
      Exhausted: 'Null',
      Corruption: 'Null',
      Unavailable: 'Null'
    }
  },
  /**
   * Lookup25: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]'
  },
  /**
   * Lookup26: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['NoFunds', 'WouldDie', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported']
  },
  /**
   * Lookup27: sp_arithmetic::ArithmeticError
   **/
  SpArithmeticArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero']
  },
  /**
   * Lookup28: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer']
  },
  /**
   * Lookup29: cumulus_pallet_parachain_system::pallet::Event<T>
   **/
  CumulusPalletParachainSystemEvent: {
    _enum: {
      ValidationFunctionStored: 'Null',
      ValidationFunctionApplied: {
        relayChainBlockNum: 'u32',
      },
      ValidationFunctionDiscarded: 'Null',
      UpgradeAuthorized: {
        codeHash: 'H256',
      },
      DownwardMessagesReceived: {
        count: 'u32',
      },
      DownwardMessagesProcessed: {
        weightUsed: 'SpWeightsWeightV2Weight',
        dmqHead: 'H256',
      },
      UpwardMessageSent: {
        messageHash: 'Option<[u8;32]>'
      }
    }
  },
  /**
   * Lookup31: pallet_balances::pallet::Event<T, I>
   **/
  PalletBalancesEvent: {
    _enum: {
      Endowed: {
        account: 'AccountId32',
        freeBalance: 'u128',
      },
      DustLost: {
        account: 'AccountId32',
        amount: 'u128',
      },
      Transfer: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      BalanceSet: {
        who: 'AccountId32',
        free: 'u128',
        reserved: 'u128',
      },
      Reserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Unreserved: {
        who: 'AccountId32',
        amount: 'u128',
      },
      ReserveRepatriated: {
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
        destinationStatus: 'FrameSupportTokensMiscBalanceStatus',
      },
      Deposit: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Withdraw: {
        who: 'AccountId32',
        amount: 'u128',
      },
      Slashed: {
        who: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup32: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved']
  },
  /**
   * Lookup33: pallet_transaction_payment::pallet::Event<T>
   **/
  PalletTransactionPaymentEvent: {
    _enum: {
      TransactionFeePaid: {
        who: 'AccountId32',
        actualFee: 'u128',
        tip: 'u128'
      }
    }
  },
  /**
   * Lookup34: pallet_collator_selection::pallet::Event<T>
   **/
  PalletCollatorSelectionEvent: {
    _enum: {
      NewInvulnerables: {
        invulnerables: 'Vec<AccountId32>',
      },
      NewDesiredCandidates: {
        desiredCandidates: 'u32',
      },
      NewCandidacyBond: {
        bondAmount: 'u128',
      },
      CandidateAdded: {
        accountId: 'AccountId32',
        deposit: 'u128',
      },
      CandidateRemoved: {
        accountId: 'AccountId32'
      }
    }
  },
  /**
   * Lookup36: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32'
      }
    }
  },
  /**
   * Lookup37: pallet_multisig::pallet::Event<T>
   **/
  PalletMultisigEvent: {
    _enum: {
      NewMultisig: {
        approving: 'AccountId32',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigApproval: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
      },
      MultisigExecuted: {
        approving: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MultisigCancelled: {
        cancelling: 'AccountId32',
        timepoint: 'PalletMultisigTimepoint',
        multisig: 'AccountId32',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup38: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32'
  },
  /**
   * Lookup41: pallet_proxy::pallet::Event<T>
   **/
  PalletProxyEvent: {
    _enum: {
      ProxyExecuted: {
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      PureCreated: {
        pure: 'AccountId32',
        who: 'AccountId32',
        proxyType: 'DevelopmentRuntimeProxyType',
        disambiguationIndex: 'u16',
      },
      Announced: {
        real: 'AccountId32',
        proxy: 'AccountId32',
        callHash: 'H256',
      },
      ProxyAdded: {
        delegator: 'AccountId32',
        delegatee: 'AccountId32',
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32',
      },
      ProxyRemoved: {
        delegator: 'AccountId32',
        delegatee: 'AccountId32',
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32'
      }
    }
  },
  /**
   * Lookup42: development_runtime::ProxyType
   **/
  DevelopmentRuntimeProxyType: {
    _enum: ['Any', 'NonTransfer', 'Governance', '_Staking', 'NonProxy', 'Borrow', 'Invest', 'ProxyManagement', 'KeystoreManagement', 'PodOperation', 'PodAuth', 'PermissionManagement']
  },
  /**
   * Lookup44: pallet_utility::pallet::Event
   **/
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: {
        index: 'u32',
        error: 'SpRuntimeDispatchError',
      },
      BatchCompleted: 'Null',
      BatchCompletedWithErrors: 'Null',
      ItemCompleted: 'Null',
      ItemFailed: {
        error: 'SpRuntimeDispatchError',
      },
      DispatchedAs: {
        result: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup45: pallet_scheduler::pallet::Event<T>
   **/
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: {
        when: 'u32',
        index: 'u32',
      },
      Canceled: {
        when: 'u32',
        index: 'u32',
      },
      Dispatched: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallUnavailable: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PeriodicFailed: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>',
      },
      PermanentlyOverweight: {
        task: '(u32,u32)',
        id: 'Option<[u8;32]>'
      }
    }
  },
  /**
   * Lookup47: pallet_collective::pallet::Event<T, I>
   **/
  PalletCollectiveEvent: {
    _enum: {
      Proposed: {
        account: 'AccountId32',
        proposalIndex: 'u32',
        proposalHash: 'H256',
        threshold: 'u32',
      },
      Voted: {
        account: 'AccountId32',
        proposalHash: 'H256',
        voted: 'bool',
        yes: 'u32',
        no: 'u32',
      },
      Approved: {
        proposalHash: 'H256',
      },
      Disapproved: {
        proposalHash: 'H256',
      },
      Executed: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      MemberExecuted: {
        proposalHash: 'H256',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      Closed: {
        proposalHash: 'H256',
        yes: 'u32',
        no: 'u32'
      }
    }
  },
  /**
   * Lookup49: pallet_elections_phragmen::pallet::Event<T>
   **/
  PalletElectionsPhragmenEvent: {
    _enum: {
      NewTerm: {
        newMembers: 'Vec<(AccountId32,u128)>',
      },
      EmptyTerm: 'Null',
      ElectionError: 'Null',
      MemberKicked: {
        member: 'AccountId32',
      },
      Renounced: {
        candidate: 'AccountId32',
      },
      CandidateSlashed: {
        candidate: 'AccountId32',
        amount: 'u128',
      },
      SeatHolderSlashed: {
        seatHolder: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup52: pallet_democracy::pallet::Event<T>
   **/
  PalletDemocracyEvent: {
    _enum: {
      Proposed: {
        proposalIndex: 'u32',
        deposit: 'u128',
      },
      Tabled: {
        proposalIndex: 'u32',
        deposit: 'u128',
      },
      ExternalTabled: 'Null',
      Started: {
        refIndex: 'u32',
        threshold: 'PalletDemocracyVoteThreshold',
      },
      Passed: {
        refIndex: 'u32',
      },
      NotPassed: {
        refIndex: 'u32',
      },
      Cancelled: {
        refIndex: 'u32',
      },
      Delegated: {
        who: 'AccountId32',
        target: 'AccountId32',
      },
      Undelegated: {
        account: 'AccountId32',
      },
      Vetoed: {
        who: 'AccountId32',
        proposalHash: 'H256',
        until: 'u32',
      },
      Blacklisted: {
        proposalHash: 'H256',
      },
      Voted: {
        voter: 'AccountId32',
        refIndex: 'u32',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      Seconded: {
        seconder: 'AccountId32',
        propIndex: 'u32',
      },
      ProposalCanceled: {
        propIndex: 'u32'
      }
    }
  },
  /**
   * Lookup53: pallet_democracy::vote_threshold::VoteThreshold
   **/
  PalletDemocracyVoteThreshold: {
    _enum: ['SuperMajorityApprove', 'SuperMajorityAgainst', 'SimpleMajority']
  },
  /**
   * Lookup54: pallet_democracy::vote::AccountVote<Balance>
   **/
  PalletDemocracyVoteAccountVote: {
    _enum: {
      Standard: {
        vote: 'Vote',
        balance: 'u128',
      },
      Split: {
        aye: 'u128',
        nay: 'u128'
      }
    }
  },
  /**
   * Lookup56: pallet_identity::pallet::Event<T>
   **/
  PalletIdentityEvent: {
    _enum: {
      IdentitySet: {
        who: 'AccountId32',
      },
      IdentityCleared: {
        who: 'AccountId32',
        deposit: 'u128',
      },
      IdentityKilled: {
        who: 'AccountId32',
        deposit: 'u128',
      },
      JudgementRequested: {
        who: 'AccountId32',
        registrarIndex: 'u32',
      },
      JudgementUnrequested: {
        who: 'AccountId32',
        registrarIndex: 'u32',
      },
      JudgementGiven: {
        target: 'AccountId32',
        registrarIndex: 'u32',
      },
      RegistrarAdded: {
        registrarIndex: 'u32',
      },
      SubIdentityAdded: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128',
      },
      SubIdentityRemoved: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128',
      },
      SubIdentityRevoked: {
        sub: 'AccountId32',
        main: 'AccountId32',
        deposit: 'u128'
      }
    }
  },
  /**
   * Lookup57: pallet_vesting::pallet::Event<T>
   **/
  PalletVestingEvent: {
    _enum: {
      VestingUpdated: {
        account: 'AccountId32',
        unvested: 'u128',
      },
      VestingCompleted: {
        account: 'AccountId32'
      }
    }
  },
  /**
   * Lookup58: pallet_treasury::pallet::Event<T, I>
   **/
  PalletTreasuryEvent: {
    _enum: {
      Proposed: {
        proposalIndex: 'u32',
      },
      Spending: {
        budgetRemaining: 'u128',
      },
      Awarded: {
        proposalIndex: 'u32',
        award: 'u128',
        account: 'AccountId32',
      },
      Rejected: {
        proposalIndex: 'u32',
        slashed: 'u128',
      },
      Burnt: {
        burntFunds: 'u128',
      },
      Rollover: {
        rolloverBalance: 'u128',
      },
      Deposit: {
        value: 'u128',
      },
      SpendApproved: {
        proposalIndex: 'u32',
        amount: 'u128',
        beneficiary: 'AccountId32',
      },
      UpdatedInactive: {
        reactivated: 'u128',
        deactivated: 'u128'
      }
    }
  },
  /**
   * Lookup59: pallet_uniques::pallet::Event<T, I>
   **/
  PalletUniquesEvent: {
    _enum: {
      Created: {
        collection: 'u64',
        creator: 'AccountId32',
        owner: 'AccountId32',
      },
      ForceCreated: {
        collection: 'u64',
        owner: 'AccountId32',
      },
      Destroyed: {
        collection: 'u64',
      },
      Issued: {
        collection: 'u64',
        item: 'u128',
        owner: 'AccountId32',
      },
      Transferred: {
        collection: 'u64',
        item: 'u128',
        from: 'AccountId32',
        to: 'AccountId32',
      },
      Burned: {
        collection: 'u64',
        item: 'u128',
        owner: 'AccountId32',
      },
      Frozen: {
        collection: 'u64',
        item: 'u128',
      },
      Thawed: {
        collection: 'u64',
        item: 'u128',
      },
      CollectionFrozen: {
        collection: 'u64',
      },
      CollectionThawed: {
        collection: 'u64',
      },
      OwnerChanged: {
        collection: 'u64',
        newOwner: 'AccountId32',
      },
      TeamChanged: {
        collection: 'u64',
        issuer: 'AccountId32',
        admin: 'AccountId32',
        freezer: 'AccountId32',
      },
      ApprovedTransfer: {
        collection: 'u64',
        item: 'u128',
        owner: 'AccountId32',
        delegate: 'AccountId32',
      },
      ApprovalCancelled: {
        collection: 'u64',
        item: 'u128',
        owner: 'AccountId32',
        delegate: 'AccountId32',
      },
      ItemStatusChanged: {
        collection: 'u64',
      },
      CollectionMetadataSet: {
        collection: 'u64',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      CollectionMetadataCleared: {
        collection: 'u64',
      },
      MetadataSet: {
        collection: 'u64',
        item: 'u128',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      MetadataCleared: {
        collection: 'u64',
        item: 'u128',
      },
      Redeposited: {
        collection: 'u64',
        successfulItems: 'Vec<u128>',
      },
      AttributeSet: {
        collection: 'u64',
        maybeItem: 'Option<u128>',
        key: 'Bytes',
        value: 'Bytes',
      },
      AttributeCleared: {
        collection: 'u64',
        maybeItem: 'Option<u128>',
        key: 'Bytes',
      },
      OwnershipAcceptanceChanged: {
        who: 'AccountId32',
        maybeCollection: 'Option<u64>',
      },
      CollectionMaxSupplySet: {
        collection: 'u64',
        maxSupply: 'u32',
      },
      ItemPriceSet: {
        collection: 'u64',
        item: 'u128',
        price: 'u128',
        whitelistedBuyer: 'Option<AccountId32>',
      },
      ItemPriceRemoved: {
        collection: 'u64',
        item: 'u128',
      },
      ItemBought: {
        collection: 'u64',
        item: 'u128',
        price: 'u128',
        seller: 'AccountId32',
        buyer: 'AccountId32'
      }
    }
  },
  /**
   * Lookup66: pallet_preimage::pallet::Event<T>
   **/
  PalletPreimageEvent: {
    _enum: {
      Noted: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Requested: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Cleared: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup67: pallet_fees::pallet::Event<T>
   **/
  PalletFeesEvent: {
    _enum: {
      FeeChanged: {
        key: 'CfgTypesFeeKeysFeeKey',
        fee: 'u128',
      },
      FeeToAuthor: {
        from: 'AccountId32',
        balance: 'u128',
      },
      FeeToBurn: {
        from: 'AccountId32',
        balance: 'u128',
      },
      FeeToTreasury: {
        from: 'AccountId32',
        balance: 'u128'
      }
    }
  },
  /**
   * Lookup68: cfg_types::fee_keys::FeeKey
   **/
  CfgTypesFeeKeysFeeKey: {
    _enum: ['AnchorsCommit', 'AnchorsPreCommit', 'BridgeNativeTransfer', 'NftProofValidation', 'AllowanceCreation', 'OrderBookOrderCreation']
  },
  /**
   * Lookup69: pallet_claims::pallet::Event<T>
   **/
  PalletClaimsEvent: {
    _enum: {
      Claimed: {
        accountId: 'AccountId32',
        amount: 'u128',
      },
      RootHashStored: {
        rootHash: 'H256'
      }
    }
  },
  /**
   * Lookup70: pallet_crowdloan_claim::pallet::Event<T>
   **/
  PalletCrowdloanClaimEvent: {
    _enum: {
      ClaimPalletInitialized: 'Null',
      RewardClaimed: '(AccountId32,AccountId32,u128)',
      LockedAtUpdated: 'u32',
      ContributionsRootUpdated: 'H256',
      CrowdloanTrieIndexUpdated: 'u32',
      LeaseStartUpdated: 'u32',
      LeasePeriodUpdated: 'u32'
    }
  },
  /**
   * Lookup71: pallet_crowdloan_reward::pallet::Event<T>
   **/
  PalletCrowdloanRewardEvent: {
    _enum: {
      RewardClaimed: '(AccountId32,u128,u128)',
      RewardPalletInitialized: '(u32,u32,Perbill)',
      DirectPayoutRatioUpdated: 'Perbill',
      VestingPeriodUpdated: 'u32',
      VestingStartUpdated: 'u32'
    }
  },
  /**
   * Lookup73: pallet_pool_system::pallet::Event<T>
   **/
  PalletPoolSystemEvent: {
    _enum: {
      Rebalanced: {
        poolId: 'u64',
      },
      MaxReserveSet: {
        poolId: 'u64',
      },
      EpochClosed: {
        poolId: 'u64',
        epochId: 'u32',
      },
      SolutionSubmitted: {
        poolId: 'u64',
        epochId: 'u32',
        solution: 'PalletPoolSystemSolutionEpochSolution',
      },
      EpochExecuted: {
        poolId: 'u64',
        epochId: 'u32',
      },
      Created: {
        admin: 'AccountId32',
        depositor: 'AccountId32',
        poolId: 'u64',
        essence: 'PalletPoolSystemPoolTypesPoolEssence',
      },
      Updated: {
        _alias: {
          new_: 'new',
        },
        id: 'u64',
        old: 'PalletPoolSystemPoolTypesPoolEssence',
        new_: 'PalletPoolSystemPoolTypesPoolEssence',
      },
      ProposedChange: {
        poolId: 'u64',
        changeId: 'H256',
        change: 'RuntimeCommonChangesFastRuntimeChange'
      }
    }
  },
  /**
   * Lookup74: pallet_pool_system::solution::EpochSolution<Balance, development_runtime::MaxTranches>
   **/
  PalletPoolSystemSolutionEpochSolution: {
    _enum: {
      Healthy: 'PalletPoolSystemSolutionHealthySolution',
      Unhealthy: 'PalletPoolSystemSolutionUnhealthySolution'
    }
  },
  /**
   * Lookup75: development_runtime::MaxTranches
   **/
  DevelopmentRuntimeMaxTranches: 'Null',
  /**
   * Lookup76: pallet_pool_system::solution::HealthySolution<Balance, development_runtime::MaxTranches>
   **/
  PalletPoolSystemSolutionHealthySolution: {
    solution: 'Vec<PalletPoolSystemTranchesTrancheSolution>',
    score: 'u128'
  },
  /**
   * Lookup78: pallet_pool_system::tranches::TrancheSolution
   **/
  PalletPoolSystemTranchesTrancheSolution: {
    investFulfillment: 'Perquintill',
    redeemFulfillment: 'Perquintill'
  },
  /**
   * Lookup81: pallet_pool_system::solution::UnhealthySolution<Balance, development_runtime::MaxTranches>
   **/
  PalletPoolSystemSolutionUnhealthySolution: {
    state: 'Vec<PalletPoolSystemSolutionUnhealthyState>',
    solution: 'Vec<PalletPoolSystemTranchesTrancheSolution>',
    riskBufferImprovementScores: 'Option<Vec<u128>>',
    reserveImprovementScore: 'Option<u128>'
  },
  /**
   * Lookup83: pallet_pool_system::solution::UnhealthyState
   **/
  PalletPoolSystemSolutionUnhealthyState: {
    _enum: ['MaxReserveViolated', 'MinRiskBufferViolated']
  },
  /**
   * Lookup89: pallet_pool_system::pool_types::PoolEssence<cfg_types::tokens::CurrencyId, Balance, cfg_types::tokens::TrancheCurrency, cfg_types::fixed_point::FixedU128, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  PalletPoolSystemPoolTypesPoolEssence: {
    currency: 'CfgTypesTokensCurrencyId',
    maxReserve: 'u128',
    maxNavAge: 'u64',
    minEpochTime: 'u64',
    tranches: 'Vec<PalletPoolSystemTranchesTrancheEssence>'
  },
  /**
   * Lookup90: cfg_types::tokens::CurrencyId
   **/
  CfgTypesTokensCurrencyId: {
    _enum: {
      Native: 'Null',
      Tranche: '(u64,[u8;16])',
      __Unused2: 'Null',
      AUSD: 'Null',
      ForeignAsset: 'u32',
      Staking: 'CfgTypesTokensStakingCurrency'
    }
  },
  /**
   * Lookup92: cfg_types::tokens::StakingCurrency
   **/
  CfgTypesTokensStakingCurrency: {
    _enum: ['BlockRewards']
  },
  /**
   * Lookup93: cfg_types::tokens::TrancheCurrency
   **/
  CfgTypesTokensTrancheCurrency: {
    poolId: 'u64',
    trancheId: '[u8;16]'
  },
  /**
   * Lookup95: cfg_types::consts::pools::MaxTrancheNameLengthBytes
   **/
  CfgTypesConstsPoolsMaxTrancheNameLengthBytes: 'Null',
  /**
   * Lookup96: cfg_types::consts::pools::MaxTrancheSymbolLengthBytes
   **/
  CfgTypesConstsPoolsMaxTrancheSymbolLengthBytes: 'Null',
  /**
   * Lookup98: pallet_pool_system::tranches::TrancheEssence<cfg_types::tokens::TrancheCurrency, cfg_types::fixed_point::FixedU128, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  PalletPoolSystemTranchesTrancheEssence: {
    currency: 'CfgTypesTokensTrancheCurrency',
    ty: 'PalletPoolSystemTranchesTrancheType',
    metadata: 'CfgTypesPoolsTrancheMetadata'
  },
  /**
   * Lookup99: pallet_pool_system::tranches::TrancheType<cfg_types::fixed_point::FixedU128>
   **/
  PalletPoolSystemTranchesTrancheType: {
    _enum: {
      Residual: 'Null',
      NonResidual: {
        interestRatePerSec: 'u128',
        minRiskBuffer: 'Perquintill'
      }
    }
  },
  /**
   * Lookup100: cfg_types::pools::TrancheMetadata<cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  CfgTypesPoolsTrancheMetadata: {
    tokenName: 'Bytes',
    tokenSymbol: 'Bytes'
  },
  /**
   * Lookup103: runtime_common::changes::fast::RuntimeChange<development_runtime::Runtime>
   **/
  RuntimeCommonChangesFastRuntimeChange: 'RuntimeCommonChangesRuntimeChange',
  /**
   * Lookup104: development_runtime::Runtime
   **/
  DevelopmentRuntimeRuntime: 'Null',
  /**
   * Lookup105: runtime_common::changes::RuntimeChange<development_runtime::Runtime>
   **/
  RuntimeCommonChangesRuntimeChange: {
    _enum: {
      Loan: 'PalletLoansChange'
    }
  },
  /**
   * Lookup106: pallet_loans::types::Change<LoanId, cfg_types::fixed_point::FixedU128, development_runtime::MaxWriteOffPolicySize>
   **/
  PalletLoansChange: {
    _enum: {
      Loan: '(u64,PalletLoansLoanMutation)',
      Policy: 'Vec<PalletLoansPolicyWriteOffRule>'
    }
  },
  /**
   * Lookup107: development_runtime::MaxWriteOffPolicySize
   **/
  DevelopmentRuntimeMaxWriteOffPolicySize: 'Null',
  /**
   * Lookup108: pallet_loans::types::LoanMutation<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansLoanMutation: {
    _enum: {
      Maturity: 'PalletLoansMaturity',
      MaturityExtension: 'u64',
      InterestRate: 'CfgTraitsInterestInterestRate',
      InterestPayments: 'PalletLoansInterestPayments',
      PayDownSchedule: 'PalletLoansPayDownSchedule',
      Internal: 'PalletLoansInternalMutation'
    }
  },
  /**
   * Lookup109: pallet_loans::types::Maturity
   **/
  PalletLoansMaturity: {
    _enum: {
      Fixed: {
        date: 'u64',
        extension: 'u64'
      }
    }
  },
  /**
   * Lookup110: cfg_traits::interest::InterestRate<cfg_types::fixed_point::FixedU128>
   **/
  CfgTraitsInterestInterestRate: {
    _enum: {
      Fixed: {
        ratePerYear: 'u128',
        compounding: 'CfgTraitsInterestCompoundingSchedule'
      }
    }
  },
  /**
   * Lookup111: cfg_traits::interest::CompoundingSchedule
   **/
  CfgTraitsInterestCompoundingSchedule: {
    _enum: ['Secondly']
  },
  /**
   * Lookup112: pallet_loans::types::InterestPayments
   **/
  PalletLoansInterestPayments: {
    _enum: ['None']
  },
  /**
   * Lookup113: pallet_loans::types::PayDownSchedule
   **/
  PalletLoansPayDownSchedule: {
    _enum: ['None']
  },
  /**
   * Lookup114: pallet_loans::types::InternalMutation<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansInternalMutation: {
    _enum: {
      ValuationMethod: 'PalletLoansValuationValuationMethod',
      ProbabilityOfDefault: 'u128',
      LossGivenDefault: 'u128',
      DiscountRate: 'CfgTraitsInterestInterestRate'
    }
  },
  /**
   * Lookup115: pallet_loans::types::valuation::ValuationMethod<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansValuationValuationMethod: {
    _enum: {
      DiscountedCashFlow: 'PalletLoansValuationDiscountedCashFlow',
      OutstandingDebt: 'Null'
    }
  },
  /**
   * Lookup116: pallet_loans::types::valuation::DiscountedCashFlow<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansValuationDiscountedCashFlow: {
    probabilityOfDefault: 'u128',
    lossGivenDefault: 'u128',
    discountRate: 'CfgTraitsInterestInterestRate'
  },
  /**
   * Lookup118: pallet_loans::types::policy::WriteOffRule<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansPolicyWriteOffRule: {
    triggers: 'BTreeSet<PalletLoansPolicyUniqueWriteOffTrigger>',
    status: 'PalletLoansPolicyWriteOffStatus'
  },
  /**
   * Lookup120: pallet_loans::types::policy::UniqueWriteOffTrigger
   **/
  PalletLoansPolicyUniqueWriteOffTrigger: 'PalletLoansPolicyWriteOffTrigger',
  /**
   * Lookup121: pallet_loans::types::policy::WriteOffTrigger
   **/
  PalletLoansPolicyWriteOffTrigger: {
    _enum: {
      PrincipalOverdue: 'u64',
      PriceOutdated: 'u64'
    }
  },
  /**
   * Lookup124: pallet_loans::types::policy::WriteOffStatus<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansPolicyWriteOffStatus: {
    percentage: 'u128',
    penalty: 'u128'
  },
  /**
   * Lookup126: pallet_loans::pallet::Event<T>
   **/
  PalletLoansEvent: {
    _enum: {
      Created: {
        poolId: 'u64',
        loanId: 'u64',
        loanInfo: 'PalletLoansEntitiesLoansLoanInfo',
      },
      Borrowed: {
        poolId: 'u64',
        loanId: 'u64',
        amount: 'PalletLoansEntitiesPricingPricingAmount',
      },
      Repaid: {
        poolId: 'u64',
        loanId: 'u64',
        amount: 'PalletLoansEntitiesPricingRepaidPricingAmount',
      },
      WrittenOff: {
        poolId: 'u64',
        loanId: 'u64',
        status: 'PalletLoansPolicyWriteOffStatus',
      },
      Mutated: {
        poolId: 'u64',
        loanId: 'u64',
        mutation: 'PalletLoansLoanMutation',
      },
      Closed: {
        poolId: 'u64',
        loanId: 'u64',
        collateral: '(u64,u128)',
      },
      PortfolioValuationUpdated: {
        poolId: 'u64',
        valuation: 'u128',
        updateType: 'PalletLoansPortfolioPortfolioValuationUpdateType',
      },
      WriteOffPolicyUpdated: {
        poolId: 'u64',
        policy: 'Vec<PalletLoansPolicyWriteOffRule>'
      }
    }
  },
  /**
   * Lookup127: pallet_loans::entities::loans::LoanInfo<T>
   **/
  PalletLoansEntitiesLoansLoanInfo: {
    schedule: 'PalletLoansRepaymentSchedule',
    collateral: '(u64,u128)',
    interestRate: 'CfgTraitsInterestInterestRate',
    pricing: 'PalletLoansEntitiesPricing',
    restrictions: 'PalletLoansLoanRestrictions'
  },
  /**
   * Lookup128: pallet_loans::types::RepaymentSchedule
   **/
  PalletLoansRepaymentSchedule: {
    maturity: 'PalletLoansMaturity',
    interestPayments: 'PalletLoansInterestPayments',
    payDownSchedule: 'PalletLoansPayDownSchedule'
  },
  /**
   * Lookup130: pallet_loans::entities::pricing::Pricing<T>
   **/
  PalletLoansEntitiesPricing: {
    _enum: {
      Internal: 'PalletLoansEntitiesPricingInternalInternalPricing',
      External: 'PalletLoansEntitiesPricingExternalExternalPricing'
    }
  },
  /**
   * Lookup131: pallet_loans::entities::pricing::internal::InternalPricing<T>
   **/
  PalletLoansEntitiesPricingInternalInternalPricing: {
    collateralValue: 'u128',
    valuationMethod: 'PalletLoansValuationValuationMethod',
    maxBorrowAmount: 'PalletLoansEntitiesPricingInternalMaxBorrowAmount'
  },
  /**
   * Lookup132: pallet_loans::entities::pricing::internal::MaxBorrowAmount<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansEntitiesPricingInternalMaxBorrowAmount: {
    _enum: {
      UpToTotalBorrowed: {
        advanceRate: 'u128',
      },
      UpToOutstandingDebt: {
        advanceRate: 'u128'
      }
    }
  },
  /**
   * Lookup133: pallet_loans::entities::pricing::external::ExternalPricing<T>
   **/
  PalletLoansEntitiesPricingExternalExternalPricing: {
    priceId: 'CfgTypesOraclesOracleKey',
    maxBorrowAmount: 'PalletLoansEntitiesPricingExternalMaxBorrowAmount',
    notional: 'u128'
  },
  /**
   * Lookup134: cfg_types::oracles::OracleKey
   **/
  CfgTypesOraclesOracleKey: {
    _enum: {
      Isin: '[u8;12]'
    }
  },
  /**
   * Lookup136: pallet_loans::entities::pricing::external::MaxBorrowAmount<cfg_types::fixed_point::FixedU128>
   **/
  PalletLoansEntitiesPricingExternalMaxBorrowAmount: {
    _enum: {
      NoLimit: 'Null',
      Quantity: 'u128'
    }
  },
  /**
   * Lookup138: pallet_loans::types::LoanRestrictions
   **/
  PalletLoansLoanRestrictions: {
    borrows: 'PalletLoansBorrowRestrictions',
    repayments: 'PalletLoansRepayRestrictions'
  },
  /**
   * Lookup139: pallet_loans::types::BorrowRestrictions
   **/
  PalletLoansBorrowRestrictions: {
    _enum: ['NotWrittenOff', 'FullOnce']
  },
  /**
   * Lookup140: pallet_loans::types::RepayRestrictions
   **/
  PalletLoansRepayRestrictions: {
    _enum: ['None', 'Full']
  },
  /**
   * Lookup141: pallet_loans::entities::pricing::PricingAmount<T>
   **/
  PalletLoansEntitiesPricingPricingAmount: {
    _enum: {
      Internal: 'u128',
      External: 'PalletLoansEntitiesPricingExternalExternalAmount'
    }
  },
  /**
   * Lookup142: pallet_loans::entities::pricing::external::ExternalAmount<T>
   **/
  PalletLoansEntitiesPricingExternalExternalAmount: {
    quantity: 'u128',
    settlementPrice: 'u128'
  },
  /**
   * Lookup143: pallet_loans::entities::pricing::RepaidPricingAmount<T>
   **/
  PalletLoansEntitiesPricingRepaidPricingAmount: {
    principal: 'PalletLoansEntitiesPricingPricingAmount',
    interest: 'u128',
    unscheduled: 'u128'
  },
  /**
   * Lookup144: pallet_loans::types::portfolio::PortfolioValuationUpdateType
   **/
  PalletLoansPortfolioPortfolioValuationUpdateType: {
    _enum: ['Exact', 'Inexact']
  },
  /**
   * Lookup145: pallet_permissions::pallet::Event<T>
   **/
  PalletPermissionsEvent: {
    _enum: {
      Added: {
        to: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope',
        role: 'CfgTypesPermissionsRole',
      },
      Removed: {
        from: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope',
        role: 'CfgTypesPermissionsRole',
      },
      Purged: {
        from: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope'
      }
    }
  },
  /**
   * Lookup146: cfg_types::permissions::PermissionScope<PoolId, cfg_types::tokens::CurrencyId>
   **/
  CfgTypesPermissionsPermissionScope: {
    _enum: {
      Pool: 'u64',
      Currency: 'CfgTypesTokensCurrencyId'
    }
  },
  /**
   * Lookup147: cfg_types::permissions::Role<TrancheId, Moment>
   **/
  CfgTypesPermissionsRole: {
    _enum: {
      PoolRole: 'CfgTypesPermissionsPoolRole',
      PermissionedCurrencyRole: 'CfgTypesPermissionsPermissionedCurrencyRole'
    }
  },
  /**
   * Lookup148: cfg_types::permissions::PoolRole<TrancheId, Moment>
   **/
  CfgTypesPermissionsPoolRole: {
    _enum: {
      PoolAdmin: 'Null',
      Borrower: 'Null',
      PricingAdmin: 'Null',
      LiquidityAdmin: 'Null',
      InvestorAdmin: 'Null',
      LoanAdmin: 'Null',
      TrancheInvestor: '([u8;16],u64)',
      PODReadAccess: 'Null'
    }
  },
  /**
   * Lookup149: cfg_types::permissions::PermissionedCurrencyRole<Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyRole: {
    _enum: {
      Holder: 'u64',
      Manager: 'Null',
      Issuer: 'Null'
    }
  },
  /**
   * Lookup150: pallet_collator_allowlist::pallet::Event<T>
   **/
  PalletCollatorAllowlistEvent: {
    _enum: {
      CollatorAdded: {
        collatorId: 'AccountId32',
      },
      CollatorRemoved: {
        collatorId: 'AccountId32'
      }
    }
  },
  /**
   * Lookup151: pallet_restricted_tokens::pallet::Event<T>
   **/
  PalletRestrictedTokensEvent: {
    _enum: {
      Transfer: {
        currencyId: 'CfgTypesTokensCurrencyId',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      BalanceSet: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        free: 'u128',
        reserved: 'u128'
      }
    }
  },
  /**
   * Lookup152: pallet_nft_sales::pallet::Event<T>
   **/
  PalletNftSalesEvent: {
    _enum: {
      ForSale: {
        classId: 'u64',
        instanceId: 'u128',
        sale: 'PalletNftSalesSale',
      },
      Removed: {
        classId: 'u64',
        instanceId: 'u128',
      },
      Sold: {
        classId: 'u64',
        instanceId: 'u128',
        sale: 'PalletNftSalesSale',
        buyer: 'AccountId32'
      }
    }
  },
  /**
   * Lookup153: pallet_nft_sales::Sale<sp_core::crypto::AccountId32, cfg_types::tokens::CurrencyId, Balance>
   **/
  PalletNftSalesSale: {
    seller: 'AccountId32',
    price: 'PalletNftSalesPrice'
  },
  /**
   * Lookup154: pallet_nft_sales::Price<cfg_types::tokens::CurrencyId, Balance>
   **/
  PalletNftSalesPrice: {
    currency: 'CfgTypesTokensCurrencyId',
    amount: 'u128'
  },
  /**
   * Lookup155: pallet_bridge::pallet::Event<T>
   **/
  PalletBridgeEvent: {
    _enum: {
      Remark: '(H256,[u8;32])'
    }
  },
  /**
   * Lookup156: pallet_interest_accrual::pallet::Event<T>
   **/
  PalletInterestAccrualEvent: 'Null',
  /**
   * Lookup157: pallet_nft::pallet::Event<T>
   **/
  PalletNftEvent: {
    _enum: {
      DepositAsset: 'H256'
    }
  },
  /**
   * Lookup158: pallet_keystore::pallet::Event<T>
   **/
  PalletKeystoreEvent: {
    _enum: {
      KeyAdded: {
        owner: 'AccountId32',
        key: 'H256',
        purpose: 'PalletKeystoreKeyPurpose',
        keyType: 'PalletKeystoreKeyType',
      },
      KeyRevoked: {
        owner: 'AccountId32',
        key: 'H256',
        blockNumber: 'u32',
      },
      DepositSet: {
        newDeposit: 'u128'
      }
    }
  },
  /**
   * Lookup159: pallet_keystore::KeyPurpose
   **/
  PalletKeystoreKeyPurpose: {
    _enum: ['P2PDiscovery', 'P2PDocumentSigning']
  },
  /**
   * Lookup160: pallet_keystore::KeyType
   **/
  PalletKeystoreKeyType: {
    _enum: ['ECDSA', 'EDDSA']
  },
  /**
   * Lookup161: pallet_investments::pallet::Event<T>
   **/
  PalletInvestmentsEvent: {
    _enum: {
      InvestOrdersCollected: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        who: 'AccountId32',
        processedOrders: 'Vec<u64>',
        collection: 'PalletInvestmentsInvestCollection',
        outcome: 'PalletInvestmentsCollectOutcome',
      },
      RedeemOrdersCollected: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        who: 'AccountId32',
        processedOrders: 'Vec<u64>',
        collection: 'PalletInvestmentsRedeemCollection',
        outcome: 'PalletInvestmentsCollectOutcome',
      },
      InvestOrderUpdated: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        submittedAt: 'u64',
        who: 'AccountId32',
        amount: 'u128',
      },
      RedeemOrderUpdated: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        submittedAt: 'u64',
        who: 'AccountId32',
        amount: 'u128',
      },
      InvestOrdersCleared: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        orderId: 'u64',
        fulfillment: 'CfgTypesOrdersFulfillmentWithPrice',
      },
      RedeemOrdersCleared: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        orderId: 'u64',
        fulfillment: 'CfgTypesOrdersFulfillmentWithPrice',
      },
      InvestOrdersInProcessing: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        orderId: 'u64',
        totalOrder: 'CfgTypesOrdersTotalOrder',
      },
      RedeemOrdersInProcessing: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        orderId: 'u64',
        totalOrder: 'CfgTypesOrdersTotalOrder',
      },
      InvestCollectedWithoutActivePosition: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      RedeemCollectedWithoutActivePosition: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      InvestCollectedForNonClearedOrderId: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      RedeemCollectedForNonClearedOrderId: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency'
      }
    }
  },
  /**
   * Lookup163: pallet_investments::InvestCollection<Balance>
   **/
  PalletInvestmentsInvestCollection: {
    payoutInvestmentInvest: 'u128',
    remainingInvestmentInvest: 'u128'
  },
  /**
   * Lookup164: pallet_investments::CollectOutcome
   **/
  PalletInvestmentsCollectOutcome: {
    _enum: ['FullyCollected', 'PartiallyCollected']
  },
  /**
   * Lookup165: pallet_investments::RedeemCollection<Balance>
   **/
  PalletInvestmentsRedeemCollection: {
    payoutInvestmentRedeem: 'u128',
    remainingInvestmentRedeem: 'u128'
  },
  /**
   * Lookup166: cfg_types::orders::FulfillmentWithPrice<cfg_types::fixed_point::FixedU128>
   **/
  CfgTypesOrdersFulfillmentWithPrice: {
    ofAmount: 'Perquintill',
    price: 'u128'
  },
  /**
   * Lookup167: cfg_types::orders::TotalOrder<Balance>
   **/
  CfgTypesOrdersTotalOrder: {
    amount: 'u128'
  },
  /**
   * Lookup168: pallet_rewards::pallet::Event<T, I>
   **/
  PalletRewardsEvent: {
    _enum: {
      GroupRewarded: {
        groupId: 'u32',
        amount: 'u128',
      },
      StakeDeposited: {
        groupId: 'u32',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      StakeWithdrawn: {
        groupId: 'u32',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      RewardClaimed: {
        groupId: 'u32',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      CurrencyAttached: {
        currencyId: 'CfgTypesTokensCurrencyId',
        from: 'Option<u32>',
        to: 'u32'
      }
    }
  },
  /**
   * Lookup170: pallet_liquidity_rewards::pallet::Event<T>
   **/
  PalletLiquidityRewardsEvent: {
    _enum: {
      NewEpoch: {
        endsOn: 'u64',
        reward: 'u128',
        lastChanges: 'PalletLiquidityRewardsEpochChanges'
      }
    }
  },
  /**
   * Lookup171: pallet_liquidity_rewards::EpochChanges<T>
   **/
  PalletLiquidityRewardsEpochChanges: {
    duration: 'Option<u64>',
    reward: 'Option<u128>',
    weights: 'BTreeMap<u32, u64>',
    currencies: 'BTreeMap<CfgTypesTokensCurrencyId, u32>'
  },
  /**
   * Lookup180: pallet_connectors::pallet::Event<T>
   **/
  PalletConnectorsEvent: {
    _enum: {
      MessageSent: {
        message: 'PalletConnectorsMessage',
        domain: 'CfgTypesDomainAddressDomain',
      },
      SetDomainRouter: {
        domain: 'CfgTypesDomainAddressDomain',
        router: 'PalletConnectorsRoutersRouter',
      },
      IncomingMessage: {
        sender: 'AccountId32',
        message: 'Bytes'
      }
    }
  },
  /**
   * Lookup181: pallet_connectors::message::Message<cfg_types::domain_address::Domain, PoolId, TrancheId, Balance, cfg_types::fixed_point::FixedU128>
   **/
  PalletConnectorsMessage: {
    _enum: {
      Invalid: 'Null',
      AddCurrency: {
        currency: 'u128',
        evmAddress: '[u8;20]',
      },
      AddPool: {
        poolId: 'u64',
      },
      AllowPoolCurrency: {
        poolId: 'u64',
        currency: 'u128',
      },
      AddTranche: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        tokenName: '[u8;128]',
        tokenSymbol: '[u8;32]',
        decimals: 'u8',
        price: 'u128',
      },
      UpdateTrancheTokenPrice: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        price: 'u128',
      },
      UpdateMember: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        member: '[u8;32]',
        validUntil: 'u64',
      },
      Transfer: {
        currency: 'u128',
        sender: '[u8;32]',
        receiver: '[u8;32]',
        amount: 'u128',
      },
      TransferTrancheTokens: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        sender: '[u8;32]',
        domain: 'CfgTypesDomainAddressDomain',
        receiver: '[u8;32]',
        amount: 'u128',
      },
      IncreaseInvestOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        amount: 'u128',
      },
      DecreaseInvestOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        amount: 'u128',
      },
      IncreaseRedeemOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        amount: 'u128',
      },
      DecreaseRedeemOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        amount: 'u128',
      },
      CollectInvest: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
      },
      CollectRedeem: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
      },
      ExecutedDecreaseInvestOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        currencyPayout: 'u128',
        remainingInvestOrder: 'u128',
      },
      ExecutedDecreaseRedeemOrder: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        trancheTokensPayout: 'u128',
        remainingRedeemOrder: 'u128',
      },
      ExecutedCollectInvest: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        currencyPayout: 'u128',
        trancheTokensPayout: 'u128',
        remainingInvestOrder: 'u128',
      },
      ExecutedCollectRedeem: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        investor: '[u8;32]',
        currency: 'u128',
        currencyPayout: 'u128',
        trancheTokensPayout: 'u128',
        remainingRedeemOrder: 'u128'
      }
    }
  },
  /**
   * Lookup182: cfg_types::domain_address::Domain
   **/
  CfgTypesDomainAddressDomain: {
    _enum: {
      Centrifuge: 'Null',
      EVM: 'u64'
    }
  },
  /**
   * Lookup185: pallet_connectors::routers::Router<cfg_types::tokens::CurrencyId>
   **/
  PalletConnectorsRoutersRouter: {
    _enum: {
      Xcm: 'PalletConnectorsRoutersXcmDomain'
    }
  },
  /**
   * Lookup186: pallet_connectors::routers::XcmDomain<cfg_types::tokens::CurrencyId>
   **/
  PalletConnectorsRoutersXcmDomain: {
    location: 'XcmVersionedMultiLocation',
    ethereumXcmTransactCallIndex: 'Bytes',
    contractAddress: 'H160',
    feeCurrency: 'CfgTypesTokensCurrencyId',
    maxGasLimit: 'u64'
  },
  /**
   * Lookup187: xcm::VersionedMultiLocation
   **/
  XcmVersionedMultiLocation: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiLocation',
      __Unused2: 'Null',
      V3: 'XcmV3MultiLocation'
    }
  },
  /**
   * Lookup188: xcm::v2::multilocation::MultiLocation
   **/
  XcmV2MultiLocation: {
    parents: 'u8',
    interior: 'XcmV2MultilocationJunctions'
  },
  /**
   * Lookup189: xcm::v2::multilocation::Junctions
   **/
  XcmV2MultilocationJunctions: {
    _enum: {
      Here: 'Null',
      X1: 'XcmV2Junction',
      X2: '(XcmV2Junction,XcmV2Junction)',
      X3: '(XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X4: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X5: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X6: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X7: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)',
      X8: '(XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction,XcmV2Junction)'
    }
  },
  /**
   * Lookup190: xcm::v2::junction::Junction
   **/
  XcmV2Junction: {
    _enum: {
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'XcmV2NetworkId',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'XcmV2NetworkId',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'XcmV2NetworkId',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: 'Bytes',
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV2BodyId',
        part: 'XcmV2BodyPart'
      }
    }
  },
  /**
   * Lookup192: xcm::v2::NetworkId
   **/
  XcmV2NetworkId: {
    _enum: {
      Any: 'Null',
      Named: 'Bytes',
      Polkadot: 'Null',
      Kusama: 'Null'
    }
  },
  /**
   * Lookup195: xcm::v2::BodyId
   **/
  XcmV2BodyId: {
    _enum: {
      Unit: 'Null',
      Named: 'Bytes',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null',
      Defense: 'Null',
      Administration: 'Null',
      Treasury: 'Null'
    }
  },
  /**
   * Lookup196: xcm::v2::BodyPart
   **/
  XcmV2BodyPart: {
    _enum: {
      Voice: 'Null',
      Members: {
        count: 'Compact<u32>',
      },
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup197: xcm::v3::multilocation::MultiLocation
   **/
  XcmV3MultiLocation: {
    parents: 'u8',
    interior: 'XcmV3Junctions'
  },
  /**
   * Lookup198: xcm::v3::junctions::Junctions
   **/
  XcmV3Junctions: {
    _enum: {
      Here: 'Null',
      X1: 'XcmV3Junction',
      X2: '(XcmV3Junction,XcmV3Junction)',
      X3: '(XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X4: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X5: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X6: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X7: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)',
      X8: '(XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction,XcmV3Junction)'
    }
  },
  /**
   * Lookup199: xcm::v3::junction::Junction
   **/
  XcmV3Junction: {
    _enum: {
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'Option<XcmV3JunctionNetworkId>',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'Option<XcmV3JunctionNetworkId>',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'Option<XcmV3JunctionNetworkId>',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: {
        length: 'u8',
        data: '[u8;32]',
      },
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV3JunctionBodyId',
        part: 'XcmV3JunctionBodyPart',
      },
      GlobalConsensus: 'XcmV3JunctionNetworkId'
    }
  },
  /**
   * Lookup201: xcm::v3::junction::NetworkId
   **/
  XcmV3JunctionNetworkId: {
    _enum: {
      ByGenesis: '[u8;32]',
      ByFork: {
        blockNumber: 'u64',
        blockHash: '[u8;32]',
      },
      Polkadot: 'Null',
      Kusama: 'Null',
      Westend: 'Null',
      Rococo: 'Null',
      Wococo: 'Null',
      Ethereum: {
        chainId: 'Compact<u64>',
      },
      BitcoinCore: 'Null',
      BitcoinCash: 'Null'
    }
  },
  /**
   * Lookup202: xcm::v3::junction::BodyId
   **/
  XcmV3JunctionBodyId: {
    _enum: {
      Unit: 'Null',
      Moniker: '[u8;4]',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null',
      Defense: 'Null',
      Administration: 'Null',
      Treasury: 'Null'
    }
  },
  /**
   * Lookup203: xcm::v3::junction::BodyPart
   **/
  XcmV3JunctionBodyPart: {
    _enum: {
      Voice: 'Null',
      Members: {
        count: 'Compact<u32>',
      },
      Fraction: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      AtLeastProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>',
      },
      MoreThanProportion: {
        nom: 'Compact<u32>',
        denom: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup206: pallet_pool_registry::pallet::Event<T>
   **/
  PalletPoolRegistryEvent: {
    _enum: {
      Registered: {
        poolId: 'u64',
      },
      UpdateRegistered: {
        poolId: 'u64',
      },
      UpdateExecuted: {
        poolId: 'u64',
      },
      UpdateStored: {
        poolId: 'u64',
      },
      MetadataSet: {
        poolId: 'u64',
        metadata: 'Bytes'
      }
    }
  },
  /**
   * Lookup209: pallet_block_rewards::pallet::Event<T>
   **/
  PalletBlockRewardsEvent: {
    _enum: {
      NewSession: {
        collatorReward: 'u128',
        totalReward: 'u128',
        lastChanges: 'PalletBlockRewardsSessionChanges',
      },
      SessionAdvancementFailed: {
        error: 'SpRuntimeDispatchError'
      }
    }
  },
  /**
   * Lookup210: pallet_block_rewards::SessionChanges<T>
   **/
  PalletBlockRewardsSessionChanges: {
    collators: 'PalletBlockRewardsCollatorChanges',
    collatorCount: 'Option<u32>',
    collatorReward: 'Option<u128>',
    totalReward: 'Option<u128>'
  },
  /**
   * Lookup211: pallet_block_rewards::CollatorChanges<T>
   **/
  PalletBlockRewardsCollatorChanges: {
    inc: 'Vec<AccountId32>',
    out: 'Vec<AccountId32>'
  },
  /**
   * Lookup213: pallet_transfer_allowlist::pallet::Event<T>
   **/
  PalletTransferAllowlistEvent: {
    _enum: {
      TransferAllowanceCreated: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
        allowedAt: 'u32',
        blockedAt: 'u32',
      },
      TransferAllowanceRemoved: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
        allowedAt: 'u32',
        blockedAt: 'u32',
      },
      TransferAllowancePurged: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
      },
      TransferAllowanceDelayAdd: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        delay: 'u32',
      },
      TransferAllowanceDelayUpdate: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        delay: 'u32',
      },
      ToggleTransferAllowanceDelayFutureModifiable: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId',
        modifiableOnceAfter: 'Option<u32>',
      },
      TransferAllowanceDelayPurge: {
        senderAccountId: 'AccountId32',
        currencyId: 'CfgTypesTokensCurrencyId'
      }
    }
  },
  /**
   * Lookup214: cfg_types::locations::Location
   **/
  CfgTypesLocationsLocation: {
    _enum: {
      Local: 'AccountId32',
      XCM: 'H256',
      Address: 'CfgTypesDomainAddress'
    }
  },
  /**
   * Lookup215: cfg_types::domain_address::DomainAddress
   **/
  CfgTypesDomainAddress: {
    _enum: {
      Centrifuge: '[u8;32]',
      EVM: '(u64,[u8;20])'
    }
  },
  /**
   * Lookup216: pallet_connectors_gateway::pallet::Event<T>
   **/
  PalletConnectorsGatewayEvent: {
    _enum: {
      DomainRouterSet: {
        domain: 'CfgTypesDomainAddressDomain',
        router: 'ConnectorsGatewayRoutersDomainRouter',
      },
      ConnectorAdded: {
        connector: 'CfgTypesDomainAddress',
      },
      ConnectorRemoved: {
        connector: 'CfgTypesDomainAddress'
      }
    }
  },
  /**
   * Lookup217: connectors_gateway_routers::DomainRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersDomainRouter: {
    _enum: {
      EthereumXCM: 'ConnectorsGatewayRoutersRoutersEthereumXcmEthereumXCMRouter',
      AxelarEVM: 'ConnectorsGatewayRoutersRoutersAxelarEvmAxelarEVMRouter',
      AxelarXCM: 'ConnectorsGatewayRoutersRoutersAxelarXcmAxelarXCMRouter'
    }
  },
  /**
   * Lookup218: connectors_gateway_routers::routers::ethereum_xcm::EthereumXCMRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersRoutersEthereumXcmEthereumXCMRouter: {
    router: 'ConnectorsGatewayRoutersXcmRouter'
  },
  /**
   * Lookup219: connectors_gateway_routers::XCMRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersXcmRouter: {
    xcmDomain: 'ConnectorsGatewayRoutersXcmDomain'
  },
  /**
   * Lookup220: connectors_gateway_routers::XcmDomain<cfg_types::tokens::CurrencyId>
   **/
  ConnectorsGatewayRoutersXcmDomain: {
    location: 'XcmVersionedMultiLocation',
    ethereumXcmTransactCallIndex: 'Bytes',
    contractAddress: 'H160',
    maxGasLimit: 'u64',
    transactInfo: 'ConnectorsGatewayRoutersXcmTransactInfo',
    feeCurrency: 'CfgTypesTokensCurrencyId',
    feePerSecond: 'u128',
    feeAssetLocation: 'XcmVersionedMultiLocation'
  },
  /**
   * Lookup221: connectors_gateway_routers::XcmTransactInfo
   **/
  ConnectorsGatewayRoutersXcmTransactInfo: {
    transactExtraWeight: 'SpWeightsWeightV2Weight',
    maxWeight: 'SpWeightsWeightV2Weight',
    transactExtraWeightSigned: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup223: connectors_gateway_routers::routers::axelar_evm::AxelarEVMRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersRoutersAxelarEvmAxelarEVMRouter: {
    router: 'ConnectorsGatewayRoutersEvmRouter',
    evmChain: 'ConnectorsGatewayRoutersRoutersAxelarEvmEvmChain',
    connectorsContractAddress: 'H160'
  },
  /**
   * Lookup224: connectors_gateway_routers::EVMRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersEvmRouter: {
    evmDomain: 'ConnectorsGatewayRoutersEvmDomain'
  },
  /**
   * Lookup225: connectors_gateway_routers::EVMDomain
   **/
  ConnectorsGatewayRoutersEvmDomain: {
    targetContractAddress: 'H160',
    targetContractHash: 'H256',
    feeValues: 'ConnectorsGatewayRoutersFeeValues'
  },
  /**
   * Lookup226: connectors_gateway_routers::FeeValues
   **/
  ConnectorsGatewayRoutersFeeValues: {
    value: 'U256',
    gasPrice: 'U256',
    gasLimit: 'U256'
  },
  /**
   * Lookup229: connectors_gateway_routers::routers::axelar_evm::EVMChain
   **/
  ConnectorsGatewayRoutersRoutersAxelarEvmEvmChain: {
    _enum: ['Ethereum', 'Goerli']
  },
  /**
   * Lookup230: connectors_gateway_routers::routers::axelar_xcm::AxelarXCMRouter<development_runtime::Runtime>
   **/
  ConnectorsGatewayRoutersRoutersAxelarXcmAxelarXCMRouter: {
    router: 'ConnectorsGatewayRoutersXcmRouter',
    axelarTargetChain: 'ConnectorsGatewayRoutersRoutersAxelarEvmEvmChain',
    axelarTargetContract: 'H160'
  },
  /**
   * Lookup231: pallet_order_book::pallet::Event<T>
   **/
  PalletOrderBookEvent: {
    _enum: {
      OrderCreated: {
        orderId: 'u64',
        creatorAccount: 'AccountId32',
        currencyIn: 'CfgTypesTokensCurrencyId',
        currencyOut: 'CfgTypesTokensCurrencyId',
        buyAmount: 'u128',
        minFullfillmentAmount: 'u128',
        sellPriceLimit: 'u128',
      },
      OrderCancelled: {
        account: 'AccountId32',
        orderId: 'u64',
      },
      OrderUpdated: {
        orderId: 'u64',
        account: 'AccountId32',
        buyAmount: 'u128',
        sellPriceLimit: 'u128',
        minFullfillmentAmount: 'u128',
      },
      OrderFulfillment: {
        orderId: 'u64',
        placingAccount: 'AccountId32',
        fulfillingAccount: 'AccountId32',
        partialFulfillment: 'bool',
        fulfillmentAmount: 'u128',
        currencyIn: 'CfgTypesTokensCurrencyId',
        currencyOut: 'CfgTypesTokensCurrencyId',
        sellPriceLimit: 'u128'
      }
    }
  },
  /**
   * Lookup232: cumulus_pallet_xcmp_queue::pallet::Event<T>
   **/
  CumulusPalletXcmpQueueEvent: {
    _enum: {
      Success: {
        messageHash: 'Option<[u8;32]>',
        weight: 'SpWeightsWeightV2Weight',
      },
      Fail: {
        messageHash: 'Option<[u8;32]>',
        error: 'XcmV3TraitsError',
        weight: 'SpWeightsWeightV2Weight',
      },
      BadVersion: {
        messageHash: 'Option<[u8;32]>',
      },
      BadFormat: {
        messageHash: 'Option<[u8;32]>',
      },
      XcmpMessageSent: {
        messageHash: 'Option<[u8;32]>',
      },
      OverweightEnqueued: {
        sender: 'u32',
        sentAt: 'u32',
        index: 'u64',
        required: 'SpWeightsWeightV2Weight',
      },
      OverweightServiced: {
        index: 'u64',
        used: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup233: xcm::v3::traits::Error
   **/
  XcmV3TraitsError: {
    _enum: {
      Overflow: 'Null',
      Unimplemented: 'Null',
      UntrustedReserveLocation: 'Null',
      UntrustedTeleportLocation: 'Null',
      LocationFull: 'Null',
      LocationNotInvertible: 'Null',
      BadOrigin: 'Null',
      InvalidLocation: 'Null',
      AssetNotFound: 'Null',
      FailedToTransactAsset: 'Null',
      NotWithdrawable: 'Null',
      LocationCannotHold: 'Null',
      ExceedsMaxMessageSize: 'Null',
      DestinationUnsupported: 'Null',
      Transport: 'Null',
      Unroutable: 'Null',
      UnknownClaim: 'Null',
      FailedToDecode: 'Null',
      MaxWeightInvalid: 'Null',
      NotHoldingFees: 'Null',
      TooExpensive: 'Null',
      Trap: 'u64',
      ExpectationFalse: 'Null',
      PalletNotFound: 'Null',
      NameMismatch: 'Null',
      VersionIncompatible: 'Null',
      HoldingWouldOverflow: 'Null',
      ExportError: 'Null',
      ReanchorFailed: 'Null',
      NoDeal: 'Null',
      FeesNotMet: 'Null',
      LockError: 'Null',
      NoPermission: 'Null',
      Unanchored: 'Null',
      NotDepositable: 'Null',
      UnhandledXcmVersion: 'Null',
      WeightLimitReached: 'SpWeightsWeightV2Weight',
      Barrier: 'Null',
      WeightNotComputable: 'Null',
      ExceedsStackLimit: 'Null'
    }
  },
  /**
   * Lookup235: pallet_xcm::pallet::Event<T>
   **/
  PalletXcmEvent: {
    _enum: {
      Attempted: 'XcmV3TraitsOutcome',
      Sent: '(XcmV3MultiLocation,XcmV3MultiLocation,XcmV3Xcm)',
      UnexpectedResponse: '(XcmV3MultiLocation,u64)',
      ResponseReady: '(u64,XcmV3Response)',
      Notified: '(u64,u8,u8)',
      NotifyOverweight: '(u64,u8,u8,SpWeightsWeightV2Weight,SpWeightsWeightV2Weight)',
      NotifyDispatchError: '(u64,u8,u8)',
      NotifyDecodeFailed: '(u64,u8,u8)',
      InvalidResponder: '(XcmV3MultiLocation,u64,Option<XcmV3MultiLocation>)',
      InvalidResponderVersion: '(XcmV3MultiLocation,u64)',
      ResponseTaken: 'u64',
      AssetsTrapped: '(H256,XcmV3MultiLocation,XcmVersionedMultiAssets)',
      VersionChangeNotified: '(XcmV3MultiLocation,u32,XcmV3MultiassetMultiAssets)',
      SupportedVersionChanged: '(XcmV3MultiLocation,u32)',
      NotifyTargetSendFail: '(XcmV3MultiLocation,u64,XcmV3TraitsError)',
      NotifyTargetMigrationFail: '(XcmVersionedMultiLocation,u64)',
      InvalidQuerierVersion: '(XcmV3MultiLocation,u64)',
      InvalidQuerier: '(XcmV3MultiLocation,u64,XcmV3MultiLocation,Option<XcmV3MultiLocation>)',
      VersionNotifyStarted: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      VersionNotifyRequested: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      VersionNotifyUnrequested: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      FeesPaid: '(XcmV3MultiLocation,XcmV3MultiassetMultiAssets)',
      AssetsClaimed: '(H256,XcmV3MultiLocation,XcmVersionedMultiAssets)'
    }
  },
  /**
   * Lookup236: xcm::v3::traits::Outcome
   **/
  XcmV3TraitsOutcome: {
    _enum: {
      Complete: 'SpWeightsWeightV2Weight',
      Incomplete: '(SpWeightsWeightV2Weight,XcmV3TraitsError)',
      Error: 'XcmV3TraitsError'
    }
  },
  /**
   * Lookup237: xcm::v3::Xcm<Call>
   **/
  XcmV3Xcm: 'Vec<XcmV3Instruction>',
  /**
   * Lookup239: xcm::v3::Instruction<Call>
   **/
  XcmV3Instruction: {
    _enum: {
      WithdrawAsset: 'XcmV3MultiassetMultiAssets',
      ReserveAssetDeposited: 'XcmV3MultiassetMultiAssets',
      ReceiveTeleportedAsset: 'XcmV3MultiassetMultiAssets',
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV3Response',
        maxWeight: 'SpWeightsWeightV2Weight',
        querier: 'Option<XcmV3MultiLocation>',
      },
      TransferAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        beneficiary: 'XcmV3MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      Transact: {
        originKind: 'XcmV2OriginKind',
        requireWeightAtMost: 'SpWeightsWeightV2Weight',
        call: 'XcmDoubleEncoded',
      },
      HrmpNewChannelOpenRequest: {
        sender: 'Compact<u32>',
        maxMessageSize: 'Compact<u32>',
        maxCapacity: 'Compact<u32>',
      },
      HrmpChannelAccepted: {
        recipient: 'Compact<u32>',
      },
      HrmpChannelClosing: {
        initiator: 'Compact<u32>',
        sender: 'Compact<u32>',
        recipient: 'Compact<u32>',
      },
      ClearOrigin: 'Null',
      DescendOrigin: 'XcmV3Junctions',
      ReportError: 'XcmV3QueryResponseInfo',
      DepositAsset: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        beneficiary: 'XcmV3MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      ExchangeAsset: {
        give: 'XcmV3MultiassetMultiAssetFilter',
        want: 'XcmV3MultiassetMultiAssets',
        maximal: 'bool',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        reserve: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      InitiateTeleport: {
        assets: 'XcmV3MultiassetMultiAssetFilter',
        dest: 'XcmV3MultiLocation',
        xcm: 'XcmV3Xcm',
      },
      ReportHolding: {
        responseInfo: 'XcmV3QueryResponseInfo',
        assets: 'XcmV3MultiassetMultiAssetFilter',
      },
      BuyExecution: {
        fees: 'XcmV3MultiAsset',
        weightLimit: 'XcmV3WeightLimit',
      },
      RefundSurplus: 'Null',
      SetErrorHandler: 'XcmV3Xcm',
      SetAppendix: 'XcmV3Xcm',
      ClearError: 'Null',
      ClaimAsset: {
        assets: 'XcmV3MultiassetMultiAssets',
        ticket: 'XcmV3MultiLocation',
      },
      Trap: 'Compact<u64>',
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'SpWeightsWeightV2Weight',
      },
      UnsubscribeVersion: 'Null',
      BurnAsset: 'XcmV3MultiassetMultiAssets',
      ExpectAsset: 'XcmV3MultiassetMultiAssets',
      ExpectOrigin: 'Option<XcmV3MultiLocation>',
      ExpectError: 'Option<(u32,XcmV3TraitsError)>',
      ExpectTransactStatus: 'XcmV3MaybeErrorCode',
      QueryPallet: {
        moduleName: 'Bytes',
        responseInfo: 'XcmV3QueryResponseInfo',
      },
      ExpectPallet: {
        index: 'Compact<u32>',
        name: 'Bytes',
        moduleName: 'Bytes',
        crateMajor: 'Compact<u32>',
        minCrateMinor: 'Compact<u32>',
      },
      ReportTransactStatus: 'XcmV3QueryResponseInfo',
      ClearTransactStatus: 'Null',
      UniversalOrigin: 'XcmV3Junction',
      ExportMessage: {
        network: 'XcmV3JunctionNetworkId',
        destination: 'XcmV3Junctions',
        xcm: 'XcmV3Xcm',
      },
      LockAsset: {
        asset: 'XcmV3MultiAsset',
        unlocker: 'XcmV3MultiLocation',
      },
      UnlockAsset: {
        asset: 'XcmV3MultiAsset',
        target: 'XcmV3MultiLocation',
      },
      NoteUnlockable: {
        asset: 'XcmV3MultiAsset',
        owner: 'XcmV3MultiLocation',
      },
      RequestUnlock: {
        asset: 'XcmV3MultiAsset',
        locker: 'XcmV3MultiLocation',
      },
      SetFeesMode: {
        jitWithdraw: 'bool',
      },
      SetTopic: '[u8;32]',
      ClearTopic: 'Null',
      AliasOrigin: 'XcmV3MultiLocation',
      UnpaidExecution: {
        weightLimit: 'XcmV3WeightLimit',
        checkOrigin: 'Option<XcmV3MultiLocation>'
      }
    }
  },
  /**
   * Lookup240: xcm::v3::multiasset::MultiAssets
   **/
  XcmV3MultiassetMultiAssets: 'Vec<XcmV3MultiAsset>',
  /**
   * Lookup242: xcm::v3::multiasset::MultiAsset
   **/
  XcmV3MultiAsset: {
    id: 'XcmV3MultiassetAssetId',
    fun: 'XcmV3MultiassetFungibility'
  },
  /**
   * Lookup243: xcm::v3::multiasset::AssetId
   **/
  XcmV3MultiassetAssetId: {
    _enum: {
      Concrete: 'XcmV3MultiLocation',
      Abstract: '[u8;32]'
    }
  },
  /**
   * Lookup244: xcm::v3::multiasset::Fungibility
   **/
  XcmV3MultiassetFungibility: {
    _enum: {
      Fungible: 'Compact<u128>',
      NonFungible: 'XcmV3MultiassetAssetInstance'
    }
  },
  /**
   * Lookup245: xcm::v3::multiasset::AssetInstance
   **/
  XcmV3MultiassetAssetInstance: {
    _enum: {
      Undefined: 'Null',
      Index: 'Compact<u128>',
      Array4: '[u8;4]',
      Array8: '[u8;8]',
      Array16: '[u8;16]',
      Array32: '[u8;32]'
    }
  },
  /**
   * Lookup247: xcm::v3::Response
   **/
  XcmV3Response: {
    _enum: {
      Null: 'Null',
      Assets: 'XcmV3MultiassetMultiAssets',
      ExecutionResult: 'Option<(u32,XcmV3TraitsError)>',
      Version: 'u32',
      PalletsInfo: 'XcmV3VecPalletInfo',
      DispatchResult: 'XcmV3MaybeErrorCode'
    }
  },
  /**
   * Lookup250: xcm::v3::VecPalletInfo
   **/
  XcmV3VecPalletInfo: 'Vec<XcmV3PalletInfo>',
  /**
   * Lookup252: xcm::v3::PalletInfo
   **/
  XcmV3PalletInfo: {
    index: 'Compact<u32>',
    name: 'Bytes',
    moduleName: 'Bytes',
    major: 'Compact<u32>',
    minor: 'Compact<u32>',
    patch: 'Compact<u32>'
  },
  /**
   * Lookup253: xcm::v3::MaybeErrorCode
   **/
  XcmV3MaybeErrorCode: {
    _enum: {
      Success: 'Null',
      Error: 'Bytes',
      TruncatedError: 'Bytes'
    }
  },
  /**
   * Lookup255: xcm::v2::OriginKind
   **/
  XcmV2OriginKind: {
    _enum: ['Native', 'SovereignAccount', 'Superuser', 'Xcm']
  },
  /**
   * Lookup256: xcm::double_encoded::DoubleEncoded<T>
   **/
  XcmDoubleEncoded: {
    encoded: 'Bytes'
  },
  /**
   * Lookup257: xcm::v3::QueryResponseInfo
   **/
  XcmV3QueryResponseInfo: {
    destination: 'XcmV3MultiLocation',
    queryId: 'Compact<u64>',
    maxWeight: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup258: xcm::v3::multiasset::MultiAssetFilter
   **/
  XcmV3MultiassetMultiAssetFilter: {
    _enum: {
      Definite: 'XcmV3MultiassetMultiAssets',
      Wild: 'XcmV3MultiassetWildMultiAsset'
    }
  },
  /**
   * Lookup259: xcm::v3::multiasset::WildMultiAsset
   **/
  XcmV3MultiassetWildMultiAsset: {
    _enum: {
      All: 'Null',
      AllOf: {
        id: 'XcmV3MultiassetAssetId',
        fun: 'XcmV3MultiassetWildFungibility',
      },
      AllCounted: 'Compact<u32>',
      AllOfCounted: {
        id: 'XcmV3MultiassetAssetId',
        fun: 'XcmV3MultiassetWildFungibility',
        count: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup260: xcm::v3::multiasset::WildFungibility
   **/
  XcmV3MultiassetWildFungibility: {
    _enum: ['Fungible', 'NonFungible']
  },
  /**
   * Lookup261: xcm::v3::WeightLimit
   **/
  XcmV3WeightLimit: {
    _enum: {
      Unlimited: 'Null',
      Limited: 'SpWeightsWeightV2Weight'
    }
  },
  /**
   * Lookup262: xcm::VersionedMultiAssets
   **/
  XcmVersionedMultiAssets: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiassetMultiAssets',
      __Unused2: 'Null',
      V3: 'XcmV3MultiassetMultiAssets'
    }
  },
  /**
   * Lookup263: xcm::v2::multiasset::MultiAssets
   **/
  XcmV2MultiassetMultiAssets: 'Vec<XcmV2MultiAsset>',
  /**
   * Lookup265: xcm::v2::multiasset::MultiAsset
   **/
  XcmV2MultiAsset: {
    id: 'XcmV2MultiassetAssetId',
    fun: 'XcmV2MultiassetFungibility'
  },
  /**
   * Lookup266: xcm::v2::multiasset::AssetId
   **/
  XcmV2MultiassetAssetId: {
    _enum: {
      Concrete: 'XcmV2MultiLocation',
      Abstract: 'Bytes'
    }
  },
  /**
   * Lookup267: xcm::v2::multiasset::Fungibility
   **/
  XcmV2MultiassetFungibility: {
    _enum: {
      Fungible: 'Compact<u128>',
      NonFungible: 'XcmV2MultiassetAssetInstance'
    }
  },
  /**
   * Lookup268: xcm::v2::multiasset::AssetInstance
   **/
  XcmV2MultiassetAssetInstance: {
    _enum: {
      Undefined: 'Null',
      Index: 'Compact<u128>',
      Array4: '[u8;4]',
      Array8: '[u8;8]',
      Array16: '[u8;16]',
      Array32: '[u8;32]',
      Blob: 'Bytes'
    }
  },
  /**
   * Lookup269: cumulus_pallet_xcm::pallet::Event<T>
   **/
  CumulusPalletXcmEvent: {
    _enum: {
      InvalidFormat: '[u8;32]',
      UnsupportedVersion: '[u8;32]',
      ExecutedDownward: '([u8;32],XcmV3TraitsOutcome)'
    }
  },
  /**
   * Lookup270: cumulus_pallet_dmp_queue::pallet::Event<T>
   **/
  CumulusPalletDmpQueueEvent: {
    _enum: {
      InvalidFormat: {
        messageId: '[u8;32]',
      },
      UnsupportedVersion: {
        messageId: '[u8;32]',
      },
      ExecutedDownward: {
        messageId: '[u8;32]',
        outcome: 'XcmV3TraitsOutcome',
      },
      WeightExhausted: {
        messageId: '[u8;32]',
        remainingWeight: 'SpWeightsWeightV2Weight',
        requiredWeight: 'SpWeightsWeightV2Weight',
      },
      OverweightEnqueued: {
        messageId: '[u8;32]',
        overweightIndex: 'u64',
        requiredWeight: 'SpWeightsWeightV2Weight',
      },
      OverweightServiced: {
        overweightIndex: 'u64',
        weightUsed: 'SpWeightsWeightV2Weight',
      },
      MaxMessagesExhausted: {
        messageId: '[u8;32]'
      }
    }
  },
  /**
   * Lookup271: orml_xtokens::module::Event<T>
   **/
  OrmlXtokensModuleEvent: {
    _enum: {
      TransferredMultiAssets: {
        sender: 'AccountId32',
        assets: 'XcmV3MultiassetMultiAssets',
        fee: 'XcmV3MultiAsset',
        dest: 'XcmV3MultiLocation'
      }
    }
  },
  /**
   * Lookup272: pallet_xcm_transactor::pallet::Event<T>
   **/
  PalletXcmTransactorEvent: {
    _enum: {
      TransactedDerivative: {
        accountId: 'AccountId32',
        dest: 'XcmV3MultiLocation',
        call: 'Bytes',
        index: 'u16',
      },
      TransactedSovereign: {
        feePayer: 'AccountId32',
        dest: 'XcmV3MultiLocation',
        call: 'Bytes',
      },
      TransactedSigned: {
        feePayer: 'AccountId32',
        dest: 'XcmV3MultiLocation',
        call: 'Bytes',
      },
      RegisteredDerivative: {
        accountId: 'AccountId32',
        index: 'u16',
      },
      DeRegisteredDerivative: {
        index: 'u16',
      },
      TransactFailed: {
        error: 'XcmV3TraitsError',
      },
      TransactInfoChanged: {
        location: 'XcmV3MultiLocation',
        remoteInfo: 'PalletXcmTransactorRemoteTransactInfoWithMaxWeight',
      },
      TransactInfoRemoved: {
        location: 'XcmV3MultiLocation',
      },
      DestFeePerSecondChanged: {
        location: 'XcmV3MultiLocation',
        feePerSecond: 'u128',
      },
      DestFeePerSecondRemoved: {
        location: 'XcmV3MultiLocation',
      },
      HrmpManagementSent: {
        action: 'PalletXcmTransactorHrmpOperation'
      }
    }
  },
  /**
   * Lookup273: pallet_xcm_transactor::pallet::RemoteTransactInfoWithMaxWeight
   **/
  PalletXcmTransactorRemoteTransactInfoWithMaxWeight: {
    transactExtraWeight: 'SpWeightsWeightV2Weight',
    maxWeight: 'SpWeightsWeightV2Weight',
    transactExtraWeightSigned: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup274: pallet_xcm_transactor::pallet::HrmpOperation
   **/
  PalletXcmTransactorHrmpOperation: {
    _enum: {
      InitOpen: 'PalletXcmTransactorHrmpInitParams',
      Accept: {
        paraId: 'u32',
      },
      Close: 'PolkadotParachainPrimitivesHrmpChannelId',
      Cancel: {
        channelId: 'PolkadotParachainPrimitivesHrmpChannelId',
        openRequests: 'u32'
      }
    }
  },
  /**
   * Lookup275: pallet_xcm_transactor::pallet::HrmpInitParams
   **/
  PalletXcmTransactorHrmpInitParams: {
    paraId: 'u32',
    proposedMaxCapacity: 'u32',
    proposedMaxMessageSize: 'u32'
  },
  /**
   * Lookup276: polkadot_parachain::primitives::HrmpChannelId
   **/
  PolkadotParachainPrimitivesHrmpChannelId: {
    sender: 'u32',
    recipient: 'u32'
  },
  /**
   * Lookup277: orml_tokens::module::Event<T>
   **/
  OrmlTokensModuleEvent: {
    _enum: {
      Endowed: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      DustLost: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      Transfer: {
        currencyId: 'CfgTypesTokensCurrencyId',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
      },
      Reserved: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      Unreserved: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      ReserveRepatriated: {
        currencyId: 'CfgTypesTokensCurrencyId',
        from: 'AccountId32',
        to: 'AccountId32',
        amount: 'u128',
        status: 'FrameSupportTokensMiscBalanceStatus',
      },
      BalanceSet: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        free: 'u128',
        reserved: 'u128',
      },
      TotalIssuanceSet: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
      },
      Withdrawn: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      Slashed: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        freeAmount: 'u128',
        reservedAmount: 'u128',
      },
      Deposited: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      LockSet: {
        lockId: '[u8;8]',
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      LockRemoved: {
        lockId: '[u8;8]',
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
      },
      Locked: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128',
      },
      Unlocked: {
        currencyId: 'CfgTypesTokensCurrencyId',
        who: 'AccountId32',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup278: chainbridge::pallet::Event<T>
   **/
  ChainbridgeEvent: {
    _enum: {
      RelayerThresholdChanged: 'u32',
      ChainWhitelisted: 'u8',
      RelayerAdded: 'AccountId32',
      RelayerRemoved: 'AccountId32',
      FungibleTransfer: '(u8,u64,[u8;32],U256,Bytes)',
      NonFungibleTransfer: '(u8,u64,[u8;32],Bytes,Bytes,Bytes)',
      GenericTransfer: '(u8,u64,[u8;32],Bytes)',
      VoteFor: '(u8,u64,AccountId32)',
      VoteAgainst: '(u8,u64,AccountId32)',
      ProposalApproved: '(u8,u64)',
      ProposalRejected: '(u8,u64)',
      ProposalSucceeded: '(u8,u64)',
      ProposalFailed: '(u8,u64)'
    }
  },
  /**
   * Lookup279: orml_asset_registry::module::Event<T>
   **/
  OrmlAssetRegistryModuleEvent: {
    _enum: {
      RegisteredAsset: {
        assetId: 'CfgTypesTokensCurrencyId',
        metadata: 'OrmlTraitsAssetRegistryAssetMetadata',
      },
      UpdatedAsset: {
        assetId: 'CfgTypesTokensCurrencyId',
        metadata: 'OrmlTraitsAssetRegistryAssetMetadata'
      }
    }
  },
  /**
   * Lookup280: orml_traits::asset_registry::AssetMetadata<Balance, cfg_types::tokens::CustomMetadata>
   **/
  OrmlTraitsAssetRegistryAssetMetadata: {
    decimals: 'u32',
    name: 'Bytes',
    symbol: 'Bytes',
    existentialDeposit: 'u128',
    location: 'Option<XcmVersionedMultiLocation>',
    additional: 'CfgTypesTokensCustomMetadata'
  },
  /**
   * Lookup281: cfg_types::tokens::CustomMetadata
   **/
  CfgTypesTokensCustomMetadata: {
    transferability: 'CfgTypesTokensCrossChainTransferability',
    mintable: 'bool',
    permissioned: 'bool',
    poolCurrency: 'bool'
  },
  /**
   * Lookup282: cfg_types::tokens::CrossChainTransferability
   **/
  CfgTypesTokensCrossChainTransferability: {
    _enum: {
      None: 'Null',
      Xcm: 'CfgTypesXcmXcmMetadata',
      Connectors: 'Null',
      All: 'CfgTypesXcmXcmMetadata'
    }
  },
  /**
   * Lookup283: cfg_types::xcm::XcmMetadata
   **/
  CfgTypesXcmXcmMetadata: {
    feePerSecond: 'Option<u128>'
  },
  /**
   * Lookup285: orml_xcm::module::Event<T>
   **/
  OrmlXcmModuleEvent: {
    _enum: {
      Sent: {
        to: 'XcmV3MultiLocation',
        message: 'XcmV3Xcm'
      }
    }
  },
  /**
   * Lookup286: orml_oracle::module::Event<T, I>
   **/
  OrmlOracleModuleEvent: {
    _enum: {
      NewFeedData: {
        sender: 'AccountId32',
        values: 'Vec<(CfgTypesOraclesOracleKey,u128)>'
      }
    }
  },
  /**
   * Lookup289: pallet_membership::pallet::Event<T, I>
   **/
  PalletMembershipEvent: {
    _enum: ['MemberAdded', 'MemberRemoved', 'MembersSwapped', 'MembersReset', 'KeyChanged', 'Dummy']
  },
  /**
   * Lookup290: pallet_evm::pallet::Event<T>
   **/
  PalletEvmEvent: {
    _enum: {
      Log: {
        log: 'EthereumLog',
      },
      Created: {
        address: 'H160',
      },
      CreatedFailed: {
        address: 'H160',
      },
      Executed: {
        address: 'H160',
      },
      ExecutedFailed: {
        address: 'H160'
      }
    }
  },
  /**
   * Lookup291: ethereum::log::Log
   **/
  EthereumLog: {
    address: 'H160',
    topics: 'Vec<H256>',
    data: 'Bytes'
  },
  /**
   * Lookup293: pallet_base_fee::pallet::Event
   **/
  PalletBaseFeeEvent: {
    _enum: {
      NewBaseFeePerGas: {
        fee: 'U256',
      },
      BaseFeeOverflow: 'Null',
      NewElasticity: {
        elasticity: 'Permill'
      }
    }
  },
  /**
   * Lookup295: pallet_ethereum::pallet::Event
   **/
  PalletEthereumEvent: {
    _enum: {
      Executed: {
        from: 'H160',
        to: 'H160',
        transactionHash: 'H256',
        exitReason: 'EvmCoreErrorExitReason'
      }
    }
  },
  /**
   * Lookup296: evm_core::error::ExitReason
   **/
  EvmCoreErrorExitReason: {
    _enum: {
      Succeed: 'EvmCoreErrorExitSucceed',
      Error: 'EvmCoreErrorExitError',
      Revert: 'EvmCoreErrorExitRevert',
      Fatal: 'EvmCoreErrorExitFatal'
    }
  },
  /**
   * Lookup297: evm_core::error::ExitSucceed
   **/
  EvmCoreErrorExitSucceed: {
    _enum: ['Stopped', 'Returned', 'Suicided']
  },
  /**
   * Lookup298: evm_core::error::ExitError
   **/
  EvmCoreErrorExitError: {
    _enum: {
      StackUnderflow: 'Null',
      StackOverflow: 'Null',
      InvalidJump: 'Null',
      InvalidRange: 'Null',
      DesignatedInvalid: 'Null',
      CallTooDeep: 'Null',
      CreateCollision: 'Null',
      CreateContractLimit: 'Null',
      OutOfOffset: 'Null',
      OutOfGas: 'Null',
      OutOfFund: 'Null',
      PCUnderflow: 'Null',
      CreateEmpty: 'Null',
      Other: 'Text',
      __Unused14: 'Null',
      InvalidCode: 'u8'
    }
  },
  /**
   * Lookup302: evm_core::error::ExitRevert
   **/
  EvmCoreErrorExitRevert: {
    _enum: ['Reverted']
  },
  /**
   * Lookup303: evm_core::error::ExitFatal
   **/
  EvmCoreErrorExitFatal: {
    _enum: {
      NotSupported: 'Null',
      UnhandledInterrupt: 'Null',
      CallErrorAsFatal: 'EvmCoreErrorExitError',
      Other: 'Text'
    }
  },
  /**
   * Lookup304: pallet_ethereum_transaction::pallet::Event<T>
   **/
  PalletEthereumTransactionEvent: {
    _enum: {
      Executed: {
        from: 'H160',
        to: 'H160',
        exitReason: 'EvmCoreErrorExitReason',
        value: 'Bytes'
      }
    }
  },
  /**
   * Lookup305: pallet_migration_manager::pallet::Event<T>
   **/
  PalletMigrationManagerEvent: {
    _enum: {
      MigratedSystemAccounts: 'u32',
      MigratedVestingAccounts: 'u32',
      MigratedProxyProxies: 'u32',
      MigratedTotalIssuance: '(u128,u128)',
      FailedToMigrateVestingFor: 'AccountId32',
      MigratedVestingFor: '(AccountId32,u128,u128,u32)',
      FailedToMigrateProxyDataFor: 'AccountId32',
      MigratedProxyDataFor: '(AccountId32,u128,u64)',
      MigrationFinished: 'Null'
    }
  },
  /**
   * Lookup306: pallet_sudo::pallet::Event<T>
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
      KeyChanged: {
        oldSudoer: 'Option<AccountId32>',
      },
      SudoAsDone: {
        sudoResult: 'Result<Null, SpRuntimeDispatchError>'
      }
    }
  },
  /**
   * Lookup307: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null'
    }
  },
  /**
   * Lookup309: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text'
  },
  /**
   * Lookup310: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_storage: {
        items: 'Vec<(Bytes,Bytes)>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Bytes>',
      },
      kill_prefix: {
        prefix: 'Bytes',
        subkeys: 'u32',
      },
      remark_with_event: {
        remark: 'Bytes'
      }
    }
  },
  /**
   * Lookup314: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'SpWeightsWeightV2Weight',
    maxBlock: 'SpWeightsWeightV2Weight',
    perClass: 'FrameSupportDispatchPerDispatchClassWeightsPerClass'
  },
  /**
   * Lookup315: frame_support::dispatch::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportDispatchPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass'
  },
  /**
   * Lookup316: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'SpWeightsWeightV2Weight',
    maxExtrinsic: 'Option<SpWeightsWeightV2Weight>',
    maxTotal: 'Option<SpWeightsWeightV2Weight>',
    reserved: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup317: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportDispatchPerDispatchClassU32'
  },
  /**
   * Lookup318: frame_support::dispatch::PerDispatchClass<T>
   **/
  FrameSupportDispatchPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32'
  },
  /**
   * Lookup319: sp_weights::RuntimeDbWeight
   **/
  SpWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64'
  },
  /**
   * Lookup320: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32',
    stateVersion: 'u8'
  },
  /**
   * Lookup324: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNeedsToIncrease', 'FailedToExtractRuntimeVersion', 'NonDefaultComposite', 'NonZeroRefCount', 'CallFiltered']
  },
  /**
   * Lookup325: polkadot_primitives::v2::PersistedValidationData<primitive_types::H256, N>
   **/
  PolkadotPrimitivesV2PersistedValidationData: {
    parentHead: 'Bytes',
    relayParentNumber: 'u32',
    relayParentStorageRoot: 'H256',
    maxPovSize: 'u32'
  },
  /**
   * Lookup328: polkadot_primitives::v2::UpgradeRestriction
   **/
  PolkadotPrimitivesV2UpgradeRestriction: {
    _enum: ['Present']
  },
  /**
   * Lookup329: sp_trie::storage_proof::StorageProof
   **/
  SpTrieStorageProof: {
    trieNodes: 'BTreeSet<Bytes>'
  },
  /**
   * Lookup331: cumulus_pallet_parachain_system::relay_state_snapshot::MessagingStateSnapshot
   **/
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot: {
    dmqMqcHead: 'H256',
    relayDispatchQueueSize: '(u32,u32)',
    ingressChannels: 'Vec<(u32,PolkadotPrimitivesV2AbridgedHrmpChannel)>',
    egressChannels: 'Vec<(u32,PolkadotPrimitivesV2AbridgedHrmpChannel)>'
  },
  /**
   * Lookup334: polkadot_primitives::v2::AbridgedHrmpChannel
   **/
  PolkadotPrimitivesV2AbridgedHrmpChannel: {
    maxCapacity: 'u32',
    maxTotalSize: 'u32',
    maxMessageSize: 'u32',
    msgCount: 'u32',
    totalSize: 'u32',
    mqcHead: 'Option<H256>'
  },
  /**
   * Lookup336: polkadot_primitives::v2::AbridgedHostConfiguration
   **/
  PolkadotPrimitivesV2AbridgedHostConfiguration: {
    maxCodeSize: 'u32',
    maxHeadDataSize: 'u32',
    maxUpwardQueueCount: 'u32',
    maxUpwardQueueSize: 'u32',
    maxUpwardMessageSize: 'u32',
    maxUpwardMessageNumPerCandidate: 'u32',
    hrmpMaxMessageNumPerCandidate: 'u32',
    validationUpgradeCooldown: 'u32',
    validationUpgradeDelay: 'u32'
  },
  /**
   * Lookup342: polkadot_core_primitives::OutboundHrmpMessage<polkadot_parachain::primitives::Id>
   **/
  PolkadotCorePrimitivesOutboundHrmpMessage: {
    recipient: 'u32',
    data: 'Bytes'
  },
  /**
   * Lookup343: cumulus_pallet_parachain_system::pallet::Call<T>
   **/
  CumulusPalletParachainSystemCall: {
    _enum: {
      set_validation_data: {
        data: 'CumulusPrimitivesParachainInherentParachainInherentData',
      },
      sudo_send_upward_message: {
        message: 'Bytes',
      },
      authorize_upgrade: {
        codeHash: 'H256',
      },
      enact_authorized_upgrade: {
        code: 'Bytes'
      }
    }
  },
  /**
   * Lookup344: cumulus_primitives_parachain_inherent::ParachainInherentData
   **/
  CumulusPrimitivesParachainInherentParachainInherentData: {
    validationData: 'PolkadotPrimitivesV2PersistedValidationData',
    relayChainState: 'SpTrieStorageProof',
    downwardMessages: 'Vec<PolkadotCorePrimitivesInboundDownwardMessage>',
    horizontalMessages: 'BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>'
  },
  /**
   * Lookup346: polkadot_core_primitives::InboundDownwardMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundDownwardMessage: {
    sentAt: 'u32',
    msg: 'Bytes'
  },
  /**
   * Lookup349: polkadot_core_primitives::InboundHrmpMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundHrmpMessage: {
    sentAt: 'u32',
    data: 'Bytes'
  },
  /**
   * Lookup352: cumulus_pallet_parachain_system::pallet::Error<T>
   **/
  CumulusPalletParachainSystemError: {
    _enum: ['OverlappingUpgrades', 'ProhibitedByPolkadot', 'TooBig', 'ValidationDataNotAvailable', 'HostConfigurationNotAvailable', 'NotScheduled', 'NothingAuthorized', 'Unauthorized']
  },
  /**
   * Lookup354: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>'
      }
    }
  },
  /**
   * Lookup356: pallet_balances::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons'
  },
  /**
   * Lookup357: pallet_balances::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All']
  },
  /**
   * Lookup360: pallet_balances::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup362: pallet_balances::pallet::Call<T, I>
   **/
  PalletBalancesCall: {
    _enum: {
      transfer: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      set_balance: {
        who: 'MultiAddress',
        newFree: 'Compact<u128>',
        newReserved: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        value: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        keepAlive: 'bool',
      },
      force_unreserve: {
        who: 'MultiAddress',
        amount: 'u128'
      }
    }
  },
  /**
   * Lookup365: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'InsufficientBalance', 'ExistentialDeposit', 'KeepAlive', 'ExistingVestingSchedule', 'DeadAccount', 'TooManyReserves']
  },
  /**
   * Lookup367: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2']
  },
  /**
   * Lookup370: pallet_collator_selection::pallet::CandidateInfo<sp_core::crypto::AccountId32, Balance>
   **/
  PalletCollatorSelectionCandidateInfo: {
    who: 'AccountId32',
    deposit: 'u128'
  },
  /**
   * Lookup372: pallet_collator_selection::pallet::Call<T>
   **/
  PalletCollatorSelectionCall: {
    _enum: {
      set_invulnerables: {
        _alias: {
          new_: 'new',
        },
        new_: 'Vec<AccountId32>',
      },
      set_desired_candidates: {
        max: 'u32',
      },
      set_candidacy_bond: {
        bond: 'u128',
      },
      register_as_candidate: 'Null',
      leave_intent: 'Null'
    }
  },
  /**
   * Lookup373: pallet_collator_selection::pallet::Error<T>
   **/
  PalletCollatorSelectionError: {
    _enum: ['TooManyCandidates', 'TooFewCandidates', 'Unknown', 'Permission', 'AlreadyCandidate', 'NotCandidate', 'TooManyInvulnerables', 'AlreadyInvulnerable', 'NoAssociatedValidatorId', 'ValidatorNotRegistered']
  },
  /**
   * Lookup376: development_runtime::SessionKeys
   **/
  DevelopmentRuntimeSessionKeys: {
    aura: 'SpConsensusAuraSr25519AppSr25519Public',
    blockRewards: 'SpConsensusAuraSr25519AppSr25519Public'
  },
  /**
   * Lookup377: sp_consensus_aura::sr25519::app_sr25519::Public
   **/
  SpConsensusAuraSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup378: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup381: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup382: pallet_session::pallet::Call<T>
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'DevelopmentRuntimeSessionKeys',
        proof: 'Bytes',
      },
      purge_keys: 'Null'
    }
  },
  /**
   * Lookup383: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount']
  },
  /**
   * Lookup388: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32, MaxApprovals>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>'
  },
  /**
   * Lookup390: pallet_multisig::pallet::Call<T>
   **/
  PalletMultisigCall: {
    _enum: {
      as_multi_threshold_1: {
        otherSignatories: 'Vec<AccountId32>',
        call: 'Call',
      },
      as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        call: 'Call',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        callHash: '[u8;32]',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        timepoint: 'PalletMultisigTimepoint',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup392: pallet_proxy::pallet::Call<T>
   **/
  PalletProxyCall: {
    _enum: {
      proxy: {
        real: 'MultiAddress',
        forceProxyType: 'Option<DevelopmentRuntimeProxyType>',
        call: 'Call',
      },
      add_proxy: {
        delegate: 'MultiAddress',
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxy: {
        delegate: 'MultiAddress',
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32',
      },
      remove_proxies: 'Null',
      create_pure: {
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32',
        index: 'u16',
      },
      kill_pure: {
        spawner: 'MultiAddress',
        proxyType: 'DevelopmentRuntimeProxyType',
        index: 'u16',
        height: 'Compact<u32>',
        extIndex: 'Compact<u32>',
      },
      announce: {
        real: 'MultiAddress',
        callHash: 'H256',
      },
      remove_announcement: {
        real: 'MultiAddress',
        callHash: 'H256',
      },
      reject_announcement: {
        delegate: 'MultiAddress',
        callHash: 'H256',
      },
      proxy_announced: {
        delegate: 'MultiAddress',
        real: 'MultiAddress',
        forceProxyType: 'Option<DevelopmentRuntimeProxyType>',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup394: pallet_utility::pallet::Call<T>
   **/
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: 'Vec<Call>',
      },
      as_derivative: {
        index: 'u16',
        call: 'Call',
      },
      batch_all: {
        calls: 'Vec<Call>',
      },
      dispatch_as: {
        asOrigin: 'DevelopmentRuntimeOriginCaller',
        call: 'Call',
      },
      force_batch: {
        calls: 'Vec<Call>',
      },
      with_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup396: development_runtime::OriginCaller
   **/
  DevelopmentRuntimeOriginCaller: {
    _enum: {
      system: 'FrameSupportDispatchRawOrigin',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      __Unused4: 'Null',
      __Unused5: 'Null',
      Void: 'SpCoreVoid',
      __Unused7: 'Null',
      __Unused8: 'Null',
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      __Unused38: 'Null',
      __Unused39: 'Null',
      __Unused40: 'Null',
      __Unused41: 'Null',
      __Unused42: 'Null',
      __Unused43: 'Null',
      __Unused44: 'Null',
      __Unused45: 'Null',
      __Unused46: 'Null',
      __Unused47: 'Null',
      __Unused48: 'Null',
      __Unused49: 'Null',
      __Unused50: 'Null',
      __Unused51: 'Null',
      __Unused52: 'Null',
      __Unused53: 'Null',
      __Unused54: 'Null',
      __Unused55: 'Null',
      __Unused56: 'Null',
      __Unused57: 'Null',
      __Unused58: 'Null',
      __Unused59: 'Null',
      __Unused60: 'Null',
      __Unused61: 'Null',
      __Unused62: 'Null',
      __Unused63: 'Null',
      Council: 'PalletCollectiveRawOrigin',
      __Unused65: 'Null',
      __Unused66: 'Null',
      __Unused67: 'Null',
      __Unused68: 'Null',
      __Unused69: 'Null',
      __Unused70: 'Null',
      __Unused71: 'Null',
      __Unused72: 'Null',
      __Unused73: 'Null',
      __Unused74: 'Null',
      __Unused75: 'Null',
      __Unused76: 'Null',
      __Unused77: 'Null',
      __Unused78: 'Null',
      __Unused79: 'Null',
      __Unused80: 'Null',
      __Unused81: 'Null',
      __Unused82: 'Null',
      __Unused83: 'Null',
      __Unused84: 'Null',
      __Unused85: 'Null',
      __Unused86: 'Null',
      __Unused87: 'Null',
      __Unused88: 'Null',
      __Unused89: 'Null',
      __Unused90: 'Null',
      __Unused91: 'Null',
      __Unused92: 'Null',
      __Unused93: 'Null',
      __Unused94: 'Null',
      __Unused95: 'Null',
      __Unused96: 'Null',
      __Unused97: 'Null',
      __Unused98: 'Null',
      __Unused99: 'Null',
      __Unused100: 'Null',
      __Unused101: 'Null',
      __Unused102: 'Null',
      __Unused103: 'Null',
      __Unused104: 'Null',
      __Unused105: 'Null',
      __Unused106: 'Null',
      __Unused107: 'Null',
      __Unused108: 'Null',
      __Unused109: 'Null',
      __Unused110: 'Null',
      __Unused111: 'Null',
      __Unused112: 'Null',
      __Unused113: 'Null',
      __Unused114: 'Null',
      ConnectorsGateway: 'PalletConnectorsGatewayOriginGatewayOrigin',
      __Unused116: 'Null',
      __Unused117: 'Null',
      __Unused118: 'Null',
      __Unused119: 'Null',
      __Unused120: 'Null',
      PolkadotXcm: 'PalletXcmOrigin',
      CumulusXcm: 'CumulusPalletXcmOrigin',
      __Unused123: 'Null',
      __Unused124: 'Null',
      __Unused125: 'Null',
      __Unused126: 'Null',
      __Unused127: 'Null',
      __Unused128: 'Null',
      __Unused129: 'Null',
      __Unused130: 'Null',
      __Unused131: 'Null',
      __Unused132: 'Null',
      __Unused133: 'Null',
      __Unused134: 'Null',
      __Unused135: 'Null',
      __Unused136: 'Null',
      __Unused137: 'Null',
      __Unused138: 'Null',
      __Unused139: 'Null',
      __Unused140: 'Null',
      __Unused141: 'Null',
      __Unused142: 'Null',
      __Unused143: 'Null',
      __Unused144: 'Null',
      __Unused145: 'Null',
      __Unused146: 'Null',
      __Unused147: 'Null',
      __Unused148: 'Null',
      __Unused149: 'Null',
      __Unused150: 'Null',
      __Unused151: 'Null',
      __Unused152: 'Null',
      __Unused153: 'Null',
      __Unused154: 'Null',
      __Unused155: 'Null',
      __Unused156: 'Null',
      __Unused157: 'Null',
      __Unused158: 'Null',
      __Unused159: 'Null',
      __Unused160: 'Null',
      __Unused161: 'Null',
      __Unused162: 'Null',
      Ethereum: 'PalletEthereumRawOrigin'
    }
  },
  /**
   * Lookup397: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null'
    }
  },
  /**
   * Lookup398: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null'
    }
  },
  /**
   * Lookup399: pallet_connectors_gateway::origin::GatewayOrigin
   **/
  PalletConnectorsGatewayOriginGatewayOrigin: {
    _enum: {
      Local: 'CfgTypesDomainAddress'
    }
  },
  /**
   * Lookup400: pallet_xcm::pallet::Origin
   **/
  PalletXcmOrigin: {
    _enum: {
      Xcm: 'XcmV3MultiLocation',
      Response: 'XcmV3MultiLocation'
    }
  },
  /**
   * Lookup401: cumulus_pallet_xcm::pallet::Origin
   **/
  CumulusPalletXcmOrigin: {
    _enum: {
      Relay: 'Null',
      SiblingParachain: 'u32'
    }
  },
  /**
   * Lookup402: pallet_ethereum::RawOrigin
   **/
  PalletEthereumRawOrigin: {
    _enum: {
      EthereumTransaction: 'H160'
    }
  },
  /**
   * Lookup403: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup404: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: '[u8;32]',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      cancel_named: {
        id: '[u8;32]',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call',
      },
      schedule_named_after: {
        id: '[u8;32]',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup406: pallet_collective::pallet::Call<T, I>
   **/
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId32>',
        prime: 'Option<AccountId32>',
        oldCount: 'u32',
      },
      execute: {
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      propose: {
        threshold: 'Compact<u32>',
        proposal: 'Call',
        lengthBound: 'Compact<u32>',
      },
      vote: {
        proposal: 'H256',
        index: 'Compact<u32>',
        approve: 'bool',
      },
      close_old_weight: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'Compact<u64>',
        lengthBound: 'Compact<u32>',
      },
      disapprove_proposal: {
        proposalHash: 'H256',
      },
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'SpWeightsWeightV2Weight',
        lengthBound: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup409: pallet_elections_phragmen::pallet::Call<T>
   **/
  PalletElectionsPhragmenCall: {
    _enum: {
      vote: {
        votes: 'Vec<AccountId32>',
        value: 'Compact<u128>',
      },
      remove_voter: 'Null',
      submit_candidacy: {
        candidateCount: 'Compact<u32>',
      },
      renounce_candidacy: {
        renouncing: 'PalletElectionsPhragmenRenouncing',
      },
      remove_member: {
        who: 'MultiAddress',
        slashBond: 'bool',
        rerunElection: 'bool',
      },
      clean_defunct_voters: {
        numVoters: 'u32',
        numDefunct: 'u32'
      }
    }
  },
  /**
   * Lookup410: pallet_elections_phragmen::Renouncing
   **/
  PalletElectionsPhragmenRenouncing: {
    _enum: {
      Member: 'Null',
      RunnerUp: 'Null',
      Candidate: 'Compact<u32>'
    }
  },
  /**
   * Lookup411: pallet_democracy::pallet::Call<T>
   **/
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposal: 'FrameSupportPreimagesBounded',
        value: 'Compact<u128>',
      },
      second: {
        proposal: 'Compact<u32>',
      },
      vote: {
        refIndex: 'Compact<u32>',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      emergency_cancel: {
        refIndex: 'u32',
      },
      external_propose: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      external_propose_majority: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      external_propose_default: {
        proposal: 'FrameSupportPreimagesBounded',
      },
      fast_track: {
        proposalHash: 'H256',
        votingPeriod: 'u32',
        delay: 'u32',
      },
      veto_external: {
        proposalHash: 'H256',
      },
      cancel_referendum: {
        refIndex: 'Compact<u32>',
      },
      delegate: {
        to: 'MultiAddress',
        conviction: 'PalletDemocracyConviction',
        balance: 'u128',
      },
      undelegate: 'Null',
      clear_public_proposals: 'Null',
      unlock: {
        target: 'MultiAddress',
      },
      remove_vote: {
        index: 'u32',
      },
      remove_other_vote: {
        target: 'MultiAddress',
        index: 'u32',
      },
      blacklist: {
        proposalHash: 'H256',
        maybeRefIndex: 'Option<u32>',
      },
      cancel_proposal: {
        propIndex: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup412: frame_support::traits::preimages::Bounded<development_runtime::RuntimeCall>
   **/
  FrameSupportPreimagesBounded: {
    _enum: {
      Legacy: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      Inline: 'Bytes',
      Lookup: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        len: 'u32'
      }
    }
  },
  /**
   * Lookup414: pallet_democracy::conviction::Conviction
   **/
  PalletDemocracyConviction: {
    _enum: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x']
  },
  /**
   * Lookup415: pallet_identity::pallet::Call<T>
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'MultiAddress',
      },
      set_identity: {
        info: 'PalletIdentityIdentityInfo',
      },
      set_subs: {
        subs: 'Vec<(AccountId32,Data)>',
      },
      clear_identity: 'Null',
      request_judgement: {
        regIndex: 'Compact<u32>',
        maxFee: 'Compact<u128>',
      },
      cancel_request: {
        regIndex: 'u32',
      },
      set_fee: {
        index: 'Compact<u32>',
        fee: 'Compact<u128>',
      },
      set_account_id: {
        _alias: {
          new_: 'new',
        },
        index: 'Compact<u32>',
        new_: 'MultiAddress',
      },
      set_fields: {
        index: 'Compact<u32>',
        fields: 'PalletIdentityBitFlags',
      },
      provide_judgement: {
        regIndex: 'Compact<u32>',
        target: 'MultiAddress',
        judgement: 'PalletIdentityJudgement',
        identity: 'H256',
      },
      kill_identity: {
        target: 'MultiAddress',
      },
      add_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      rename_sub: {
        sub: 'MultiAddress',
        data: 'Data',
      },
      remove_sub: {
        sub: 'MultiAddress',
      },
      quit_sub: 'Null'
    }
  },
  /**
   * Lookup416: pallet_identity::types::IdentityInfo<FieldLimit>
   **/
  PalletIdentityIdentityInfo: {
    additional: 'Vec<(Data,Data)>',
    display: 'Data',
    legal: 'Data',
    web: 'Data',
    riot: 'Data',
    email: 'Data',
    pgpFingerprint: 'Option<[u8;20]>',
    image: 'Data',
    twitter: 'Data'
  },
  /**
   * Lookup451: pallet_identity::types::BitFlags<pallet_identity::types::IdentityField>
   **/
  PalletIdentityBitFlags: {
    _bitLength: 64,
    Display: 1,
    Legal: 2,
    Web: 4,
    Riot: 8,
    Email: 16,
    PgpFingerprint: 32,
    Image: 64,
    Twitter: 128
  },
  /**
   * Lookup452: pallet_identity::types::IdentityField
   **/
  PalletIdentityIdentityField: {
    _enum: ['__Unused0', 'Display', 'Legal', '__Unused3', 'Web', '__Unused5', '__Unused6', '__Unused7', 'Riot', '__Unused9', '__Unused10', '__Unused11', '__Unused12', '__Unused13', '__Unused14', '__Unused15', 'Email', '__Unused17', '__Unused18', '__Unused19', '__Unused20', '__Unused21', '__Unused22', '__Unused23', '__Unused24', '__Unused25', '__Unused26', '__Unused27', '__Unused28', '__Unused29', '__Unused30', '__Unused31', 'PgpFingerprint', '__Unused33', '__Unused34', '__Unused35', '__Unused36', '__Unused37', '__Unused38', '__Unused39', '__Unused40', '__Unused41', '__Unused42', '__Unused43', '__Unused44', '__Unused45', '__Unused46', '__Unused47', '__Unused48', '__Unused49', '__Unused50', '__Unused51', '__Unused52', '__Unused53', '__Unused54', '__Unused55', '__Unused56', '__Unused57', '__Unused58', '__Unused59', '__Unused60', '__Unused61', '__Unused62', '__Unused63', 'Image', '__Unused65', '__Unused66', '__Unused67', '__Unused68', '__Unused69', '__Unused70', '__Unused71', '__Unused72', '__Unused73', '__Unused74', '__Unused75', '__Unused76', '__Unused77', '__Unused78', '__Unused79', '__Unused80', '__Unused81', '__Unused82', '__Unused83', '__Unused84', '__Unused85', '__Unused86', '__Unused87', '__Unused88', '__Unused89', '__Unused90', '__Unused91', '__Unused92', '__Unused93', '__Unused94', '__Unused95', '__Unused96', '__Unused97', '__Unused98', '__Unused99', '__Unused100', '__Unused101', '__Unused102', '__Unused103', '__Unused104', '__Unused105', '__Unused106', '__Unused107', '__Unused108', '__Unused109', '__Unused110', '__Unused111', '__Unused112', '__Unused113', '__Unused114', '__Unused115', '__Unused116', '__Unused117', '__Unused118', '__Unused119', '__Unused120', '__Unused121', '__Unused122', '__Unused123', '__Unused124', '__Unused125', '__Unused126', '__Unused127', 'Twitter']
  },
  /**
   * Lookup453: pallet_identity::types::Judgement<Balance>
   **/
  PalletIdentityJudgement: {
    _enum: {
      Unknown: 'Null',
      FeePaid: 'u128',
      Reasonable: 'Null',
      KnownGood: 'Null',
      OutOfDate: 'Null',
      LowQuality: 'Null',
      Erroneous: 'Null'
    }
  },
  /**
   * Lookup454: pallet_vesting::pallet::Call<T>
   **/
  PalletVestingCall: {
    _enum: {
      vest: 'Null',
      vest_other: {
        target: 'MultiAddress',
      },
      vested_transfer: {
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      force_vested_transfer: {
        source: 'MultiAddress',
        target: 'MultiAddress',
        schedule: 'PalletVestingVestingInfo',
      },
      merge_schedules: {
        schedule1Index: 'u32',
        schedule2Index: 'u32'
      }
    }
  },
  /**
   * Lookup455: pallet_vesting::vesting_info::VestingInfo<Balance, BlockNumber>
   **/
  PalletVestingVestingInfo: {
    locked: 'u128',
    perBlock: 'u128',
    startingBlock: 'u32'
  },
  /**
   * Lookup456: pallet_treasury::pallet::Call<T, I>
   **/
  PalletTreasuryCall: {
    _enum: {
      propose_spend: {
        value: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      reject_proposal: {
        proposalId: 'Compact<u32>',
      },
      approve_proposal: {
        proposalId: 'Compact<u32>',
      },
      spend: {
        amount: 'Compact<u128>',
        beneficiary: 'MultiAddress',
      },
      remove_approval: {
        proposalId: 'Compact<u32>'
      }
    }
  },
  /**
   * Lookup457: pallet_uniques::pallet::Call<T, I>
   **/
  PalletUniquesCall: {
    _enum: {
      create: {
        collection: 'u64',
        admin: 'MultiAddress',
      },
      force_create: {
        collection: 'u64',
        owner: 'MultiAddress',
        freeHolding: 'bool',
      },
      destroy: {
        collection: 'u64',
        witness: 'PalletUniquesDestroyWitness',
      },
      mint: {
        collection: 'u64',
        item: 'u128',
        owner: 'MultiAddress',
      },
      burn: {
        collection: 'u64',
        item: 'u128',
        checkOwner: 'Option<MultiAddress>',
      },
      transfer: {
        collection: 'u64',
        item: 'u128',
        dest: 'MultiAddress',
      },
      redeposit: {
        collection: 'u64',
        items: 'Vec<u128>',
      },
      freeze: {
        collection: 'u64',
        item: 'u128',
      },
      thaw: {
        collection: 'u64',
        item: 'u128',
      },
      freeze_collection: {
        collection: 'u64',
      },
      thaw_collection: {
        collection: 'u64',
      },
      transfer_ownership: {
        collection: 'u64',
        owner: 'MultiAddress',
      },
      set_team: {
        collection: 'u64',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
      },
      approve_transfer: {
        collection: 'u64',
        item: 'u128',
        delegate: 'MultiAddress',
      },
      cancel_approval: {
        collection: 'u64',
        item: 'u128',
        maybeCheckDelegate: 'Option<MultiAddress>',
      },
      force_item_status: {
        collection: 'u64',
        owner: 'MultiAddress',
        issuer: 'MultiAddress',
        admin: 'MultiAddress',
        freezer: 'MultiAddress',
        freeHolding: 'bool',
        isFrozen: 'bool',
      },
      set_attribute: {
        collection: 'u64',
        maybeItem: 'Option<u128>',
        key: 'Bytes',
        value: 'Bytes',
      },
      clear_attribute: {
        collection: 'u64',
        maybeItem: 'Option<u128>',
        key: 'Bytes',
      },
      set_metadata: {
        collection: 'u64',
        item: 'u128',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      clear_metadata: {
        collection: 'u64',
        item: 'u128',
      },
      set_collection_metadata: {
        collection: 'u64',
        data: 'Bytes',
        isFrozen: 'bool',
      },
      clear_collection_metadata: {
        collection: 'u64',
      },
      set_accept_ownership: {
        maybeCollection: 'Option<u64>',
      },
      set_collection_max_supply: {
        collection: 'u64',
        maxSupply: 'u32',
      },
      set_price: {
        collection: 'u64',
        item: 'u128',
        price: 'Option<u128>',
        whitelistedBuyer: 'Option<MultiAddress>',
      },
      buy_item: {
        collection: 'u64',
        item: 'u128',
        bidPrice: 'u128'
      }
    }
  },
  /**
   * Lookup458: pallet_uniques::types::DestroyWitness
   **/
  PalletUniquesDestroyWitness: {
    items: 'Compact<u32>',
    itemMetadatas: 'Compact<u32>',
    attributes: 'Compact<u32>'
  },
  /**
   * Lookup460: pallet_preimage::pallet::Call<T>
   **/
  PalletPreimageCall: {
    _enum: {
      note_preimage: {
        bytes: 'Bytes',
      },
      unnote_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      request_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
      },
      unrequest_preimage: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256'
      }
    }
  },
  /**
   * Lookup461: pallet_fees::pallet::Call<T>
   **/
  PalletFeesCall: {
    _enum: {
      set_fee: {
        key: 'CfgTypesFeeKeysFeeKey',
        fee: 'u128'
      }
    }
  },
  /**
   * Lookup462: pallet_anchors::pallet::Call<T>
   **/
  PalletAnchorsCall: {
    _enum: {
      pre_commit: {
        anchorId: 'H256',
        signingRoot: 'H256',
      },
      commit: {
        anchorIdPreimage: 'H256',
        docRoot: 'H256',
        proof: 'H256',
        storedUntilDate: 'u64',
      },
      evict_pre_commits: {
        anchorIds: 'Vec<H256>',
      },
      evict_anchors: 'Null'
    }
  },
  /**
   * Lookup464: pallet_claims::pallet::Call<T>
   **/
  PalletClaimsCall: {
    _enum: {
      claim: {
        accountId: 'AccountId32',
        amount: 'u128',
        sortedHashes: 'Vec<H256>',
      },
      set_upload_account: {
        accountId: 'AccountId32',
      },
      store_root_hash: {
        rootHash: 'H256'
      }
    }
  },
  /**
   * Lookup465: pallet_crowdloan_claim::pallet::Call<T>
   **/
  PalletCrowdloanClaimCall: {
    _enum: {
      claim_reward: {
        relaychainAccountId: 'AccountId32',
        parachainAccountId: 'AccountId32',
        identityProof: 'SpRuntimeMultiSignature',
        contributionProof: 'ProofsProof',
        contribution: 'u128',
      },
      initialize: {
        contributions: 'H256',
        lockedAt: 'u32',
        index: 'u32',
        leaseStart: 'u32',
        leasePeriod: 'u32',
      },
      set_lease_start: {
        start: 'u32',
      },
      set_lease_period: {
        period: 'u32',
      },
      set_contributions_root: {
        root: 'H256',
      },
      set_locked_at: {
        lockedAt: 'u32',
      },
      set_crowdloan_trie_index: {
        trieIndex: 'u32'
      }
    }
  },
  /**
   * Lookup466: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature'
    }
  },
  /**
   * Lookup467: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup469: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup470: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup472: proofs::Proof<primitive_types::H256>
   **/
  ProofsProof: {
    leafHash: 'H256',
    sortedHashes: 'Vec<H256>'
  },
  /**
   * Lookup473: pallet_crowdloan_reward::pallet::Call<T>
   **/
  PalletCrowdloanRewardCall: {
    _enum: {
      initialize: {
        directPayoutRatio: 'Perbill',
        vestingPeriod: 'u32',
        vestingStart: 'u32',
      },
      set_vesting_start: {
        start: 'u32',
      },
      set_vesting_period: {
        period: 'u32',
      },
      set_direct_payout_ratio: {
        ratio: 'Perbill'
      }
    }
  },
  /**
   * Lookup474: pallet_pool_system::pallet::Call<T>
   **/
  PalletPoolSystemCall: {
    _enum: {
      set_max_reserve: {
        poolId: 'u64',
        maxReserve: 'u128',
      },
      close_epoch: {
        poolId: 'u64',
      },
      submit_solution: {
        poolId: 'u64',
        solution: 'Vec<PalletPoolSystemTranchesTrancheSolution>',
      },
      execute_epoch: {
        poolId: 'u64'
      }
    }
  },
  /**
   * Lookup475: pallet_loans::pallet::Call<T>
   **/
  PalletLoansCall: {
    _enum: {
      create: {
        poolId: 'u64',
        info: 'PalletLoansEntitiesLoansLoanInfo',
      },
      borrow: {
        poolId: 'u64',
        loanId: 'u64',
        amount: 'PalletLoansEntitiesPricingPricingAmount',
      },
      repay: {
        poolId: 'u64',
        loanId: 'u64',
        amount: 'PalletLoansEntitiesPricingRepaidPricingAmount',
      },
      write_off: {
        poolId: 'u64',
        loanId: 'u64',
      },
      admin_write_off: {
        poolId: 'u64',
        loanId: 'u64',
        percentage: 'u128',
        penalty: 'u128',
      },
      propose_loan_mutation: {
        poolId: 'u64',
        loanId: 'u64',
        mutation: 'PalletLoansLoanMutation',
      },
      apply_loan_mutation: {
        poolId: 'u64',
        changeId: 'H256',
      },
      close: {
        poolId: 'u64',
        loanId: 'u64',
      },
      propose_write_off_policy: {
        poolId: 'u64',
        policy: 'Vec<PalletLoansPolicyWriteOffRule>',
      },
      apply_write_off_policy: {
        poolId: 'u64',
        changeId: 'H256',
      },
      update_portfolio_valuation: {
        poolId: 'u64'
      }
    }
  },
  /**
   * Lookup476: pallet_permissions::pallet::Call<T>
   **/
  PalletPermissionsCall: {
    _enum: {
      add: {
        withRole: 'CfgTypesPermissionsRole',
        to: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope',
        role: 'CfgTypesPermissionsRole',
      },
      remove: {
        withRole: 'CfgTypesPermissionsRole',
        from: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope',
        role: 'CfgTypesPermissionsRole',
      },
      purge: {
        scope: 'CfgTypesPermissionsPermissionScope',
      },
      admin_purge: {
        from: 'AccountId32',
        scope: 'CfgTypesPermissionsPermissionScope'
      }
    }
  },
  /**
   * Lookup477: pallet_collator_allowlist::pallet::Call<T>
   **/
  PalletCollatorAllowlistCall: {
    _enum: {
      add: {
        collatorId: 'AccountId32',
      },
      remove: {
        collatorId: 'AccountId32'
      }
    }
  },
  /**
   * Lookup478: pallet_restricted_tokens::pallet::Call<T>
   **/
  PalletRestrictedTokensCall: {
    _enum: {
      transfer: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        keepAlive: 'bool',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'Compact<u128>',
      },
      force_transfer: {
        source: 'MultiAddress',
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'Compact<u128>',
      },
      set_balance: {
        who: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        newFree: 'Compact<u128>',
        newReserved: 'Compact<u128>'
      }
    }
  },
  /**
   * Lookup479: pallet_nft_sales::pallet::Call<T>
   **/
  PalletNftSalesCall: {
    _enum: {
      add: {
        classId: 'u64',
        instanceId: 'u128',
        price: 'PalletNftSalesPrice',
      },
      remove: {
        classId: 'u64',
        instanceId: 'u128',
      },
      buy: {
        classId: 'u64',
        instanceId: 'u128',
        maxOffer: 'PalletNftSalesPrice'
      }
    }
  },
  /**
   * Lookup480: pallet_bridge::pallet::Call<T>
   **/
  PalletBridgeCall: {
    _enum: {
      transfer_native: {
        amount: 'u128',
        recipient: 'Bytes',
        destId: 'u8',
      },
      transfer: {
        to: 'AccountId32',
        amount: 'u128',
        rId: '[u8;32]',
      },
      remark: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'H256',
        rId: '[u8;32]'
      }
    }
  },
  /**
   * Lookup481: pallet_nft::pallet::Call<T>
   **/
  PalletNftCall: {
    _enum: {
      validate_mint: {
        anchorId: 'H256',
        depositAddress: '[u8;20]',
        proofs: 'Vec<ProofsProof>',
        staticProofs: '[H256;3]',
        destId: 'u8'
      }
    }
  },
  /**
   * Lookup484: pallet_keystore::pallet::Call<T>
   **/
  PalletKeystoreCall: {
    _enum: {
      add_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<PalletKeystoreAddKey>',
      },
      revoke_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<H256>',
        keyPurpose: 'PalletKeystoreKeyPurpose',
      },
      set_deposit: {
        newDeposit: 'u128'
      }
    }
  },
  /**
   * Lookup486: pallet_keystore::AddKey<primitive_types::H256>
   **/
  PalletKeystoreAddKey: {
    key: 'H256',
    purpose: 'PalletKeystoreKeyPurpose',
    keyType: 'PalletKeystoreKeyType'
  },
  /**
   * Lookup487: pallet_investments::pallet::Call<T>
   **/
  PalletInvestmentsCall: {
    _enum: {
      update_invest_order: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        amount: 'u128',
      },
      update_redeem_order: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
        amount: 'u128',
      },
      collect_investments: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      collect_redemptions: {
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      collect_investments_for: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
      collect_redemptions_for: {
        who: 'AccountId32',
        investmentId: 'CfgTypesTokensTrancheCurrency'
      }
    }
  },
  /**
   * Lookup488: pallet_liquidity_rewards::pallet::Call<T>
   **/
  PalletLiquidityRewardsCall: {
    _enum: {
      stake: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
      },
      unstake: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
      },
      claim_reward: {
        currencyId: 'CfgTypesTokensCurrencyId',
      },
      set_distributed_reward: {
        balance: 'u128',
      },
      set_epoch_duration: {
        duration: 'u64',
      },
      set_group_weight: {
        groupId: 'u32',
        weight: 'u64',
      },
      set_currency_group: {
        currencyId: 'CfgTypesTokensCurrencyId',
        groupId: 'u32'
      }
    }
  },
  /**
   * Lookup489: pallet_connectors::pallet::Call<T>
   **/
  PalletConnectorsCall: {
    _enum: {
      set_domain_router: {
        domain: 'CfgTypesDomainAddressDomain',
        router: 'PalletConnectorsRoutersRouter',
      },
      add_connector: {
        connector: 'AccountId32',
      },
      add_pool: {
        poolId: 'u64',
        domain: 'CfgTypesDomainAddressDomain',
      },
      add_tranche: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domain: 'CfgTypesDomainAddressDomain',
      },
      update_token_price: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domain: 'CfgTypesDomainAddressDomain',
      },
      update_member: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domainAddress: 'CfgTypesDomainAddress',
        validUntil: 'u64',
      },
      transfer_tranche_tokens: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domainAddress: 'CfgTypesDomainAddress',
        amount: 'u128',
      },
      transfer: {
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesDomainAddress',
        amount: 'u128',
      },
      add_currency: {
        currencyId: 'CfgTypesTokensCurrencyId',
      },
      __Unused9: 'Null',
      __Unused10: 'Null',
      __Unused11: 'Null',
      __Unused12: 'Null',
      __Unused13: 'Null',
      __Unused14: 'Null',
      __Unused15: 'Null',
      __Unused16: 'Null',
      __Unused17: 'Null',
      __Unused18: 'Null',
      __Unused19: 'Null',
      __Unused20: 'Null',
      __Unused21: 'Null',
      __Unused22: 'Null',
      __Unused23: 'Null',
      __Unused24: 'Null',
      __Unused25: 'Null',
      __Unused26: 'Null',
      __Unused27: 'Null',
      __Unused28: 'Null',
      __Unused29: 'Null',
      __Unused30: 'Null',
      __Unused31: 'Null',
      __Unused32: 'Null',
      __Unused33: 'Null',
      __Unused34: 'Null',
      __Unused35: 'Null',
      __Unused36: 'Null',
      __Unused37: 'Null',
      __Unused38: 'Null',
      __Unused39: 'Null',
      __Unused40: 'Null',
      __Unused41: 'Null',
      __Unused42: 'Null',
      __Unused43: 'Null',
      __Unused44: 'Null',
      __Unused45: 'Null',
      __Unused46: 'Null',
      __Unused47: 'Null',
      __Unused48: 'Null',
      __Unused49: 'Null',
      __Unused50: 'Null',
      __Unused51: 'Null',
      __Unused52: 'Null',
      __Unused53: 'Null',
      __Unused54: 'Null',
      __Unused55: 'Null',
      __Unused56: 'Null',
      __Unused57: 'Null',
      __Unused58: 'Null',
      __Unused59: 'Null',
      __Unused60: 'Null',
      __Unused61: 'Null',
      __Unused62: 'Null',
      __Unused63: 'Null',
      __Unused64: 'Null',
      __Unused65: 'Null',
      __Unused66: 'Null',
      __Unused67: 'Null',
      __Unused68: 'Null',
      __Unused69: 'Null',
      __Unused70: 'Null',
      __Unused71: 'Null',
      __Unused72: 'Null',
      __Unused73: 'Null',
      __Unused74: 'Null',
      __Unused75: 'Null',
      __Unused76: 'Null',
      __Unused77: 'Null',
      __Unused78: 'Null',
      __Unused79: 'Null',
      __Unused80: 'Null',
      __Unused81: 'Null',
      __Unused82: 'Null',
      __Unused83: 'Null',
      __Unused84: 'Null',
      __Unused85: 'Null',
      __Unused86: 'Null',
      __Unused87: 'Null',
      __Unused88: 'Null',
      __Unused89: 'Null',
      allow_pool_currency: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        currencyId: 'CfgTypesTokensCurrencyId'
      }
    }
  },
  /**
   * Lookup490: pallet_pool_registry::pallet::Call<T>
   **/
  PalletPoolRegistryCall: {
    _enum: {
      register: {
        admin: 'AccountId32',
        poolId: 'u64',
        trancheInputs: 'Vec<PalletPoolSystemTranchesTrancheInput>',
        currency: 'CfgTypesTokensCurrencyId',
        maxReserve: 'u128',
        metadata: 'Option<Bytes>',
      },
      update: {
        poolId: 'u64',
        changes: 'PalletPoolSystemPoolTypesPoolChanges',
      },
      execute_update: {
        poolId: 'u64',
      },
      set_metadata: {
        poolId: 'u64',
        metadata: 'Bytes'
      }
    }
  },
  /**
   * Lookup492: pallet_pool_system::tranches::TrancheInput<cfg_types::fixed_point::FixedU128, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  PalletPoolSystemTranchesTrancheInput: {
    trancheType: 'PalletPoolSystemTranchesTrancheType',
    seniority: 'Option<u32>',
    metadata: 'CfgTypesPoolsTrancheMetadata'
  },
  /**
   * Lookup494: pallet_pool_system::pool_types::PoolChanges<cfg_types::fixed_point::FixedU128, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes, development_runtime::MaxTranches>
   **/
  PalletPoolSystemPoolTypesPoolChanges: {
    tranches: {
      _enum: {
        NoChange: 'Null',
        NewValue: 'Vec<PalletPoolSystemTranchesTrancheUpdate>'
      }
    },
    trancheMetadata: 'OrmlTraitsChangeBoundedVec',
    minEpochTime: 'OrmlTraitsChangeU64',
    maxNavAge: 'OrmlTraitsChangeU64'
  },
  /**
   * Lookup497: pallet_pool_system::tranches::TrancheUpdate<cfg_types::fixed_point::FixedU128>
   **/
  PalletPoolSystemTranchesTrancheUpdate: {
    trancheType: 'PalletPoolSystemTranchesTrancheType',
    seniority: 'Option<u32>'
  },
  /**
   * Lookup499: orml_traits::Change<sp_core::bounded::bounded_vec::BoundedVec<cfg_types::pools::TrancheMetadata<cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>, S>>
   **/
  OrmlTraitsChangeBoundedVec: {
    _enum: {
      NoChange: 'Null',
      NewValue: 'Vec<CfgTypesPoolsTrancheMetadata>'
    }
  },
  /**
   * Lookup502: orml_traits::Change<Value>
   **/
  OrmlTraitsChangeU64: {
    _enum: {
      NoChange: 'Null',
      NewValue: 'u64'
    }
  },
  /**
   * Lookup503: pallet_block_rewards::pallet::Call<T>
   **/
  PalletBlockRewardsCall: {
    _enum: {
      claim_reward: {
        accountId: 'AccountId32',
      },
      set_collator_reward: {
        collatorRewardPerSession: 'u128',
      },
      set_total_reward: {
        totalRewardPerSession: 'u128'
      }
    }
  },
  /**
   * Lookup504: pallet_transfer_allowlist::pallet::Call<T>
   **/
  PalletTransferAllowlistCall: {
    _enum: {
      add_transfer_allowance: {
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
      },
      remove_transfer_allowance: {
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
      },
      purge_transfer_allowance: {
        currencyId: 'CfgTypesTokensCurrencyId',
        receiver: 'CfgTypesLocationsLocation',
      },
      add_allowance_delay: {
        currencyId: 'CfgTypesTokensCurrencyId',
        delay: 'u32',
      },
      update_allowance_delay: {
        currencyId: 'CfgTypesTokensCurrencyId',
        delay: 'u32',
      },
      toggle_allowance_delay_once_future_modifiable: {
        currencyId: 'CfgTypesTokensCurrencyId',
      },
      purge_allowance_delay: {
        currencyId: 'CfgTypesTokensCurrencyId'
      }
    }
  },
  /**
   * Lookup505: pallet_connectors_gateway::pallet::Call<T>
   **/
  PalletConnectorsGatewayCall: {
    _enum: {
      set_domain_router: {
        domain: 'CfgTypesDomainAddressDomain',
        router: 'ConnectorsGatewayRoutersDomainRouter',
      },
      add_connector: {
        connector: 'CfgTypesDomainAddress',
      },
      remove_connector: {
        connector: 'CfgTypesDomainAddress',
      },
      process_msg: {
        msg: 'Bytes'
      }
    }
  },
  /**
   * Lookup507: pallet_order_book::pallet::Call<T>
   **/
  PalletOrderBookCall: {
    _enum: {
      create_order_v1: {
        assetIn: 'CfgTypesTokensCurrencyId',
        assetOut: 'CfgTypesTokensCurrencyId',
        buyAmount: 'u128',
        price: 'u128',
      },
      user_cancel_order: {
        orderId: 'u64',
      },
      fill_order_full: {
        orderId: 'u64'
      }
    }
  },
  /**
   * Lookup508: cumulus_pallet_xcmp_queue::pallet::Call<T>
   **/
  CumulusPalletXcmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'SpWeightsWeightV2Weight',
      },
      suspend_xcm_execution: 'Null',
      resume_xcm_execution: 'Null',
      update_suspend_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_drop_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_resume_threshold: {
        _alias: {
          new_: 'new',
        },
        new_: 'u32',
      },
      update_threshold_weight: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight',
      },
      update_weight_restrict_decay: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight',
      },
      update_xcmp_max_individual_weight: {
        _alias: {
          new_: 'new',
        },
        new_: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup509: pallet_xcm::pallet::Call<T>
   **/
  PalletXcmCall: {
    _enum: {
      send: {
        dest: 'XcmVersionedMultiLocation',
        message: 'XcmVersionedXcm',
      },
      teleport_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
      },
      reserve_transfer_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
      },
      execute: {
        message: 'XcmVersionedXcm',
        maxWeight: 'SpWeightsWeightV2Weight',
      },
      force_xcm_version: {
        location: 'XcmV3MultiLocation',
        xcmVersion: 'u32',
      },
      force_default_xcm_version: {
        maybeXcmVersion: 'Option<u32>',
      },
      force_subscribe_version_notify: {
        location: 'XcmVersionedMultiLocation',
      },
      force_unsubscribe_version_notify: {
        location: 'XcmVersionedMultiLocation',
      },
      limited_reserve_transfer_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
        weightLimit: 'XcmV3WeightLimit',
      },
      limited_teleport_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
        weightLimit: 'XcmV3WeightLimit'
      }
    }
  },
  /**
   * Lookup510: xcm::VersionedXcm<RuntimeCall>
   **/
  XcmVersionedXcm: {
    _enum: {
      __Unused0: 'Null',
      __Unused1: 'Null',
      V2: 'XcmV2Xcm',
      V3: 'XcmV3Xcm'
    }
  },
  /**
   * Lookup511: xcm::v2::Xcm<RuntimeCall>
   **/
  XcmV2Xcm: 'Vec<XcmV2Instruction>',
  /**
   * Lookup513: xcm::v2::Instruction<RuntimeCall>
   **/
  XcmV2Instruction: {
    _enum: {
      WithdrawAsset: 'XcmV2MultiassetMultiAssets',
      ReserveAssetDeposited: 'XcmV2MultiassetMultiAssets',
      ReceiveTeleportedAsset: 'XcmV2MultiassetMultiAssets',
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV2Response',
        maxWeight: 'Compact<u64>',
      },
      TransferAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        beneficiary: 'XcmV2MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      Transact: {
        originType: 'XcmV2OriginKind',
        requireWeightAtMost: 'Compact<u64>',
        call: 'XcmDoubleEncoded',
      },
      HrmpNewChannelOpenRequest: {
        sender: 'Compact<u32>',
        maxMessageSize: 'Compact<u32>',
        maxCapacity: 'Compact<u32>',
      },
      HrmpChannelAccepted: {
        recipient: 'Compact<u32>',
      },
      HrmpChannelClosing: {
        initiator: 'Compact<u32>',
        sender: 'Compact<u32>',
        recipient: 'Compact<u32>',
      },
      ClearOrigin: 'Null',
      DescendOrigin: 'XcmV2MultilocationJunctions',
      ReportError: {
        queryId: 'Compact<u64>',
        dest: 'XcmV2MultiLocation',
        maxResponseWeight: 'Compact<u64>',
      },
      DepositAsset: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        beneficiary: 'XcmV2MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      ExchangeAsset: {
        give: 'XcmV2MultiassetMultiAssetFilter',
        receive: 'XcmV2MultiassetMultiAssets',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        reserve: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      InitiateTeleport: {
        assets: 'XcmV2MultiassetMultiAssetFilter',
        dest: 'XcmV2MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      QueryHolding: {
        queryId: 'Compact<u64>',
        dest: 'XcmV2MultiLocation',
        assets: 'XcmV2MultiassetMultiAssetFilter',
        maxResponseWeight: 'Compact<u64>',
      },
      BuyExecution: {
        fees: 'XcmV2MultiAsset',
        weightLimit: 'XcmV2WeightLimit',
      },
      RefundSurplus: 'Null',
      SetErrorHandler: 'XcmV2Xcm',
      SetAppendix: 'XcmV2Xcm',
      ClearError: 'Null',
      ClaimAsset: {
        assets: 'XcmV2MultiassetMultiAssets',
        ticket: 'XcmV2MultiLocation',
      },
      Trap: 'Compact<u64>',
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'Compact<u64>',
      },
      UnsubscribeVersion: 'Null'
    }
  },
  /**
   * Lookup514: xcm::v2::Response
   **/
  XcmV2Response: {
    _enum: {
      Null: 'Null',
      Assets: 'XcmV2MultiassetMultiAssets',
      ExecutionResult: 'Option<(u32,XcmV2TraitsError)>',
      Version: 'u32'
    }
  },
  /**
   * Lookup517: xcm::v2::traits::Error
   **/
  XcmV2TraitsError: {
    _enum: {
      Overflow: 'Null',
      Unimplemented: 'Null',
      UntrustedReserveLocation: 'Null',
      UntrustedTeleportLocation: 'Null',
      MultiLocationFull: 'Null',
      MultiLocationNotInvertible: 'Null',
      BadOrigin: 'Null',
      InvalidLocation: 'Null',
      AssetNotFound: 'Null',
      FailedToTransactAsset: 'Null',
      NotWithdrawable: 'Null',
      LocationCannotHold: 'Null',
      ExceedsMaxMessageSize: 'Null',
      DestinationUnsupported: 'Null',
      Transport: 'Null',
      Unroutable: 'Null',
      UnknownClaim: 'Null',
      FailedToDecode: 'Null',
      MaxWeightInvalid: 'Null',
      NotHoldingFees: 'Null',
      TooExpensive: 'Null',
      Trap: 'u64',
      UnhandledXcmVersion: 'Null',
      WeightLimitReached: 'u64',
      Barrier: 'Null',
      WeightNotComputable: 'Null'
    }
  },
  /**
   * Lookup518: xcm::v2::multiasset::MultiAssetFilter
   **/
  XcmV2MultiassetMultiAssetFilter: {
    _enum: {
      Definite: 'XcmV2MultiassetMultiAssets',
      Wild: 'XcmV2MultiassetWildMultiAsset'
    }
  },
  /**
   * Lookup519: xcm::v2::multiasset::WildMultiAsset
   **/
  XcmV2MultiassetWildMultiAsset: {
    _enum: {
      All: 'Null',
      AllOf: {
        id: 'XcmV2MultiassetAssetId',
        fun: 'XcmV2MultiassetWildFungibility'
      }
    }
  },
  /**
   * Lookup520: xcm::v2::multiasset::WildFungibility
   **/
  XcmV2MultiassetWildFungibility: {
    _enum: ['Fungible', 'NonFungible']
  },
  /**
   * Lookup521: xcm::v2::WeightLimit
   **/
  XcmV2WeightLimit: {
    _enum: {
      Unlimited: 'Null',
      Limited: 'Compact<u64>'
    }
  },
  /**
   * Lookup530: cumulus_pallet_dmp_queue::pallet::Call<T>
   **/
  CumulusPalletDmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'SpWeightsWeightV2Weight'
      }
    }
  },
  /**
   * Lookup531: orml_xtokens::module::Call<T>
   **/
  OrmlXtokensModuleCall: {
    _enum: {
      transfer: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiasset: {
        asset: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_with_fee: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
        fee: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiasset_with_fee: {
        asset: 'XcmVersionedMultiAsset',
        fee: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multicurrencies: {
        currencies: 'Vec<(CfgTypesTokensCurrencyId,u128)>',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit',
      },
      transfer_multiassets: {
        assets: 'XcmVersionedMultiAssets',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeightLimit: 'XcmV3WeightLimit'
      }
    }
  },
  /**
   * Lookup532: xcm::VersionedMultiAsset
   **/
  XcmVersionedMultiAsset: {
    _enum: {
      __Unused0: 'Null',
      V2: 'XcmV2MultiAsset',
      __Unused2: 'Null',
      V3: 'XcmV3MultiAsset'
    }
  },
  /**
   * Lookup535: pallet_xcm_transactor::pallet::Call<T>
   **/
  PalletXcmTransactorCall: {
    _enum: {
      register: {
        who: 'AccountId32',
        index: 'u16',
      },
      deregister: {
        index: 'u16',
      },
      transact_through_derivative: {
        dest: 'DevelopmentRuntimeNullTransactor',
        index: 'u16',
        fee: 'PalletXcmTransactorCurrencyPayment',
        innerCall: 'Bytes',
        weightInfo: 'PalletXcmTransactorTransactWeights',
      },
      transact_through_sovereign: {
        dest: 'XcmVersionedMultiLocation',
        feePayer: 'AccountId32',
        fee: 'PalletXcmTransactorCurrencyPayment',
        call: 'Bytes',
        originKind: 'XcmV2OriginKind',
        weightInfo: 'PalletXcmTransactorTransactWeights',
      },
      set_transact_info: {
        location: 'XcmVersionedMultiLocation',
        transactExtraWeight: 'SpWeightsWeightV2Weight',
        maxWeight: 'SpWeightsWeightV2Weight',
        transactExtraWeightSigned: 'Option<SpWeightsWeightV2Weight>',
      },
      remove_transact_info: {
        location: 'XcmVersionedMultiLocation',
      },
      transact_through_signed: {
        dest: 'XcmVersionedMultiLocation',
        fee: 'PalletXcmTransactorCurrencyPayment',
        call: 'Bytes',
        weightInfo: 'PalletXcmTransactorTransactWeights',
      },
      set_fee_per_second: {
        assetLocation: 'XcmVersionedMultiLocation',
        feePerSecond: 'u128',
      },
      remove_fee_per_second: {
        assetLocation: 'XcmVersionedMultiLocation',
      },
      hrmp_manage: {
        action: 'PalletXcmTransactorHrmpOperation',
        fee: 'PalletXcmTransactorCurrencyPayment',
        weightInfo: 'PalletXcmTransactorTransactWeights'
      }
    }
  },
  /**
   * Lookup536: development_runtime::NullTransactor
   **/
  DevelopmentRuntimeNullTransactor: 'Null',
  /**
   * Lookup537: pallet_xcm_transactor::pallet::CurrencyPayment<cfg_types::tokens::CurrencyId>
   **/
  PalletXcmTransactorCurrencyPayment: {
    currency: 'PalletXcmTransactorCurrency',
    feeAmount: 'Option<u128>'
  },
  /**
   * Lookup538: pallet_xcm_transactor::pallet::Currency<cfg_types::tokens::CurrencyId>
   **/
  PalletXcmTransactorCurrency: {
    _enum: {
      AsCurrencyId: 'CfgTypesTokensCurrencyId',
      AsMultiLocation: 'XcmVersionedMultiLocation'
    }
  },
  /**
   * Lookup539: pallet_xcm_transactor::pallet::TransactWeights
   **/
  PalletXcmTransactorTransactWeights: {
    transactRequiredWeightAtMost: 'SpWeightsWeightV2Weight',
    overallWeight: 'Option<SpWeightsWeightV2Weight>'
  },
  /**
   * Lookup540: chainbridge::pallet::Call<T>
   **/
  ChainbridgeCall: {
    _enum: {
      set_threshold: {
        threshold: 'u32',
      },
      set_resource: {
        id: '[u8;32]',
        method: 'Bytes',
      },
      remove_resource: {
        id: '[u8;32]',
      },
      whitelist_chain: {
        id: 'u8',
      },
      add_relayer: {
        v: 'AccountId32',
      },
      remove_relayer: {
        accountId: 'AccountId32',
      },
      acknowledge_proposal: {
        nonce: 'u64',
        srcId: 'u8',
        rId: '[u8;32]',
        call: 'Call',
      },
      reject_proposal: {
        nonce: 'u64',
        srcId: 'u8',
        rId: '[u8;32]',
        call: 'Call',
      },
      eval_vote_state: {
        nonce: 'u64',
        srcId: 'u8',
        proposal: 'Call'
      }
    }
  },
  /**
   * Lookup541: orml_asset_registry::module::Call<T>
   **/
  OrmlAssetRegistryModuleCall: {
    _enum: {
      register_asset: {
        metadata: 'OrmlTraitsAssetRegistryAssetMetadata',
        assetId: 'Option<CfgTypesTokensCurrencyId>',
      },
      update_asset: {
        assetId: 'CfgTypesTokensCurrencyId',
        decimals: 'Option<u32>',
        name: 'Option<Bytes>',
        symbol: 'Option<Bytes>',
        existentialDeposit: 'Option<u128>',
        location: 'Option<Option<XcmVersionedMultiLocation>>',
        additional: 'Option<CfgTypesTokensCustomMetadata>'
      }
    }
  },
  /**
   * Lookup545: orml_xcm::module::Call<T>
   **/
  OrmlXcmModuleCall: {
    _enum: {
      send_as_sovereign: {
        dest: 'XcmVersionedMultiLocation',
        message: 'XcmVersionedXcm'
      }
    }
  },
  /**
   * Lookup546: orml_oracle::module::Call<T, I>
   **/
  OrmlOracleModuleCall: {
    _enum: {
      feed_values: {
        values: 'Vec<(CfgTypesOraclesOracleKey,u128)>'
      }
    }
  },
  /**
   * Lookup547: pallet_membership::pallet::Call<T, I>
   **/
  PalletMembershipCall: {
    _enum: {
      add_member: {
        who: 'MultiAddress',
      },
      remove_member: {
        who: 'MultiAddress',
      },
      swap_member: {
        remove: 'MultiAddress',
        add: 'MultiAddress',
      },
      reset_members: {
        members: 'Vec<AccountId32>',
      },
      change_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      set_prime: {
        who: 'MultiAddress',
      },
      clear_prime: 'Null'
    }
  },
  /**
   * Lookup548: pallet_evm::pallet::Call<T>
   **/
  PalletEvmCall: {
    _enum: {
      withdraw: {
        address: 'H160',
        value: 'u128',
      },
      call: {
        source: 'H160',
        target: 'H160',
        input: 'Bytes',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>',
      },
      create: {
        source: 'H160',
        init: 'Bytes',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>',
      },
      create2: {
        source: 'H160',
        init: 'Bytes',
        salt: 'H256',
        value: 'U256',
        gasLimit: 'u64',
        maxFeePerGas: 'U256',
        maxPriorityFeePerGas: 'Option<U256>',
        nonce: 'Option<U256>',
        accessList: 'Vec<(H160,Vec<H256>)>'
      }
    }
  },
  /**
   * Lookup552: pallet_base_fee::pallet::Call<T>
   **/
  PalletBaseFeeCall: {
    _enum: {
      set_base_fee_per_gas: {
        fee: 'U256',
      },
      set_elasticity: {
        elasticity: 'Permill'
      }
    }
  },
  /**
   * Lookup553: pallet_ethereum::pallet::Call<T>
   **/
  PalletEthereumCall: {
    _enum: {
      transact: {
        transaction: 'EthereumTransactionTransactionV2'
      }
    }
  },
  /**
   * Lookup554: ethereum::transaction::TransactionV2
   **/
  EthereumTransactionTransactionV2: {
    _enum: {
      Legacy: 'EthereumTransactionLegacyTransaction',
      EIP2930: 'EthereumTransactionEip2930Transaction',
      EIP1559: 'EthereumTransactionEip1559Transaction'
    }
  },
  /**
   * Lookup555: ethereum::transaction::LegacyTransaction
   **/
  EthereumTransactionLegacyTransaction: {
    nonce: 'U256',
    gasPrice: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    signature: 'EthereumTransactionTransactionSignature'
  },
  /**
   * Lookup556: ethereum::transaction::TransactionAction
   **/
  EthereumTransactionTransactionAction: {
    _enum: {
      Call: 'H160',
      Create: 'Null'
    }
  },
  /**
   * Lookup557: ethereum::transaction::TransactionSignature
   **/
  EthereumTransactionTransactionSignature: {
    v: 'u64',
    r: 'H256',
    s: 'H256'
  },
  /**
   * Lookup559: ethereum::transaction::EIP2930Transaction
   **/
  EthereumTransactionEip2930Transaction: {
    chainId: 'u64',
    nonce: 'U256',
    gasPrice: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    accessList: 'Vec<EthereumTransactionAccessListItem>',
    oddYParity: 'bool',
    r: 'H256',
    s: 'H256'
  },
  /**
   * Lookup561: ethereum::transaction::AccessListItem
   **/
  EthereumTransactionAccessListItem: {
    address: 'H160',
    storageKeys: 'Vec<H256>'
  },
  /**
   * Lookup562: ethereum::transaction::EIP1559Transaction
   **/
  EthereumTransactionEip1559Transaction: {
    chainId: 'u64',
    nonce: 'U256',
    maxPriorityFeePerGas: 'U256',
    maxFeePerGas: 'U256',
    gasLimit: 'U256',
    action: 'EthereumTransactionTransactionAction',
    value: 'U256',
    input: 'Bytes',
    accessList: 'Vec<EthereumTransactionAccessListItem>',
    oddYParity: 'bool',
    r: 'H256',
    s: 'H256'
  },
  /**
   * Lookup563: pallet_migration_manager::pallet::Call<T>
   **/
  PalletMigrationManagerCall: {
    _enum: {
      migrate_system_account: {
        accounts: 'Vec<(Bytes,Bytes)>',
      },
      migrate_balances_issuance: {
        additionalIssuance: 'u128',
      },
      migrate_vesting_vesting: {
        vestings: 'Vec<(AccountId32,PalletVestingVestingInfo)>',
      },
      migrate_proxy_proxies: {
        proxies: 'Vec<(AccountId32,u128,(Vec<PalletProxyProxyDefinition>,u128))>',
      },
      finalize: 'Null'
    }
  },
  /**
   * Lookup570: pallet_proxy::ProxyDefinition<sp_core::crypto::AccountId32, development_runtime::ProxyType, BlockNumber>
   **/
  PalletProxyProxyDefinition: {
    delegate: 'AccountId32',
    proxyType: 'DevelopmentRuntimeProxyType',
    delay: 'u32'
  },
  /**
   * Lookup572: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'SpWeightsWeightV2Weight',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      sudo_as: {
        who: 'MultiAddress',
        call: 'Call'
      }
    }
  },
  /**
   * Lookup574: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: ['MinimumThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint', 'MaxWeightTooLow', 'AlreadyStored']
  },
  /**
   * Lookup577: pallet_proxy::Announcement<sp_core::crypto::AccountId32, primitive_types::H256, BlockNumber>
   **/
  PalletProxyAnnouncement: {
    real: 'AccountId32',
    callHash: 'H256',
    height: 'u32'
  },
  /**
   * Lookup579: pallet_proxy::pallet::Error<T>
   **/
  PalletProxyError: {
    _enum: ['TooMany', 'NotFound', 'NotProxy', 'Unproxyable', 'Duplicate', 'NoPermission', 'Unannounced', 'NoSelfProxy']
  },
  /**
   * Lookup580: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls']
  },
  /**
   * Lookup583: pallet_scheduler::Scheduled<Name, frame_support::traits::preimages::Bounded<development_runtime::RuntimeCall>, BlockNumber, development_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduled: {
    maybeId: 'Option<[u8;32]>',
    priority: 'u8',
    call: 'FrameSupportPreimagesBounded',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'DevelopmentRuntimeOriginCaller'
  },
  /**
   * Lookup585: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange', 'Named']
  },
  /**
   * Lookup587: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32'
  },
  /**
   * Lookup588: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized', 'TooEarly', 'TooManyProposals', 'WrongProposalWeight', 'WrongProposalLength']
  },
  /**
   * Lookup590: pallet_elections_phragmen::SeatHolder<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenSeatHolder: {
    who: 'AccountId32',
    stake: 'u128',
    deposit: 'u128'
  },
  /**
   * Lookup591: pallet_elections_phragmen::Voter<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenVoter: {
    votes: 'Vec<AccountId32>',
    stake: 'u128',
    deposit: 'u128'
  },
  /**
   * Lookup592: pallet_elections_phragmen::pallet::Error<T>
   **/
  PalletElectionsPhragmenError: {
    _enum: ['UnableToVote', 'NoVotes', 'TooManyVotes', 'MaximumVotesExceeded', 'LowBalance', 'UnableToPayBond', 'MustBeVoter', 'DuplicatedCandidate', 'TooManyCandidates', 'MemberSubmit', 'RunnerUpSubmit', 'InsufficientCandidateFunds', 'NotMember', 'InvalidWitnessData', 'InvalidVoteCount', 'InvalidRenouncing', 'InvalidReplacement']
  },
  /**
   * Lookup598: pallet_democracy::types::ReferendumInfo<BlockNumber, frame_support::traits::preimages::Bounded<development_runtime::RuntimeCall>, Balance>
   **/
  PalletDemocracyReferendumInfo: {
    _enum: {
      Ongoing: 'PalletDemocracyReferendumStatus',
      Finished: {
        approved: 'bool',
        end: 'u32'
      }
    }
  },
  /**
   * Lookup599: pallet_democracy::types::ReferendumStatus<BlockNumber, frame_support::traits::preimages::Bounded<development_runtime::RuntimeCall>, Balance>
   **/
  PalletDemocracyReferendumStatus: {
    end: 'u32',
    proposal: 'FrameSupportPreimagesBounded',
    threshold: 'PalletDemocracyVoteThreshold',
    delay: 'u32',
    tally: 'PalletDemocracyTally'
  },
  /**
   * Lookup600: pallet_democracy::types::Tally<Balance>
   **/
  PalletDemocracyTally: {
    ayes: 'u128',
    nays: 'u128',
    turnout: 'u128'
  },
  /**
   * Lookup601: pallet_democracy::vote::Voting<Balance, sp_core::crypto::AccountId32, BlockNumber, MaxVotes>
   **/
  PalletDemocracyVoteVoting: {
    _enum: {
      Direct: {
        votes: 'Vec<(u32,PalletDemocracyVoteAccountVote)>',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock',
      },
      Delegating: {
        balance: 'u128',
        target: 'AccountId32',
        conviction: 'PalletDemocracyConviction',
        delegations: 'PalletDemocracyDelegations',
        prior: 'PalletDemocracyVotePriorLock'
      }
    }
  },
  /**
   * Lookup605: pallet_democracy::types::Delegations<Balance>
   **/
  PalletDemocracyDelegations: {
    votes: 'u128',
    capital: 'u128'
  },
  /**
   * Lookup606: pallet_democracy::vote::PriorLock<BlockNumber, Balance>
   **/
  PalletDemocracyVotePriorLock: '(u32,u128)',
  /**
   * Lookup609: pallet_democracy::pallet::Error<T>
   **/
  PalletDemocracyError: {
    _enum: ['ValueLow', 'ProposalMissing', 'AlreadyCanceled', 'DuplicateProposal', 'ProposalBlacklisted', 'NotSimpleMajority', 'InvalidHash', 'NoProposal', 'AlreadyVetoed', 'ReferendumInvalid', 'NoneWaiting', 'NotVoter', 'NoPermission', 'AlreadyDelegating', 'InsufficientFunds', 'NotDelegating', 'VotesExist', 'InstantNotAllowed', 'Nonsense', 'WrongUpperBound', 'MaxVotesReached', 'TooMany', 'VotingPeriodLow']
  },
  /**
   * Lookup610: pallet_identity::types::Registration<Balance, MaxJudgements, MaxAdditionalFields>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(u32,PalletIdentityJudgement)>',
    deposit: 'u128',
    info: 'PalletIdentityIdentityInfo'
  },
  /**
   * Lookup618: pallet_identity::types::RegistrarInfo<Balance, sp_core::crypto::AccountId32>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fee: 'u128',
    fields: 'PalletIdentityBitFlags'
  },
  /**
   * Lookup620: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: ['TooManySubAccounts', 'NotFound', 'NotNamed', 'EmptyIndex', 'FeeChanged', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyFields', 'TooManyRegistrars', 'AlreadyClaimed', 'NotSub', 'NotOwned', 'JudgementForDifferentIdentity', 'JudgementPaymentFailed']
  },
  /**
   * Lookup623: pallet_vesting::Releases
   **/
  PalletVestingReleases: {
    _enum: ['V0', 'V1']
  },
  /**
   * Lookup624: pallet_vesting::pallet::Error<T>
   **/
  PalletVestingError: {
    _enum: ['NotVesting', 'AtMaxVestingSchedules', 'AmountLow', 'ScheduleIndexOutOfBounds', 'InvalidScheduleParams']
  },
  /**
   * Lookup625: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   **/
  PalletTreasuryProposal: {
    proposer: 'AccountId32',
    value: 'u128',
    beneficiary: 'AccountId32',
    bond: 'u128'
  },
  /**
   * Lookup627: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup628: pallet_treasury::pallet::Error<T, I>
   **/
  PalletTreasuryError: {
    _enum: ['InsufficientProposersBalance', 'InvalidIndex', 'TooManyApprovals', 'InsufficientPermission', 'ProposalNotApproved']
  },
  /**
   * Lookup629: pallet_uniques::types::CollectionDetails<sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletUniquesCollectionDetails: {
    owner: 'AccountId32',
    issuer: 'AccountId32',
    admin: 'AccountId32',
    freezer: 'AccountId32',
    totalDeposit: 'u128',
    freeHolding: 'bool',
    items: 'u32',
    itemMetadatas: 'u32',
    attributes: 'u32',
    isFrozen: 'bool'
  },
  /**
   * Lookup632: pallet_uniques::types::ItemDetails<sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletUniquesItemDetails: {
    owner: 'AccountId32',
    approved: 'Option<AccountId32>',
    isFrozen: 'bool',
    deposit: 'u128'
  },
  /**
   * Lookup633: pallet_uniques::types::CollectionMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesCollectionMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool'
  },
  /**
   * Lookup634: pallet_uniques::types::ItemMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesItemMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool'
  },
  /**
   * Lookup638: pallet_uniques::pallet::Error<T, I>
   **/
  PalletUniquesError: {
    _enum: ['NoPermission', 'UnknownCollection', 'AlreadyExists', 'WrongOwner', 'BadWitness', 'InUse', 'Frozen', 'WrongDelegate', 'NoDelegate', 'Unapproved', 'Unaccepted', 'Locked', 'MaxSupplyReached', 'MaxSupplyAlreadySet', 'MaxSupplyTooSmall', 'UnknownItem', 'NotForSale', 'BidTooLow']
  },
  /**
   * Lookup639: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: {
        deposit: '(AccountId32,u128)',
        len: 'u32',
      },
      Requested: {
        deposit: 'Option<(AccountId32,u128)>',
        count: 'u32',
        len: 'Option<u32>'
      }
    }
  },
  /**
   * Lookup643: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooBig', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested']
  },
  /**
   * Lookup644: pallet_anchors::PreCommitData<primitive_types::H256, sp_core::crypto::AccountId32, BlockNumber, Balance>
   **/
  PalletAnchorsPreCommitData: {
    signingRoot: 'H256',
    identity: 'AccountId32',
    expirationBlock: 'u32',
    deposit: 'u128'
  },
  /**
   * Lookup646: pallet_anchors::pallet::Error<T>
   **/
  PalletAnchorsError: {
    _enum: ['AnchorAlreadyExists', 'AnchorStoreDateInPast', 'AnchorStoreDateAboveMaxLimit', 'PreCommitAlreadyExists', 'NotOwnerOfPreCommit', 'InvalidPreCommitProof', 'EvictionDateTooBig', 'FailedToConvertEpochToDays']
  },
  /**
   * Lookup647: pallet_claims::pallet::Error<T>
   **/
  PalletClaimsError: {
    _enum: ['InsufficientBalance', 'InvalidProofs', 'MustBeAdmin', 'UnderMinPayout']
  },
  /**
   * Lookup649: pallet_crowdloan_claim::pallet::Error<T>
   **/
  PalletCrowdloanClaimError: {
    _enum: ['PalletAlreadyInitialized', 'PalletNotInitialized', 'ClaimAlreadyProcessed', 'InvalidProofOfContribution', 'ClaimedAmountIsOutOfBoundaries', 'MustBeAdministrator', 'InvalidClaimAmount', 'InvalidContributorSignature', 'OngoingLease', 'OutOfLeasePeriod']
  },
  /**
   * Lookup650: pallet_crowdloan_reward::pallet::Error<T>
   **/
  PalletCrowdloanRewardError: {
    _enum: ['MustBeAdministrator', 'RewardInsufficient', 'PalletNotInitialized']
  },
  /**
   * Lookup651: pallet_pool_system::pool_types::PoolDetails<cfg_types::tokens::CurrencyId, cfg_types::tokens::TrancheCurrency, EpochId, Balance, cfg_types::fixed_point::FixedU128, cfg_primitives::types::TrancheWeight, TrancheId, PoolId, development_runtime::MaxTranches>
   **/
  PalletPoolSystemPoolTypesPoolDetails: {
    currency: 'CfgTypesTokensCurrencyId',
    tranches: 'PalletPoolSystemTranches',
    parameters: 'PalletPoolSystemPoolTypesPoolParameters',
    status: 'PalletPoolSystemPoolTypesPoolStatus',
    epoch: 'CfgTypesEpochEpochState',
    reserve: 'PalletPoolSystemPoolTypesReserveDetails'
  },
  /**
   * Lookup653: pallet_pool_system::tranches::Tranches<Balance, cfg_types::fixed_point::FixedU128, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency, TrancheId, PoolId, development_runtime::MaxTranches>
   **/
  PalletPoolSystemTranches: {
    tranches: 'Vec<PalletPoolSystemTranchesTranche>',
    ids: 'Vec<[u8;16]>',
    salt: '(u64,u64)'
  },
  /**
   * Lookup655: pallet_pool_system::tranches::Tranche<Balance, cfg_types::fixed_point::FixedU128, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency>
   **/
  PalletPoolSystemTranchesTranche: {
    trancheType: 'PalletPoolSystemTranchesTrancheType',
    seniority: 'u32',
    currency: 'CfgTypesTokensTrancheCurrency',
    debt: 'u128',
    reserve: 'u128',
    loss: 'u128',
    ratio: 'Perquintill',
    lastUpdatedInterest: 'u64'
  },
  /**
   * Lookup660: pallet_pool_system::pool_types::PoolParameters
   **/
  PalletPoolSystemPoolTypesPoolParameters: {
    minEpochTime: 'u64',
    maxNavAge: 'u64'
  },
  /**
   * Lookup661: pallet_pool_system::pool_types::PoolStatus
   **/
  PalletPoolSystemPoolTypesPoolStatus: {
    _enum: ['Open']
  },
  /**
   * Lookup662: cfg_types::epoch::EpochState<EpochId>
   **/
  CfgTypesEpochEpochState: {
    current: 'u32',
    lastClosed: 'u64',
    lastExecuted: 'u32'
  },
  /**
   * Lookup663: pallet_pool_system::pool_types::ReserveDetails<Balance>
   **/
  PalletPoolSystemPoolTypesReserveDetails: {
    max: 'u128',
    total: 'u128',
    available: 'u128'
  },
  /**
   * Lookup664: pallet_pool_system::pool_types::ScheduledUpdateDetails<cfg_types::fixed_point::FixedU128, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes, development_runtime::MaxTranches>
   **/
  PalletPoolSystemPoolTypesScheduledUpdateDetails: {
    changes: 'PalletPoolSystemPoolTypesPoolChanges',
    submittedAt: 'u64'
  },
  /**
   * Lookup665: pallet_pool_system::solution::EpochExecutionInfo<Balance, cfg_types::fixed_point::FixedU128, EpochId, cfg_primitives::types::TrancheWeight, BlockNumber, cfg_types::tokens::TrancheCurrency, development_runtime::MaxTranches>
   **/
  PalletPoolSystemSolutionEpochExecutionInfo: {
    epoch: 'u32',
    nav: 'u128',
    reserve: 'u128',
    maxReserve: 'u128',
    tranches: 'PalletPoolSystemTranchesEpochExecutionTranches',
    bestSubmission: 'Option<PalletPoolSystemSolutionEpochSolution>',
    challengePeriodEnd: 'Option<u32>'
  },
  /**
   * Lookup666: pallet_pool_system::tranches::EpochExecutionTranches<Balance, cfg_types::fixed_point::FixedU128, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency, development_runtime::MaxTranches>
   **/
  PalletPoolSystemTranchesEpochExecutionTranches: {
    tranches: 'Vec<PalletPoolSystemTranchesEpochExecutionTranche>'
  },
  /**
   * Lookup668: pallet_pool_system::tranches::EpochExecutionTranche<Balance, cfg_types::fixed_point::FixedU128, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency>
   **/
  PalletPoolSystemTranchesEpochExecutionTranche: {
    currency: 'CfgTypesTokensTrancheCurrency',
    supply: 'u128',
    price: 'u128',
    invest: 'u128',
    redeem: 'u128',
    minRiskBuffer: 'Perquintill',
    seniority: 'u32'
  },
  /**
   * Lookup671: pallet_pool_system::pool_types::PoolDepositInfo<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPoolSystemPoolTypesPoolDepositInfo: {
    depositor: 'AccountId32',
    deposit: 'u128'
  },
  /**
   * Lookup672: pallet_pool_system::Release
   **/
  PalletPoolSystemRelease: {
    _enum: ['V0', 'V1']
  },
  /**
   * Lookup674: pallet_pool_system::pool_types::changes::NotedPoolChange<runtime_common::changes::fast::RuntimeChange<development_runtime::Runtime>>
   **/
  PalletPoolSystemPoolTypesChangesNotedPoolChange: {
    submittedTime: 'u64',
    change: 'RuntimeCommonChangesFastRuntimeChange'
  },
  /**
   * Lookup675: pallet_pool_system::pallet::Error<T>
   **/
  PalletPoolSystemError: {
    _enum: ['PoolInUse', 'InvalidJuniorTranche', 'InvalidTrancheStructure', 'NoSuchPool', 'MinEpochTimeHasNotPassed', 'ChallengeTimeHasNotPassed', 'InSubmissionPeriod', 'NAVTooOld', 'TrancheId', 'WipedOut', 'InvalidSolution', 'NotInSubmissionPeriod', 'InsufficientCurrency', 'RiskBufferViolated', 'NoNAV', 'EpochNotExecutedYet', 'CannotAddOrRemoveTranches', 'InvalidTrancheSeniority', 'InvalidTrancheUpdate', 'MetadataForCurrencyNotFound', 'TrancheTokenNameTooLong', 'TrancheSymbolNameTooLong', 'FailedToRegisterTrancheMetadata', 'FailedToUpdateTrancheMetadata', 'InvalidTrancheId', 'TooManyTranches', 'NotNewBestSubmission', 'NoSolutionAvailable', 'PoolParameterBoundViolated', 'NoScheduledUpdate', 'ScheduledTimeHasNotPassed', 'UpdatePrerequesitesNotFulfilled', 'InvalidCurrency', 'ChangeNotFound', 'ChangeNotReady']
  },
  /**
   * Lookup676: pallet_loans::entities::loans::CreatedLoan<T>
   **/
  PalletLoansEntitiesLoansCreatedLoan: {
    info: 'PalletLoansEntitiesLoansLoanInfo',
    borrower: 'AccountId32'
  },
  /**
   * Lookup679: pallet_loans::entities::loans::ActiveLoan<T>
   **/
  PalletLoansEntitiesLoansActiveLoan: {
    schedule: 'PalletLoansRepaymentSchedule',
    collateral: '(u64,u128)',
    restrictions: 'PalletLoansLoanRestrictions',
    borrower: 'AccountId32',
    writeOffPercentage: 'u128',
    originationDate: 'u64',
    pricing: 'PalletLoansEntitiesPricingActivePricing',
    totalBorrowed: 'u128',
    totalRepaid: 'PalletLoansRepaidAmount',
    repaymentsOnScheduleUntil: 'u64'
  },
  /**
   * Lookup680: pallet_loans::entities::pricing::ActivePricing<T>
   **/
  PalletLoansEntitiesPricingActivePricing: {
    _enum: {
      Internal: 'PalletLoansEntitiesPricingInternalInternalActivePricing',
      External: 'PalletLoansEntitiesPricingExternalExternalActivePricing'
    }
  },
  /**
   * Lookup681: pallet_loans::entities::pricing::internal::InternalActivePricing<T>
   **/
  PalletLoansEntitiesPricingInternalInternalActivePricing: {
    info: 'PalletLoansEntitiesPricingInternalInternalPricing',
    interest: 'PalletLoansEntitiesInterestActiveInterestRate'
  },
  /**
   * Lookup682: pallet_loans::entities::interest::ActiveInterestRate<T>
   **/
  PalletLoansEntitiesInterestActiveInterestRate: {
    interestRate: 'CfgTraitsInterestInterestRate',
    normalizedAcc: 'u128',
    penalty: 'u128'
  },
  /**
   * Lookup683: pallet_loans::entities::pricing::external::ExternalActivePricing<T>
   **/
  PalletLoansEntitiesPricingExternalExternalActivePricing: {
    info: 'PalletLoansEntitiesPricingExternalExternalPricing',
    outstandingQuantity: 'u128',
    interest: 'PalletLoansEntitiesInterestActiveInterestRate'
  },
  /**
   * Lookup684: pallet_loans::types::RepaidAmount<Balance>
   **/
  PalletLoansRepaidAmount: {
    principal: 'u128',
    interest: 'u128',
    unscheduled: 'u128'
  },
  /**
   * Lookup686: pallet_loans::entities::loans::ClosedLoan<T>
   **/
  PalletLoansEntitiesLoansClosedLoan: {
    closedAt: 'u32',
    info: 'PalletLoansEntitiesLoansLoanInfo',
    totalBorrowed: 'u128',
    totalRepaid: 'u128'
  },
  /**
   * Lookup687: pallet_loans::types::portfolio::PortfolioValuation<Balance, ElemId, MaxElems>
   **/
  PalletLoansPortfolioPortfolioValuation: {
    value: 'u128',
    lastUpdated: 'u64',
    values: 'Vec<(u64,u128)>'
  },
  /**
   * Lookup691: pallet_loans::pallet::Error<T>
   **/
  PalletLoansError: {
    _enum: {
      PoolNotFound: 'Null',
      LoanNotActiveOrNotFound: 'Null',
      NoValidWriteOffRule: 'Null',
      NFTOwnerNotFound: 'Null',
      NotNFTOwner: 'Null',
      NotLoanBorrower: 'Null',
      MaxActiveLoansReached: 'Null',
      AmountNotNaturalNumber: 'Null',
      NoLoanChangeId: 'Null',
      UnrelatedChangeId: 'Null',
      MismatchedPricingMethod: 'Null',
      CreateLoanError: 'PalletLoansCreateLoanError',
      BorrowLoanError: 'PalletLoansBorrowLoanError',
      RepayLoanError: 'PalletLoansRepayLoanError',
      WrittenOffError: 'PalletLoansWrittenOffError',
      CloseLoanError: 'PalletLoansCloseLoanError',
      MutationError: 'PalletLoansMutationError'
    }
  },
  /**
   * Lookup692: pallet_loans::types::CreateLoanError
   **/
  PalletLoansCreateLoanError: {
    _enum: ['InvalidValuationMethod', 'InvalidRepaymentSchedule', 'InvalidBorrowRestriction', 'InvalidRepayRestriction']
  },
  /**
   * Lookup693: pallet_loans::types::BorrowLoanError
   **/
  PalletLoansBorrowLoanError: {
    _enum: ['MaxAmountExceeded', 'Restriction', 'MaturityDatePassed']
  },
  /**
   * Lookup694: pallet_loans::types::RepayLoanError
   **/
  PalletLoansRepayLoanError: {
    _enum: ['Restriction', 'MaxPrincipalAmountExceeded']
  },
  /**
   * Lookup695: pallet_loans::types::WrittenOffError
   **/
  PalletLoansWrittenOffError: {
    _enum: ['LessThanPolicy']
  },
  /**
   * Lookup696: pallet_loans::types::CloseLoanError
   **/
  PalletLoansCloseLoanError: {
    _enum: ['NotFullyRepaid']
  },
  /**
   * Lookup697: pallet_loans::types::MutationError
   **/
  PalletLoansMutationError: {
    _enum: ['DiscountedCashFlowExpected', 'InternalPricingExpected', 'MaturityExtendedTooMuch']
  },
  /**
   * Lookup699: cfg_types::permissions::PermissionRoles<Now, development_runtime::MinDelay, TrancheId, development_runtime::MaxTranches, Moment>
   **/
  CfgTypesPermissionsPermissionRoles: {
    poolAdmin: 'CfgTypesPermissionsPoolAdminRoles',
    currencyAdmin: 'CfgTypesPermissionsCurrencyAdminRoles',
    permissionedAssetHolder: 'CfgTypesPermissionsPermissionedCurrencyHolders',
    trancheInvestor: 'CfgTypesPermissionsTrancheInvestors'
  },
  /**
   * Lookup700: development_runtime::MinDelay
   **/
  DevelopmentRuntimeMinDelay: 'Null',
  /**
   * Lookup701: cfg_types::permissions::PoolAdminRoles
   **/
  CfgTypesPermissionsPoolAdminRoles: {
    bits: 'u32'
  },
  /**
   * Lookup702: cfg_types::permissions::CurrencyAdminRoles
   **/
  CfgTypesPermissionsCurrencyAdminRoles: {
    bits: 'u32'
  },
  /**
   * Lookup703: cfg_types::permissions::PermissionedCurrencyHolders<Now, development_runtime::MinDelay, Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyHolders: {
    info: 'Option<CfgTypesPermissionsPermissionedCurrencyHolderInfo>'
  },
  /**
   * Lookup705: cfg_types::permissions::PermissionedCurrencyHolderInfo<Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyHolderInfo: {
    permissionedTill: 'u64'
  },
  /**
   * Lookup706: cfg_types::permissions::TrancheInvestors<Now, development_runtime::MinDelay, TrancheId, Moment, development_runtime::MaxTranches>
   **/
  CfgTypesPermissionsTrancheInvestors: {
    info: 'Vec<CfgTypesPermissionsTrancheInvestorInfo>'
  },
  /**
   * Lookup708: cfg_types::permissions::TrancheInvestorInfo<TrancheId, Moment>
   **/
  CfgTypesPermissionsTrancheInvestorInfo: {
    trancheId: '[u8;16]',
    permissionedTill: 'u64'
  },
  /**
   * Lookup710: pallet_permissions::pallet::Error<T>
   **/
  PalletPermissionsError: {
    _enum: ['RoleAlreadyGiven', 'RoleNotGiven', 'NoRoles', 'NoEditor', 'WrongParameters', 'TooManyRoles']
  },
  /**
   * Lookup711: pallet_collator_allowlist::pallet::Error<T>
   **/
  PalletCollatorAllowlistError: {
    _enum: ['CollatorAlreadyAllowed', 'CollatorNotReady', 'CollatorNotPresent']
  },
  /**
   * Lookup712: pallet_restricted_tokens::pallet::Error<T>
   **/
  PalletRestrictedTokensError: {
    _enum: ['PreConditionsNotMet']
  },
  /**
   * Lookup713: pallet_nft_sales::pallet::Error<T>
   **/
  PalletNftSalesError: {
    _enum: ['NotFound', 'NotOwner', 'AlreadyForSale', 'NotForSale', 'InvalidOffer']
  },
  /**
   * Lookup714: pallet_bridge::pallet::Error<T>
   **/
  PalletBridgeError: {
    _enum: ['InvalidTransfer']
  },
  /**
   * Lookup716: pallet_interest_accrual::RateDetails<cfg_types::fixed_point::FixedU128>
   **/
  PalletInterestAccrualRateDetails: {
    interestRatePerSec: 'u128',
    accumulatedRate: 'u128',
    referenceCount: 'u32'
  },
  /**
   * Lookup718: pallet_interest_accrual::Release
   **/
  PalletInterestAccrualRelease: {
    _enum: ['V0', 'V1', 'V2']
  },
  /**
   * Lookup719: pallet_interest_accrual::pallet::Error<T>
   **/
  PalletInterestAccrualError: {
    _enum: ['DebtCalculationFailed', 'DebtAdjustmentFailed', 'NoSuchRate', 'InvalidRate', 'TooManyRates']
  },
  /**
   * Lookup720: pallet_nft::pallet::Error<T>
   **/
  PalletNftError: {
    _enum: ['InvalidProofs', 'DocumentNotAnchored']
  },
  /**
   * Lookup723: pallet_keystore::Key<BlockNumber, Balance>
   **/
  PalletKeystoreKey: {
    purpose: 'PalletKeystoreKeyPurpose',
    keyType: 'PalletKeystoreKeyType',
    revokedAt: 'Option<u32>',
    deposit: 'u128'
  },
  /**
   * Lookup725: pallet_keystore::pallet::Error<T>
   **/
  PalletKeystoreError: {
    _enum: ['NoKeys', 'TooManyKeys', 'KeyAlreadyExists', 'KeyNotFound', 'KeyAlreadyRevoked']
  },
  /**
   * Lookup727: cfg_types::orders::Order<Balance, OrderId>
   **/
  CfgTypesOrdersOrder: {
    amount: 'u128',
    submittedAt: 'u64'
  },
  /**
   * Lookup729: pallet_investments::pallet::Error<T>
   **/
  PalletInvestmentsError: {
    _enum: ['OrderNotCleared', 'OrderStillActive', 'UnknownInvestment', 'CollectRequired', 'ZeroPricedInvestment', 'OrderNotInProcessing', 'OrderInProcessing', 'NoNewOrder', 'NoActiveInvestOrder', 'NoActiveRedeemOrder']
  },
  /**
   * Lookup731: pallet_rewards::mechanism::gap::Currency<development_runtime::Runtime>
   **/
  PalletRewardsMechanismGapCurrency: {
    totalStake: 'u128',
    rptChanges: 'Vec<i128>'
  },
  /**
   * Lookup736: pallet_rewards::mechanism::gap::Group<development_runtime::Runtime>
   **/
  PalletRewardsMechanismGapGroup: {
    totalStake: 'u128',
    pendingTotalStake: 'u128',
    rpt: 'i128',
    distributionId: 'u32'
  },
  /**
   * Lookup738: pallet_rewards::mechanism::gap::Account<development_runtime::Runtime>
   **/
  PalletRewardsMechanismGapAccount: {
    stake: 'u128',
    rewardTally: 'i128',
    pendingStake: 'u128',
    distributionId: 'u32',
    lastCurrencyMovement: 'u16'
  },
  /**
   * Lookup739: pallet_rewards::pallet::Error<T, I>
   **/
  PalletRewardsError: {
    _enum: ['CurrencyWithoutGroup', 'CurrencyInSameGroup', 'CurrencyMaxMovementsReached']
  },
  /**
   * Lookup740: pallet_liquidity_rewards::EpochData<T>
   **/
  PalletLiquidityRewardsEpochData: {
    duration: 'u64',
    reward: 'u128',
    weights: 'BTreeMap<u32, u64>'
  },
  /**
   * Lookup742: pallet_liquidity_rewards::pallet::Error<T>
   **/
  PalletLiquidityRewardsError: {
    _enum: ['MaxChangesPerEpochReached']
  },
  /**
   * Lookup743: pallet_connectors::pallet::Error<T>
   **/
  PalletConnectorsError: {
    _enum: ['AssetNotFound', 'AssetMetadataNotPoolCurrency', 'AssetNotConnectorsTransferable', 'AssetNotConnectorsWrappedToken', 'AssetNotPoolCurrency', 'PoolNotFound', 'TrancheNotFound', 'TrancheMetadataNotFound', 'MissingTranchePrice', 'MissingRouter', 'InvalidTransferAmount', 'UnauthorizedTransfer', 'FailedToBuildEthereumXcmCall', 'InvalidIncomingMessageOrigin', 'InvalidIncomingMessage', 'InvalidDomain', 'InvalidTrancheInvestorValidity', 'InvalidInvestCurrency', 'InvalidTransferCurrency', 'InvestorDomainAddressNotAMember', 'NotPoolAdmin']
  },
  /**
   * Lookup744: cfg_types::pools::PoolMetadata<development_runtime::MaxSizeMetadata>
   **/
  CfgTypesPoolsPoolMetadata: {
    metadata: 'Bytes'
  },
  /**
   * Lookup745: development_runtime::MaxSizeMetadata
   **/
  DevelopmentRuntimeMaxSizeMetadata: 'Null',
  /**
   * Lookup746: cfg_types::pools::PoolRegistrationStatus
   **/
  CfgTypesPoolsPoolRegistrationStatus: {
    _enum: ['Registered', 'Unregistered']
  },
  /**
   * Lookup747: pallet_pool_registry::pallet::Error<T>
   **/
  PalletPoolRegistryError: {
    _enum: ['BadMetadata', 'PoolAlreadyRegistered', 'InvalidTrancheUpdate', 'MetadataForCurrencyNotFound', 'NoSuchPoolMetadata', 'TrancheTokenNameTooLong', 'TrancheSymbolNameTooLong']
  },
  /**
   * Lookup749: pallet_rewards::mechanism::base::Currency<Balance, sp_arithmetic::fixed_point::FixedI128, development_runtime::SingleCurrencyMovement>
   **/
  PalletRewardsMechanismBaseCurrency: {
    totalStake: 'u128',
    rptChanges: 'Vec<i128>'
  },
  /**
   * Lookup750: development_runtime::SingleCurrencyMovement
   **/
  DevelopmentRuntimeSingleCurrencyMovement: 'Null',
  /**
   * Lookup752: pallet_rewards::mechanism::base::Group<Balance, sp_arithmetic::fixed_point::FixedI128>
   **/
  PalletRewardsMechanismBaseGroup: {
    totalStake: 'u128',
    rpt: 'i128'
  },
  /**
   * Lookup753: pallet_rewards::mechanism::base::Account<Balance, IBalance>
   **/
  PalletRewardsMechanismBaseAccount: {
    stake: 'u128',
    rewardTally: 'i128',
    lastCurrencyMovement: 'u16'
  },
  /**
   * Lookup755: pallet_block_rewards::SessionData<T>
   **/
  PalletBlockRewardsSessionData: {
    collatorReward: 'u128',
    totalReward: 'u128',
    collatorCount: 'u32'
  },
  /**
   * Lookup756: pallet_block_rewards::pallet::Error<T>
   **/
  PalletBlockRewardsError: {
    _enum: ['MaxChangesPerSessionReached', 'InsufficientTotalReward']
  },
  /**
   * Lookup757: pallet_transfer_allowlist::pallet::AllowanceMetadata<BlockNumber>
   **/
  PalletTransferAllowlistAllowanceMetadata: {
    allowanceCount: 'u64',
    currentDelay: 'Option<u32>',
    onceModifiableAfter: 'Option<u32>'
  },
  /**
   * Lookup759: pallet_transfer_allowlist::pallet::AllowanceDetails<BlockNumber>
   **/
  PalletTransferAllowlistAllowanceDetails: {
    allowedAt: 'u32',
    blockedAt: 'u32'
  },
  /**
   * Lookup760: pallet_transfer_allowlist::pallet::Error<T>
   **/
  PalletTransferAllowlistError: {
    _enum: ['NoAllowancesSet', 'DuplicateAllowance', 'NoMatchingAllowance', 'NoMatchingDelay', 'DuplicateDelay', 'DelayUnmodifiable', 'AllowanceHasNotExpired', 'NoAllowanceForDestination']
  },
  /**
   * Lookup770: pallet_data_collector::pallet::Error<T, I>
   **/
  PalletDataCollectorError: {
    _enum: ['DataIdNotInCollection', 'DataIdWithoutData', 'MaxCollectionSize', 'MaxCollectionNumber']
  },
  /**
   * Lookup771: pallet_rewards::mechanism::gap::pallet::Error<T>
   **/
  PalletRewardsMechanismGapPalletError: {
    _enum: ['TryMovementAfterPendingState']
  },
  /**
   * Lookup773: pallet_connectors_gateway::pallet::Error<T>
   **/
  PalletConnectorsGatewayError: {
    _enum: ['RouterInitFailed', 'InvalidMessageOrigin', 'DomainNotSupported', 'MessageDecodingFailed', 'ConnectorAlreadyAdded', 'MaxConnectorsReached', 'ConnectorNotFound', 'UnknownConnector', 'RouterNotFound']
  },
  /**
   * Lookup774: pallet_order_book::pallet::Order<OrderId, sp_core::crypto::AccountId32, cfg_types::tokens::CurrencyId, ForeignCurrencyBalance>
   **/
  PalletOrderBookOrder: {
    orderId: 'u64',
    placingAccount: 'AccountId32',
    assetInId: 'CfgTypesTokensCurrencyId',
    assetOutId: 'CfgTypesTokensCurrencyId',
    buyAmount: 'u128',
    initialBuyAmount: 'u128',
    price: 'u128',
    minFullfillmentAmount: 'u128',
    maxSellAmount: 'u128'
  },
  /**
   * Lookup777: pallet_order_book::pallet::Error<T>
   **/
  PalletOrderBookError: {
    _enum: ['AssetPairOrdersOverflow', 'ConflictingAssetIds', 'InsufficientAssetFunds', 'InsufficientReserveFunds', 'InvalidBuyAmount', 'InvalidMinPrice', 'InvalidAssetId', 'OrderNotFound', 'Unauthorised', 'BalanceConversionErr']
  },
  /**
   * Lookup779: cumulus_pallet_xcmp_queue::InboundChannelDetails
   **/
  CumulusPalletXcmpQueueInboundChannelDetails: {
    sender: 'u32',
    state: 'CumulusPalletXcmpQueueInboundState',
    messageMetadata: 'Vec<(u32,PolkadotParachainPrimitivesXcmpMessageFormat)>'
  },
  /**
   * Lookup780: cumulus_pallet_xcmp_queue::InboundState
   **/
  CumulusPalletXcmpQueueInboundState: {
    _enum: ['Ok', 'Suspended']
  },
  /**
   * Lookup783: polkadot_parachain::primitives::XcmpMessageFormat
   **/
  PolkadotParachainPrimitivesXcmpMessageFormat: {
    _enum: ['ConcatenatedVersionedXcm', 'ConcatenatedEncodedBlob', 'Signals']
  },
  /**
   * Lookup786: cumulus_pallet_xcmp_queue::OutboundChannelDetails
   **/
  CumulusPalletXcmpQueueOutboundChannelDetails: {
    recipient: 'u32',
    state: 'CumulusPalletXcmpQueueOutboundState',
    signalsExist: 'bool',
    firstIndex: 'u16',
    lastIndex: 'u16'
  },
  /**
   * Lookup787: cumulus_pallet_xcmp_queue::OutboundState
   **/
  CumulusPalletXcmpQueueOutboundState: {
    _enum: ['Ok', 'Suspended']
  },
  /**
   * Lookup789: cumulus_pallet_xcmp_queue::QueueConfigData
   **/
  CumulusPalletXcmpQueueQueueConfigData: {
    suspendThreshold: 'u32',
    dropThreshold: 'u32',
    resumeThreshold: 'u32',
    thresholdWeight: 'SpWeightsWeightV2Weight',
    weightRestrictDecay: 'SpWeightsWeightV2Weight',
    xcmpMaxIndividualWeight: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup791: cumulus_pallet_xcmp_queue::pallet::Error<T>
   **/
  CumulusPalletXcmpQueueError: {
    _enum: ['FailedToSend', 'BadXcmOrigin', 'BadXcm', 'BadOverweightIndex', 'WeightOverLimit']
  },
  /**
   * Lookup792: pallet_xcm::pallet::Error<T>
   **/
  PalletXcmError: {
    _enum: ['Unreachable', 'SendFailure', 'Filtered', 'UnweighableMessage', 'DestinationNotInvertible', 'Empty', 'CannotReanchor', 'TooManyAssets', 'InvalidOrigin', 'BadVersion', 'BadLocation', 'NoSubscription', 'AlreadySubscribed', 'InvalidAsset', 'LowBalance', 'TooManyLocks', 'AccountNotSovereign', 'FeesNotMet', 'LockNotFound', 'InUse']
  },
  /**
   * Lookup793: cumulus_pallet_xcm::pallet::Error<T>
   **/
  CumulusPalletXcmError: 'Null',
  /**
   * Lookup794: cumulus_pallet_dmp_queue::ConfigData
   **/
  CumulusPalletDmpQueueConfigData: {
    maxIndividual: 'SpWeightsWeightV2Weight'
  },
  /**
   * Lookup795: cumulus_pallet_dmp_queue::PageIndexData
   **/
  CumulusPalletDmpQueuePageIndexData: {
    beginUsed: 'u32',
    endUsed: 'u32',
    overweightCount: 'u64'
  },
  /**
   * Lookup798: cumulus_pallet_dmp_queue::pallet::Error<T>
   **/
  CumulusPalletDmpQueueError: {
    _enum: ['Unknown', 'OverLimit']
  },
  /**
   * Lookup799: orml_xtokens::module::Error<T>
   **/
  OrmlXtokensModuleError: {
    _enum: ['AssetHasNoReserve', 'NotCrossChainTransfer', 'InvalidDest', 'NotCrossChainTransferableCurrency', 'UnweighableMessage', 'XcmExecutionFailed', 'CannotReanchor', 'InvalidAncestry', 'InvalidAsset', 'DestinationNotInvertible', 'BadVersion', 'DistinctReserveForAssetAndFee', 'ZeroFee', 'ZeroAmount', 'TooManyAssetsBeingSent', 'AssetIndexNonExistent', 'FeeNotEnough', 'NotSupportedMultiLocation', 'MinXcmFeeNotDefined']
  },
  /**
   * Lookup800: pallet_xcm_transactor::pallet::Error<T>
   **/
  PalletXcmTransactorError: {
    _enum: ['IndexAlreadyClaimed', 'UnclaimedIndex', 'NotOwner', 'UnweighableMessage', 'CannotReanchor', 'AssetHasNoReserve', 'InvalidDest', 'NotCrossChainTransfer', 'AssetIsNotReserveInDestination', 'DestinationNotInvertible', 'ErrorDelivering', 'DispatchWeightBiggerThanTotalWeight', 'WeightOverflow', 'AmountOverflow', 'TransactorInfoNotSet', 'NotCrossChainTransferableCurrency', 'XcmExecuteError', 'BadVersion', 'MaxWeightTransactReached', 'UnableToWithdrawAsset', 'FeePerSecondNotSet', 'SignedTransactNotAllowedForDestination', 'FailedMultiLocationToJunction', 'HrmpHandlerNotImplemented', 'TooMuchFeeUsed', 'ErrorValidating']
  },
  /**
   * Lookup802: orml_tokens::BalanceLock<Balance>
   **/
  OrmlTokensBalanceLock: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup804: orml_tokens::AccountData<Balance>
   **/
  OrmlTokensAccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128'
  },
  /**
   * Lookup806: orml_tokens::ReserveData<ReserveIdentifier, Balance>
   **/
  OrmlTokensReserveData: {
    id: '[u8;8]',
    amount: 'u128'
  },
  /**
   * Lookup808: orml_tokens::module::Error<T>
   **/
  OrmlTokensModuleError: {
    _enum: ['BalanceTooLow', 'AmountIntoBalanceFailed', 'LiquidityRestrictions', 'MaxLocksExceeded', 'KeepAlive', 'ExistentialDeposit', 'DeadAccount', 'TooManyReserves']
  },
  /**
   * Lookup811: chainbridge::types::ProposalVotes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  ChainbridgeProposalVotes: {
    votesFor: 'Vec<AccountId32>',
    votesAgainst: 'Vec<AccountId32>',
    status: 'ChainbridgeProposalStatus',
    expiry: 'u32'
  },
  /**
   * Lookup812: chainbridge::types::ProposalStatus
   **/
  ChainbridgeProposalStatus: {
    _enum: ['Initiated', 'Approved', 'Rejected']
  },
  /**
   * Lookup813: chainbridge::pallet::Error<T>
   **/
  ChainbridgeError: {
    _enum: ['ThresholdNotSet', 'InvalidChainId', 'InvalidThreshold', 'ChainNotWhitelisted', 'ChainAlreadyWhitelisted', 'ResourceDoesNotExist', 'RelayerAlreadyExists', 'RelayerInvalid', 'MustBeRelayer', 'RelayerAlreadyVoted', 'ProposalAlreadyExists', 'ProposalDoesNotExist', 'ProposalNotComplete', 'ProposalAlreadyComplete', 'ProposalExpired']
  },
  /**
   * Lookup814: orml_asset_registry::module::Error<T>
   **/
  OrmlAssetRegistryModuleError: {
    _enum: ['AssetNotFound', 'BadVersion', 'InvalidAssetId', 'ConflictingLocation', 'ConflictingAssetId']
  },
  /**
   * Lookup815: orml_xcm::module::Error<T>
   **/
  OrmlXcmModuleError: {
    _enum: ['Unreachable', 'SendFailure', 'BadVersion']
  },
  /**
   * Lookup817: orml_oracle::module::TimestampedValue<cfg_types::fixed_point::FixedU128, Moment>
   **/
  OrmlOracleModuleTimestampedValue: {
    value: 'u128',
    timestamp: 'u64'
  },
  /**
   * Lookup818: orml_utilities::ordered_set::OrderedSet<sp_core::crypto::AccountId32, S>
   **/
  OrmlUtilitiesOrderedSet: 'Vec<AccountId32>',
  /**
   * Lookup820: orml_oracle::module::Error<T, I>
   **/
  OrmlOracleModuleError: {
    _enum: ['NoPermission', 'AlreadyFeeded']
  },
  /**
   * Lookup822: pallet_membership::pallet::Error<T, I>
   **/
  PalletMembershipError: {
    _enum: ['AlreadyMember', 'NotMember', 'TooManyMembers']
  },
  /**
   * Lookup824: pallet_evm::pallet::Error<T>
   **/
  PalletEvmError: {
    _enum: ['BalanceLow', 'FeeOverflow', 'PaymentOverflow', 'WithdrawFailed', 'GasPriceTooLow', 'InvalidNonce', 'GasLimitTooLow', 'GasLimitTooHigh', 'Undefined', 'Reentrancy', 'TransactionMustComeFromEOA']
  },
  /**
   * Lookup827: fp_rpc::TransactionStatus
   **/
  FpRpcTransactionStatus: {
    transactionHash: 'H256',
    transactionIndex: 'u32',
    from: 'H160',
    to: 'Option<H160>',
    contractAddress: 'Option<H160>',
    logs: 'Vec<EthereumLog>',
    logsBloom: 'EthbloomBloom'
  },
  /**
   * Lookup830: ethbloom::Bloom
   **/
  EthbloomBloom: '[u8;256]',
  /**
   * Lookup832: ethereum::receipt::ReceiptV3
   **/
  EthereumReceiptReceiptV3: {
    _enum: {
      Legacy: 'EthereumReceiptEip658ReceiptData',
      EIP2930: 'EthereumReceiptEip658ReceiptData',
      EIP1559: 'EthereumReceiptEip658ReceiptData'
    }
  },
  /**
   * Lookup833: ethereum::receipt::EIP658ReceiptData
   **/
  EthereumReceiptEip658ReceiptData: {
    statusCode: 'u8',
    usedGas: 'U256',
    logsBloom: 'EthbloomBloom',
    logs: 'Vec<EthereumLog>'
  },
  /**
   * Lookup834: ethereum::block::Block<ethereum::transaction::TransactionV2>
   **/
  EthereumBlock: {
    header: 'EthereumHeader',
    transactions: 'Vec<EthereumTransactionTransactionV2>',
    ommers: 'Vec<EthereumHeader>'
  },
  /**
   * Lookup835: ethereum::header::Header
   **/
  EthereumHeader: {
    parentHash: 'H256',
    ommersHash: 'H256',
    beneficiary: 'H160',
    stateRoot: 'H256',
    transactionsRoot: 'H256',
    receiptsRoot: 'H256',
    logsBloom: 'EthbloomBloom',
    difficulty: 'U256',
    number: 'U256',
    gasLimit: 'U256',
    gasUsed: 'U256',
    timestamp: 'u64',
    extraData: 'Bytes',
    mixHash: 'H256',
    nonce: 'EthereumTypesHashH64'
  },
  /**
   * Lookup836: ethereum_types::hash::H64
   **/
  EthereumTypesHashH64: '[u8;8]',
  /**
   * Lookup841: pallet_ethereum::pallet::Error<T>
   **/
  PalletEthereumError: {
    _enum: ['InvalidSignature', 'PreLogExists']
  },
  /**
   * Lookup842: pallet_ethereum_transaction::pallet::Error<T>
   **/
  PalletEthereumTransactionError: {
    _enum: {
      StackUnderflow: 'Null',
      StackOverflow: 'Null',
      InvalidJump: 'Null',
      InvalidRange: 'Null',
      DesignatedInvalid: 'Null',
      CallTooDeep: 'Null',
      CreateCollision: 'Null',
      CreateContractLimit: 'Null',
      InvalidCode: 'u8',
      OutOfOffset: 'Null',
      OutOfGas: 'Null',
      OutOfFund: 'Null',
      PCUnderflow: 'Null',
      CreateEmpty: 'Null',
      NotSupported: 'Null',
      UnhandledInterrupt: 'Null',
      Reverted: 'Null',
      UnexpectedExecuteResult: 'Null',
      Other: 'Null'
    }
  },
  /**
   * Lookup843: pallet_migration_manager::MigrationStatus
   **/
  PalletMigrationManagerMigrationStatus: {
    _enum: ['Inactive', 'Ongoing', 'Complete']
  },
  /**
   * Lookup844: pallet_migration_manager::pallet::Error<T>
   **/
  PalletMigrationManagerError: {
    _enum: ['TooManyAccounts', 'TooManyVestings', 'TooManyProxies', 'MigrationAlreadyCompleted', 'OnlyFinalizeOngoing']
  },
  /**
   * Lookup845: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup848: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup849: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup850: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup851: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup854: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup855: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup856: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>'
};
