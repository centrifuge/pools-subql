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
    data: 'PalletBalancesAccountData',
  },
  /**
   * Lookup5: pallet_balances::AccountData<Balance>
   **/
  PalletBalancesAccountData: {
    free: 'u128',
    reserved: 'u128',
    miscFrozen: 'u128',
    feeFrozen: 'u128',
  },
  /**
   * Lookup7: frame_support::weights::PerDispatchClass<frame_support::weights::weight_v2::Weight>
   **/
  FrameSupportWeightsPerDispatchClassWeight: {
    normal: 'Weight',
    operational: 'Weight',
    mandatory: 'Weight',
  },
  /**
   * Lookup12: sp_runtime::generic::digest::Digest
   **/
  SpRuntimeDigest: {
    logs: 'Vec<SpRuntimeDigestDigestItem>',
  },
  /**
   * Lookup14: sp_runtime::generic::digest::DigestItem
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
      RuntimeEnvironmentUpdated: 'Null',
    },
  },
  /**
   * Lookup17: frame_system::EventRecord<development_runtime::Event, primitive_types::H256>
   **/
  FrameSystemEventRecord: {
    phase: 'FrameSystemPhase',
    event: 'Event',
    topics: 'Vec<H256>',
  },
  /**
   * Lookup19: frame_system::pallet::Event<T>
   **/
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: 'FrameSupportWeightsDispatchInfo',
      },
      ExtrinsicFailed: {
        dispatchError: 'SpRuntimeDispatchError',
        dispatchInfo: 'FrameSupportWeightsDispatchInfo',
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
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup20: frame_support::weights::DispatchInfo
   **/
  FrameSupportWeightsDispatchInfo: {
    weight: 'Weight',
    class: 'FrameSupportWeightsDispatchClass',
    paysFee: 'FrameSupportWeightsPays',
  },
  /**
   * Lookup21: frame_support::weights::DispatchClass
   **/
  FrameSupportWeightsDispatchClass: {
    _enum: ['Normal', 'Operational', 'Mandatory'],
  },
  /**
   * Lookup22: frame_support::weights::Pays
   **/
  FrameSupportWeightsPays: {
    _enum: ['Yes', 'No'],
  },
  /**
   * Lookup23: sp_runtime::DispatchError
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
      Arithmetic: 'SpRuntimeArithmeticError',
      Transactional: 'SpRuntimeTransactionalError',
    },
  },
  /**
   * Lookup24: sp_runtime::ModuleError
   **/
  SpRuntimeModuleError: {
    index: 'u8',
    error: '[u8;4]',
  },
  /**
   * Lookup25: sp_runtime::TokenError
   **/
  SpRuntimeTokenError: {
    _enum: ['NoFunds', 'WouldDie', 'BelowMinimum', 'CannotCreate', 'UnknownAsset', 'Frozen', 'Unsupported'],
  },
  /**
   * Lookup26: sp_runtime::ArithmeticError
   **/
  SpRuntimeArithmeticError: {
    _enum: ['Underflow', 'Overflow', 'DivisionByZero'],
  },
  /**
   * Lookup27: sp_runtime::TransactionalError
   **/
  SpRuntimeTransactionalError: {
    _enum: ['LimitReached', 'NoLayer'],
  },
  /**
   * Lookup28: cumulus_pallet_parachain_system::pallet::Event<T>
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
        weightUsed: 'Weight',
        dmqHead: 'H256',
      },
    },
  },
  /**
   * Lookup29: pallet_balances::pallet::Event<T, I>
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
        amount: 'u128',
      },
    },
  },
  /**
   * Lookup30: frame_support::traits::tokens::misc::BalanceStatus
   **/
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ['Free', 'Reserved'],
  },
  /**
   * Lookup31: pallet_transaction_payment::pallet::Event<T>
   **/
  PalletTransactionPaymentEvent: {
    _enum: {
      TransactionFeePaid: {
        who: 'AccountId32',
        actualFee: 'u128',
        tip: 'u128',
      },
    },
  },
  /**
   * Lookup32: pallet_collator_selection::pallet::Event<T>
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
        accountId: 'AccountId32',
      },
    },
  },
  /**
   * Lookup34: pallet_session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: 'u32',
      },
    },
  },
  /**
   * Lookup35: pallet_multisig::pallet::Event<T>
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
        callHash: '[u8;32]',
      },
    },
  },
  /**
   * Lookup36: pallet_multisig::Timepoint<BlockNumber>
   **/
  PalletMultisigTimepoint: {
    height: 'u32',
    index: 'u32',
  },
  /**
   * Lookup39: pallet_proxy::pallet::Event<T>
   **/
  PalletProxyEvent: {
    _enum: {
      ProxyExecuted: {
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      AnonymousCreated: {
        anonymous: 'AccountId32',
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
        delay: 'u32',
      },
    },
  },
  /**
   * Lookup40: development_runtime::ProxyType
   **/
  DevelopmentRuntimeProxyType: {
    _enum: [
      'Any',
      'NonTransfer',
      'Governance',
      '_Staking',
      'NonProxy',
      'Borrow',
      'Price',
      'Invest',
      'ProxyManagement',
      'KeystoreManagement',
      'PodOperation',
      'PodAuth',
    ],
  },
  /**
   * Lookup42: pallet_utility::pallet::Event
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
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
    },
  },
  /**
   * Lookup43: pallet_scheduler::pallet::Event<T>
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
        id: 'Option<Bytes>',
        result: 'Result<Null, SpRuntimeDispatchError>',
      },
      CallLookupFailed: {
        task: '(u32,u32)',
        id: 'Option<Bytes>',
        error: 'FrameSupportScheduleLookupError',
      },
    },
  },
  /**
   * Lookup46: frame_support::traits::schedule::LookupError
   **/
  FrameSupportScheduleLookupError: {
    _enum: ['Unknown', 'BadFormat'],
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
        no: 'u32',
      },
    },
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
        amount: 'u128',
      },
    },
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
        depositors: 'Vec<AccountId32>',
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
      Executed: {
        refIndex: 'u32',
        result: 'Result<Null, SpRuntimeDispatchError>',
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
      PreimageNoted: {
        proposalHash: 'H256',
        who: 'AccountId32',
        deposit: 'u128',
      },
      PreimageUsed: {
        proposalHash: 'H256',
        provider: 'AccountId32',
        deposit: 'u128',
      },
      PreimageInvalid: {
        proposalHash: 'H256',
        refIndex: 'u32',
      },
      PreimageMissing: {
        proposalHash: 'H256',
        refIndex: 'u32',
      },
      PreimageReaped: {
        proposalHash: 'H256',
        provider: 'AccountId32',
        deposit: 'u128',
        reaper: 'AccountId32',
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
        propIndex: 'u32',
      },
    },
  },
  /**
   * Lookup53: pallet_democracy::vote_threshold::VoteThreshold
   **/
  PalletDemocracyVoteThreshold: {
    _enum: ['SuperMajorityApprove', 'SuperMajorityAgainst', 'SimpleMajority'],
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
        nay: 'u128',
      },
    },
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
        deposit: 'u128',
      },
    },
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
        account: 'AccountId32',
      },
    },
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
    },
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
        buyer: 'AccountId32',
      },
    },
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
        hash_: 'H256',
      },
    },
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
        balance: 'u128',
      },
    },
  },
  /**
   * Lookup68: cfg_types::fee_keys::FeeKey
   **/
  CfgTypesFeeKeysFeeKey: {
    _enum: ['AnchorsCommit', 'AnchorsPreCommit', 'BridgeNativeTransfer', 'NftProofValidation'],
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
        rootHash: 'H256',
      },
    },
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
      LeasePeriodUpdated: 'u32',
    },
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
      VestingStartUpdated: 'u32',
    },
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
      PoolCreated: {
        admin: 'AccountId32',
        depositor: 'AccountId32',
        poolId: 'u64',
        essence: 'CfgTypesPoolsPoolEssence',
      },
      PoolUpdated: {
        _alias: {
          new_: 'new',
        },
        id: 'u64',
        old: 'CfgTypesPoolsPoolEssence',
        new_: 'CfgTypesPoolsPoolEssence',
      },
    },
  },
  /**
   * Lookup74: pallet_pool_system::solution::EpochSolution<Balance>
   **/
  PalletPoolSystemSolutionEpochSolution: {
    _enum: {
      Healthy: 'PalletPoolSystemSolutionHealthySolution',
      Unhealthy: 'PalletPoolSystemSolutionUnhealthySolution',
    },
  },
  /**
   * Lookup75: pallet_pool_system::solution::HealthySolution<Balance>
   **/
  PalletPoolSystemSolutionHealthySolution: {
    solution: 'Vec<CfgTypesTranchesTrancheSolution>',
    score: 'u128',
  },
  /**
   * Lookup77: cfg_types::tranches::TrancheSolution
   **/
  CfgTypesTranchesTrancheSolution: {
    investFulfillment: 'Perquintill',
    redeemFulfillment: 'Perquintill',
  },
  /**
   * Lookup79: pallet_pool_system::solution::UnhealthySolution<Balance>
   **/
  PalletPoolSystemSolutionUnhealthySolution: {
    state: 'Vec<PalletPoolSystemSolutionUnhealthyState>',
    solution: 'Vec<CfgTypesTranchesTrancheSolution>',
    riskBufferImprovementScores: 'Option<Vec<u128>>',
    reserveImprovementScore: 'Option<u128>',
  },
  /**
   * Lookup81: pallet_pool_system::solution::UnhealthyState
   **/
  PalletPoolSystemSolutionUnhealthyState: {
    _enum: ['MaxReserveViolated', 'MinRiskBufferViolated'],
  },
  /**
   * Lookup85: cfg_types::pools::PoolEssence<cfg_types::tokens::CurrencyId, Balance, cfg_types::tokens::TrancheCurrency, cfg_types::fixed_point::Rate, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  CfgTypesPoolsPoolEssence: {
    currency: 'CfgTypesTokensCurrencyId',
    maxReserve: 'u128',
    maxNavAge: 'u64',
    minEpochTime: 'u64',
    tranches: 'Vec<CfgTypesTranchesTrancheEssence>',
  },
  /**
   * Lookup86: cfg_types::tokens::CurrencyId
   **/
  CfgTypesTokensCurrencyId: {
    _enum: {
      Native: 'Null',
      Tranche: '(u64,[u8;16])',
      KSM: 'Null',
      AUSD: 'Null',
      ForeignAsset: 'u32',
    },
  },
  /**
   * Lookup88: cfg_types::tokens::TrancheCurrency
   **/
  CfgTypesTokensTrancheCurrency: {
    poolId: 'u64',
    trancheId: '[u8;16]',
  },
  /**
   * Lookup90: cfg_types::consts::pools::MaxTrancheNameLengthBytes
   **/
  CfgTypesConstsPoolsMaxTrancheNameLengthBytes: 'Null',
  /**
   * Lookup91: cfg_types::consts::pools::MaxTrancheSymbolLengthBytes
   **/
  CfgTypesConstsPoolsMaxTrancheSymbolLengthBytes: 'Null',
  /**
   * Lookup93: cfg_types::tranches::TrancheEssence<cfg_types::tokens::TrancheCurrency, cfg_types::fixed_point::Rate, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  CfgTypesTranchesTrancheEssence: {
    currency: 'CfgTypesTokensTrancheCurrency',
    ty: 'CfgTypesTranchesTrancheType',
    metadata: 'CfgTypesTranchesTrancheMetadata',
  },
  /**
   * Lookup94: cfg_types::tranches::TrancheType<cfg_types::fixed_point::Rate>
   **/
  CfgTypesTranchesTrancheType: {
    _enum: {
      Residual: 'Null',
      NonResidual: {
        interestRatePerSec: 'u128',
        minRiskBuffer: 'Perquintill',
      },
    },
  },
  /**
   * Lookup95: cfg_types::tranches::TrancheMetadata<cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  CfgTypesTranchesTrancheMetadata: {
    tokenName: 'Bytes',
    tokenSymbol: 'Bytes',
  },
  /**
   * Lookup98: pallet_loans::pallet::Event<T>
   **/
  PalletLoansEvent: {
    _enum: {
      PoolInitialised: {
        poolId: 'u64',
      },
      Created: {
        poolId: 'u64',
        loanId: 'u128',
        collateral: 'PalletLoansAsset',
      },
      Closed: {
        poolId: 'u64',
        loanId: 'u128',
        collateral: 'PalletLoansAsset',
      },
      Priced: {
        poolId: 'u64',
        loanId: 'u128',
        interestRatePerSec: 'u128',
        loanType: 'PalletLoansLoanType',
      },
      Borrowed: {
        poolId: 'u64',
        loanId: 'u128',
        amount: 'u128',
      },
      Repaid: {
        poolId: 'u64',
        loanId: 'u128',
        amount: 'u128',
      },
      NAVUpdated: {
        poolId: 'u64',
        nav: 'u128',
        updateType: 'PalletLoansNavUpdateType',
      },
      WriteOffGroupAdded: {
        poolId: 'u64',
        writeOffGroupIndex: 'u32',
      },
      WrittenOff: {
        poolId: 'u64',
        loanId: 'u128',
        percentage: 'u128',
        penaltyInterestRatePerSec: 'u128',
        writeOffGroupIndex: 'Option<u32>',
      },
    },
  },
  /**
   * Lookup99: pallet_loans::types::Asset<ClassId, cfg_primitives::types::ItemId>
   **/
  PalletLoansAsset: '(u64,u128)',
  /**
   * Lookup100: pallet_loans::loan_type::LoanType<cfg_types::fixed_point::Rate, Balance>
   **/
  PalletLoansLoanType: {
    _enum: {
      BulletLoan: 'PalletLoansLoanTypeBulletLoan',
      CreditLine: 'PalletLoansLoanTypeCreditLine',
      CreditLineWithMaturity: 'PalletLoansLoanTypeCreditLineWithMaturity',
    },
  },
  /**
   * Lookup101: pallet_loans::loan_type::BulletLoan<cfg_types::fixed_point::Rate, Balance>
   **/
  PalletLoansLoanTypeBulletLoan: {
    advanceRate: 'u128',
    probabilityOfDefault: 'u128',
    lossGivenDefault: 'u128',
    value: 'u128',
    discountRate: 'u128',
    maturityDate: 'u64',
  },
  /**
   * Lookup102: pallet_loans::loan_type::CreditLine<cfg_types::fixed_point::Rate, Balance>
   **/
  PalletLoansLoanTypeCreditLine: {
    advanceRate: 'u128',
    value: 'u128',
  },
  /**
   * Lookup103: pallet_loans::loan_type::CreditLineWithMaturity<cfg_types::fixed_point::Rate, Balance>
   **/
  PalletLoansLoanTypeCreditLineWithMaturity: {
    advanceRate: 'u128',
    probabilityOfDefault: 'u128',
    lossGivenDefault: 'u128',
    value: 'u128',
    discountRate: 'u128',
    maturityDate: 'u64',
  },
  /**
   * Lookup104: pallet_loans::types::NAVUpdateType
   **/
  PalletLoansNavUpdateType: {
    _enum: ['Exact', 'Inexact'],
  },
  /**
   * Lookup106: pallet_permissions::pallet::Event<T>
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
        scope: 'CfgTypesPermissionsPermissionScope',
      },
    },
  },
  /**
   * Lookup107: cfg_types::permissions::PermissionScope<PoolId, cfg_types::tokens::CurrencyId>
   **/
  CfgTypesPermissionsPermissionScope: {
    _enum: {
      Pool: 'u64',
      Currency: 'CfgTypesTokensCurrencyId',
    },
  },
  /**
   * Lookup108: cfg_types::permissions::Role<TrancheId, Moment>
   **/
  CfgTypesPermissionsRole: {
    _enum: {
      PoolRole: 'CfgTypesPermissionsPoolRole',
      PermissionedCurrencyRole: 'CfgTypesPermissionsPermissionedCurrencyRole',
    },
  },
  /**
   * Lookup109: cfg_types::permissions::PoolRole<TrancheId, Moment>
   **/
  CfgTypesPermissionsPoolRole: {
    _enum: {
      PoolAdmin: 'Null',
      Borrower: 'Null',
      PricingAdmin: 'Null',
      LiquidityAdmin: 'Null',
      MemberListAdmin: 'Null',
      LoanAdmin: 'Null',
      TrancheInvestor: '([u8;16],u64)',
    },
  },
  /**
   * Lookup110: cfg_types::permissions::PermissionedCurrencyRole<Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyRole: {
    _enum: {
      Holder: 'u64',
      Manager: 'Null',
      Issuer: 'Null',
    },
  },
  /**
   * Lookup111: pallet_collator_allowlist::pallet::Event<T>
   **/
  PalletCollatorAllowlistEvent: {
    _enum: {
      CollatorAdded: {
        collatorId: 'AccountId32',
      },
      CollatorRemoved: {
        collatorId: 'AccountId32',
      },
    },
  },
  /**
   * Lookup112: pallet_restricted_tokens::pallet::Event<T>
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
        reserved: 'u128',
      },
    },
  },
  /**
   * Lookup113: pallet_nft_sales::pallet::Event<T>
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
        buyer: 'AccountId32',
      },
    },
  },
  /**
   * Lookup114: pallet_nft_sales::Sale<sp_core::crypto::AccountId32, cfg_types::tokens::CurrencyId, Balance>
   **/
  PalletNftSalesSale: {
    seller: 'AccountId32',
    price: 'PalletNftSalesPrice',
  },
  /**
   * Lookup115: pallet_nft_sales::Price<cfg_types::tokens::CurrencyId, Balance>
   **/
  PalletNftSalesPrice: {
    currency: 'CfgTypesTokensCurrencyId',
    amount: 'u128',
  },
  /**
   * Lookup116: pallet_bridge::pallet::Event<T>
   **/
  PalletBridgeEvent: {
    _enum: {
      Remark: '(H256,[u8;32])',
    },
  },
  /**
   * Lookup117: pallet_interest_accrual::pallet::Event<T>
   **/
  PalletInterestAccrualEvent: 'Null',
  /**
   * Lookup118: pallet_nft::pallet::Event<T>
   **/
  PalletNftEvent: {
    _enum: {
      DepositAsset: 'H256',
    },
  },
  /**
   * Lookup119: pallet_keystore::pallet::Event<T>
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
        newDeposit: 'u128',
      },
    },
  },
  /**
   * Lookup120: pallet_keystore::KeyPurpose
   **/
  PalletKeystoreKeyPurpose: {
    _enum: ['P2PDiscovery', 'P2PDocumentSigning'],
  },
  /**
   * Lookup121: pallet_keystore::KeyType
   **/
  PalletKeystoreKeyType: {
    _enum: ['ECDSA', 'EDDSA'],
  },
  /**
   * Lookup122: pallet_investments::pallet::Event<T>
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
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
    },
  },
  /**
   * Lookup124: pallet_investments::InvestCollection<Balance>
   **/
  PalletInvestmentsInvestCollection: {
    payoutInvestmentInvest: 'u128',
    remainingInvestmentInvest: 'u128',
  },
  /**
   * Lookup125: pallet_investments::CollectOutcome
   **/
  PalletInvestmentsCollectOutcome: {
    _enum: ['FullyCollected', 'PartiallyCollected'],
  },
  /**
   * Lookup126: pallet_investments::RedeemCollection<Balance>
   **/
  PalletInvestmentsRedeemCollection: {
    payoutInvestmentRedeem: 'u128',
    remainingInvestmentRedeem: 'u128',
  },
  /**
   * Lookup127: cfg_types::orders::FulfillmentWithPrice<cfg_types::fixed_point::Rate>
   **/
  CfgTypesOrdersFulfillmentWithPrice: {
    ofAmount: 'Perquintill',
    price: 'u128',
  },
  /**
   * Lookup128: cfg_types::orders::TotalOrder<Balance>
   **/
  CfgTypesOrdersTotalOrder: {
    amount: 'u128',
  },
  /**
   * Lookup129: pallet_rewards::pallet::Event<T, I>
   **/
  PalletRewardsEvent: {
    _enum: {
      GroupRewarded: {
        groupId: 'u32',
        amount: 'u128',
      },
      StakeDeposited: {
        groupId: 'u32',
        domainId: 'DevelopmentRuntimeRewardDomain',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      StakeWithdrawn: {
        groupId: 'u32',
        domainId: 'DevelopmentRuntimeRewardDomain',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      RewardClaimed: {
        groupId: 'u32',
        domainId: 'DevelopmentRuntimeRewardDomain',
        currencyId: 'CfgTypesTokensCurrencyId',
        accountId: 'AccountId32',
        amount: 'u128',
      },
      CurrencyAttached: {
        domainId: 'DevelopmentRuntimeRewardDomain',
        currencyId: 'CfgTypesTokensCurrencyId',
        from: 'Option<u32>',
        to: 'u32',
      },
    },
  },
  /**
   * Lookup130: development_runtime::RewardDomain
   **/
  DevelopmentRuntimeRewardDomain: {
    _enum: ['Liquidity', 'Block'],
  },
  /**
   * Lookup131: pallet_liquidity_rewards::pallet::Event<T>
   **/
  PalletLiquidityRewardsEvent: {
    _enum: {
      NewEpoch: {
        endsOn: 'u32',
        reward: 'u128',
        lastChanges: 'PalletLiquidityRewardsEpochChanges',
      },
    },
  },
  /**
   * Lookup132: pallet_liquidity_rewards::EpochChanges<BlockNumber, Balance, GroupId, cfg_types::tokens::CurrencyId, Weight, development_runtime::MaxChangesPerEpoch>
   **/
  PalletLiquidityRewardsEpochChanges: {
    duration: 'Option<u32>',
    reward: 'Option<u128>',
    weights: 'BTreeMap<u32, u64>',
    currencies: 'BTreeMap<CfgTypesTokensCurrencyId, u32>',
  },
  /**
   * Lookup133: development_runtime::MaxChangesPerEpoch
   **/
  DevelopmentRuntimeMaxChangesPerEpoch: 'Null',
  /**
   * Lookup142: pallet_connectors::pallet::Event<T>
   **/
  PalletConnectorsEvent: {
    _enum: {
      MessageSent: {
        message: 'PalletConnectorsMessage',
        domain: 'PalletConnectorsDomain',
      },
      SetDomainRouter: {
        domain: 'PalletConnectorsDomain',
        router: 'PalletConnectorsRoutersRouter',
      },
    },
  },
  /**
   * Lookup143: pallet_connectors::message::Message<pallet_connectors::Domain, PoolId, TrancheId, Balance, cfg_types::fixed_point::Rate>
   **/
  PalletConnectorsMessage: {
    _enum: {
      Invalid: 'Null',
      AddPool: {
        poolId: 'u64',
      },
      AddTranche: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        tokenName: '[u8;128]',
        tokenSymbol: '[u8;32]',
      },
      UpdateTokenPrice: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        price: 'u128',
      },
      UpdateMember: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        address: '[u8;32]',
        validUntil: 'u64',
      },
      Transfer: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domain: 'PalletConnectorsDomain',
        destination: '[u8;32]',
        amount: 'u128',
      },
    },
  },
  /**
   * Lookup144: pallet_connectors::Domain
   **/
  PalletConnectorsDomain: {
    _enum: {
      EVM: 'u64',
      Parachain: 'PalletConnectorsParachainId',
    },
  },
  /**
   * Lookup145: pallet_connectors::ParachainId
   **/
  PalletConnectorsParachainId: {
    _enum: ['Moonbeam'],
  },
  /**
   * Lookup147: pallet_connectors::routers::Router<cfg_types::tokens::CurrencyId>
   **/
  PalletConnectorsRoutersRouter: {
    _enum: {
      Xcm: 'PalletConnectorsRoutersXcmDomain',
    },
  },
  /**
   * Lookup148: pallet_connectors::routers::XcmDomain<cfg_types::tokens::CurrencyId>
   **/
  PalletConnectorsRoutersXcmDomain: {
    location: 'XcmVersionedMultiLocation',
    ethereumXcmTransactCallIndex: 'Bytes',
    contractAddress: 'H160',
    feeCurrency: 'CfgTypesTokensCurrencyId',
  },
  /**
   * Lookup149: xcm::VersionedMultiLocation
   **/
  XcmVersionedMultiLocation: {
    _enum: {
      V0: 'XcmV0MultiLocation',
      V1: 'XcmV1MultiLocation',
    },
  },
  /**
   * Lookup150: xcm::v0::multi_location::MultiLocation
   **/
  XcmV0MultiLocation: {
    _enum: {
      Null: 'Null',
      X1: 'XcmV0Junction',
      X2: '(XcmV0Junction,XcmV0Junction)',
      X3: '(XcmV0Junction,XcmV0Junction,XcmV0Junction)',
      X4: '(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)',
      X5: '(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)',
      X6: '(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)',
      X7: '(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)',
      X8: '(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)',
    },
  },
  /**
   * Lookup151: xcm::v0::junction::Junction
   **/
  XcmV0Junction: {
    _enum: {
      Parent: 'Null',
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'XcmV0JunctionNetworkId',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'XcmV0JunctionNetworkId',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'XcmV0JunctionNetworkId',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: 'Bytes',
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV0JunctionBodyId',
        part: 'XcmV0JunctionBodyPart',
      },
    },
  },
  /**
   * Lookup153: xcm::v0::junction::NetworkId
   **/
  XcmV0JunctionNetworkId: {
    _enum: {
      Any: 'Null',
      Named: 'Bytes',
      Polkadot: 'Null',
      Kusama: 'Null',
    },
  },
  /**
   * Lookup158: xcm::v0::junction::BodyId
   **/
  XcmV0JunctionBodyId: {
    _enum: {
      Unit: 'Null',
      Named: 'Bytes',
      Index: 'Compact<u32>',
      Executive: 'Null',
      Technical: 'Null',
      Legislative: 'Null',
      Judicial: 'Null',
    },
  },
  /**
   * Lookup159: xcm::v0::junction::BodyPart
   **/
  XcmV0JunctionBodyPart: {
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
        denom: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup160: xcm::v1::multilocation::MultiLocation
   **/
  XcmV1MultiLocation: {
    parents: 'u8',
    interior: 'XcmV1MultilocationJunctions',
  },
  /**
   * Lookup161: xcm::v1::multilocation::Junctions
   **/
  XcmV1MultilocationJunctions: {
    _enum: {
      Here: 'Null',
      X1: 'XcmV1Junction',
      X2: '(XcmV1Junction,XcmV1Junction)',
      X3: '(XcmV1Junction,XcmV1Junction,XcmV1Junction)',
      X4: '(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)',
      X5: '(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)',
      X6: '(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)',
      X7: '(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)',
      X8: '(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)',
    },
  },
  /**
   * Lookup162: xcm::v1::junction::Junction
   **/
  XcmV1Junction: {
    _enum: {
      Parachain: 'Compact<u32>',
      AccountId32: {
        network: 'XcmV0JunctionNetworkId',
        id: '[u8;32]',
      },
      AccountIndex64: {
        network: 'XcmV0JunctionNetworkId',
        index: 'Compact<u64>',
      },
      AccountKey20: {
        network: 'XcmV0JunctionNetworkId',
        key: '[u8;20]',
      },
      PalletInstance: 'u8',
      GeneralIndex: 'Compact<u128>',
      GeneralKey: 'Bytes',
      OnlyChild: 'Null',
      Plurality: {
        id: 'XcmV0JunctionBodyId',
        part: 'XcmV0JunctionBodyPart',
      },
    },
  },
  /**
   * Lookup164: pallet_pool_registry::pallet::Event<T>
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
        metadata: 'Bytes',
      },
    },
  },
  /**
   * Lookup166: cumulus_pallet_xcmp_queue::pallet::Event<T>
   **/
  CumulusPalletXcmpQueueEvent: {
    _enum: {
      Success: {
        messageHash: 'Option<H256>',
        weight: 'Weight',
      },
      Fail: {
        messageHash: 'Option<H256>',
        error: 'XcmV2TraitsError',
        weight: 'Weight',
      },
      BadVersion: {
        messageHash: 'Option<H256>',
      },
      BadFormat: {
        messageHash: 'Option<H256>',
      },
      UpwardMessageSent: {
        messageHash: 'Option<H256>',
      },
      XcmpMessageSent: {
        messageHash: 'Option<H256>',
      },
      OverweightEnqueued: {
        sender: 'u32',
        sentAt: 'u32',
        index: 'u64',
        required: 'Weight',
      },
      OverweightServiced: {
        index: 'u64',
        used: 'Weight',
      },
    },
  },
  /**
   * Lookup168: xcm::v2::traits::Error
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
      WeightNotComputable: 'Null',
    },
  },
  /**
   * Lookup170: pallet_xcm::pallet::Event<T>
   **/
  PalletXcmEvent: {
    _enum: {
      Attempted: 'XcmV2TraitsOutcome',
      Sent: '(XcmV1MultiLocation,XcmV1MultiLocation,XcmV2Xcm)',
      UnexpectedResponse: '(XcmV1MultiLocation,u64)',
      ResponseReady: '(u64,XcmV2Response)',
      Notified: '(u64,u8,u8)',
      NotifyOverweight: '(u64,u8,u8,Weight,Weight)',
      NotifyDispatchError: '(u64,u8,u8)',
      NotifyDecodeFailed: '(u64,u8,u8)',
      InvalidResponder: '(XcmV1MultiLocation,u64,Option<XcmV1MultiLocation>)',
      InvalidResponderVersion: '(XcmV1MultiLocation,u64)',
      ResponseTaken: 'u64',
      AssetsTrapped: '(H256,XcmV1MultiLocation,XcmVersionedMultiAssets)',
      VersionChangeNotified: '(XcmV1MultiLocation,u32)',
      SupportedVersionChanged: '(XcmV1MultiLocation,u32)',
      NotifyTargetSendFail: '(XcmV1MultiLocation,u64,XcmV2TraitsError)',
      NotifyTargetMigrationFail: '(XcmVersionedMultiLocation,u64)',
    },
  },
  /**
   * Lookup171: xcm::v2::traits::Outcome
   **/
  XcmV2TraitsOutcome: {
    _enum: {
      Complete: 'u64',
      Incomplete: '(u64,XcmV2TraitsError)',
      Error: 'XcmV2TraitsError',
    },
  },
  /**
   * Lookup172: xcm::v2::Xcm<Call>
   **/
  XcmV2Xcm: 'Vec<XcmV2Instruction>',
  /**
   * Lookup174: xcm::v2::Instruction<Call>
   **/
  XcmV2Instruction: {
    _enum: {
      WithdrawAsset: 'XcmV1MultiassetMultiAssets',
      ReserveAssetDeposited: 'XcmV1MultiassetMultiAssets',
      ReceiveTeleportedAsset: 'XcmV1MultiassetMultiAssets',
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV2Response',
        maxWeight: 'Compact<u64>',
      },
      TransferAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        beneficiary: 'XcmV1MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        dest: 'XcmV1MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      Transact: {
        originType: 'XcmV0OriginKind',
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
      DescendOrigin: 'XcmV1MultilocationJunctions',
      ReportError: {
        queryId: 'Compact<u64>',
        dest: 'XcmV1MultiLocation',
        maxResponseWeight: 'Compact<u64>',
      },
      DepositAsset: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        beneficiary: 'XcmV1MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        maxAssets: 'Compact<u32>',
        dest: 'XcmV1MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      ExchangeAsset: {
        give: 'XcmV1MultiassetMultiAssetFilter',
        receive: 'XcmV1MultiassetMultiAssets',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        reserve: 'XcmV1MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      InitiateTeleport: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        dest: 'XcmV1MultiLocation',
        xcm: 'XcmV2Xcm',
      },
      QueryHolding: {
        queryId: 'Compact<u64>',
        dest: 'XcmV1MultiLocation',
        assets: 'XcmV1MultiassetMultiAssetFilter',
        maxResponseWeight: 'Compact<u64>',
      },
      BuyExecution: {
        fees: 'XcmV1MultiAsset',
        weightLimit: 'XcmV2WeightLimit',
      },
      RefundSurplus: 'Null',
      SetErrorHandler: 'XcmV2Xcm',
      SetAppendix: 'XcmV2Xcm',
      ClearError: 'Null',
      ClaimAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        ticket: 'XcmV1MultiLocation',
      },
      Trap: 'Compact<u64>',
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'Compact<u64>',
      },
      UnsubscribeVersion: 'Null',
    },
  },
  /**
   * Lookup175: xcm::v1::multiasset::MultiAssets
   **/
  XcmV1MultiassetMultiAssets: 'Vec<XcmV1MultiAsset>',
  /**
   * Lookup177: xcm::v1::multiasset::MultiAsset
   **/
  XcmV1MultiAsset: {
    id: 'XcmV1MultiassetAssetId',
    fun: 'XcmV1MultiassetFungibility',
  },
  /**
   * Lookup178: xcm::v1::multiasset::AssetId
   **/
  XcmV1MultiassetAssetId: {
    _enum: {
      Concrete: 'XcmV1MultiLocation',
      Abstract: 'Bytes',
    },
  },
  /**
   * Lookup179: xcm::v1::multiasset::Fungibility
   **/
  XcmV1MultiassetFungibility: {
    _enum: {
      Fungible: 'Compact<u128>',
      NonFungible: 'XcmV1MultiassetAssetInstance',
    },
  },
  /**
   * Lookup180: xcm::v1::multiasset::AssetInstance
   **/
  XcmV1MultiassetAssetInstance: {
    _enum: {
      Undefined: 'Null',
      Index: 'Compact<u128>',
      Array4: '[u8;4]',
      Array8: '[u8;8]',
      Array16: '[u8;16]',
      Array32: '[u8;32]',
      Blob: 'Bytes',
    },
  },
  /**
   * Lookup182: xcm::v2::Response
   **/
  XcmV2Response: {
    _enum: {
      Null: 'Null',
      Assets: 'XcmV1MultiassetMultiAssets',
      ExecutionResult: 'Option<(u32,XcmV2TraitsError)>',
      Version: 'u32',
    },
  },
  /**
   * Lookup185: xcm::v0::OriginKind
   **/
  XcmV0OriginKind: {
    _enum: ['Native', 'SovereignAccount', 'Superuser', 'Xcm'],
  },
  /**
   * Lookup186: xcm::double_encoded::DoubleEncoded<T>
   **/
  XcmDoubleEncoded: {
    encoded: 'Bytes',
  },
  /**
   * Lookup187: xcm::v1::multiasset::MultiAssetFilter
   **/
  XcmV1MultiassetMultiAssetFilter: {
    _enum: {
      Definite: 'XcmV1MultiassetMultiAssets',
      Wild: 'XcmV1MultiassetWildMultiAsset',
    },
  },
  /**
   * Lookup188: xcm::v1::multiasset::WildMultiAsset
   **/
  XcmV1MultiassetWildMultiAsset: {
    _enum: {
      All: 'Null',
      AllOf: {
        id: 'XcmV1MultiassetAssetId',
        fun: 'XcmV1MultiassetWildFungibility',
      },
    },
  },
  /**
   * Lookup189: xcm::v1::multiasset::WildFungibility
   **/
  XcmV1MultiassetWildFungibility: {
    _enum: ['Fungible', 'NonFungible'],
  },
  /**
   * Lookup190: xcm::v2::WeightLimit
   **/
  XcmV2WeightLimit: {
    _enum: {
      Unlimited: 'Null',
      Limited: 'Compact<u64>',
    },
  },
  /**
   * Lookup192: xcm::VersionedMultiAssets
   **/
  XcmVersionedMultiAssets: {
    _enum: {
      V0: 'Vec<XcmV0MultiAsset>',
      V1: 'XcmV1MultiassetMultiAssets',
    },
  },
  /**
   * Lookup194: xcm::v0::multi_asset::MultiAsset
   **/
  XcmV0MultiAsset: {
    _enum: {
      None: 'Null',
      All: 'Null',
      AllFungible: 'Null',
      AllNonFungible: 'Null',
      AllAbstractFungible: {
        id: 'Bytes',
      },
      AllAbstractNonFungible: {
        class: 'Bytes',
      },
      AllConcreteFungible: {
        id: 'XcmV0MultiLocation',
      },
      AllConcreteNonFungible: {
        class: 'XcmV0MultiLocation',
      },
      AbstractFungible: {
        id: 'Bytes',
        amount: 'Compact<u128>',
      },
      AbstractNonFungible: {
        class: 'Bytes',
        instance: 'XcmV1MultiassetAssetInstance',
      },
      ConcreteFungible: {
        id: 'XcmV0MultiLocation',
        amount: 'Compact<u128>',
      },
      ConcreteNonFungible: {
        class: 'XcmV0MultiLocation',
        instance: 'XcmV1MultiassetAssetInstance',
      },
    },
  },
  /**
   * Lookup195: cumulus_pallet_xcm::pallet::Event<T>
   **/
  CumulusPalletXcmEvent: {
    _enum: {
      InvalidFormat: '[u8;8]',
      UnsupportedVersion: '[u8;8]',
      ExecutedDownward: '([u8;8],XcmV2TraitsOutcome)',
    },
  },
  /**
   * Lookup196: cumulus_pallet_dmp_queue::pallet::Event<T>
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
        outcome: 'XcmV2TraitsOutcome',
      },
      WeightExhausted: {
        messageId: '[u8;32]',
        remainingWeight: 'Weight',
        requiredWeight: 'Weight',
      },
      OverweightEnqueued: {
        messageId: '[u8;32]',
        overweightIndex: 'u64',
        requiredWeight: 'Weight',
      },
      OverweightServiced: {
        overweightIndex: 'u64',
        weightUsed: 'Weight',
      },
    },
  },
  /**
   * Lookup197: orml_xtokens::module::Event<T>
   **/
  OrmlXtokensModuleEvent: {
    _enum: {
      TransferredMultiAssets: {
        sender: 'AccountId32',
        assets: 'XcmV1MultiassetMultiAssets',
        fee: 'XcmV1MultiAsset',
        dest: 'XcmV1MultiLocation',
      },
    },
  },
  /**
   * Lookup198: pallet_xcm_transactor::pallet::Event<T>
   **/
  PalletXcmTransactorEvent: {
    _enum: {
      TransactedDerivative: {
        accountId: 'AccountId32',
        dest: 'XcmV1MultiLocation',
        call: 'Bytes',
        index: 'u16',
      },
      TransactedSovereign: {
        feePayer: 'AccountId32',
        dest: 'XcmV1MultiLocation',
        call: 'Bytes',
      },
      TransactedSigned: {
        feePayer: 'AccountId32',
        dest: 'XcmV1MultiLocation',
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
        error: 'XcmV2TraitsError',
      },
      TransactInfoChanged: {
        location: 'XcmV1MultiLocation',
        remoteInfo: 'PalletXcmTransactorRemoteTransactInfoWithMaxWeight',
      },
      TransactInfoRemoved: {
        location: 'XcmV1MultiLocation',
      },
      DestFeePerSecondChanged: {
        location: 'XcmV1MultiLocation',
        feePerSecond: 'u128',
      },
      DestFeePerSecondRemoved: {
        location: 'XcmV1MultiLocation',
      },
    },
  },
  /**
   * Lookup199: pallet_xcm_transactor::pallet::RemoteTransactInfoWithMaxWeight
   **/
  PalletXcmTransactorRemoteTransactInfoWithMaxWeight: {
    transactExtraWeight: 'u64',
    maxWeight: 'u64',
    transactExtraWeightSigned: 'Option<u64>',
  },
  /**
   * Lookup200: orml_tokens::module::Event<T>
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
    },
  },
  /**
   * Lookup201: chainbridge::pallet::Event<T>
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
      ProposalFailed: '(u8,u64)',
    },
  },
  /**
   * Lookup204: orml_asset_registry::module::Event<T>
   **/
  OrmlAssetRegistryModuleEvent: {
    _enum: {
      RegisteredAsset: {
        assetId: 'CfgTypesTokensCurrencyId',
        metadata: 'OrmlTraitsAssetRegistryAssetMetadata',
      },
      UpdatedAsset: {
        assetId: 'CfgTypesTokensCurrencyId',
        metadata: 'OrmlTraitsAssetRegistryAssetMetadata',
      },
    },
  },
  /**
   * Lookup205: orml_traits::asset_registry::AssetMetadata<Balance, cfg_types::tokens::CustomMetadata>
   **/
  OrmlTraitsAssetRegistryAssetMetadata: {
    decimals: 'u32',
    name: 'Bytes',
    symbol: 'Bytes',
    existentialDeposit: 'u128',
    location: 'Option<XcmVersionedMultiLocation>',
    additional: 'CfgTypesTokensCustomMetadata',
  },
  /**
   * Lookup206: cfg_types::tokens::CustomMetadata
   **/
  CfgTypesTokensCustomMetadata: {
    xcm: 'CfgTypesXcmXcmMetadata',
    mintable: 'bool',
    permissioned: 'bool',
    poolCurrency: 'bool',
  },
  /**
   * Lookup207: cfg_types::xcm::XcmMetadata
   **/
  CfgTypesXcmXcmMetadata: {
    feePerSecond: 'Option<u128>',
  },
  /**
   * Lookup209: orml_xcm::module::Event<T>
   **/
  OrmlXcmModuleEvent: {
    _enum: {
      Sent: {
        to: 'XcmV1MultiLocation',
        message: 'XcmV2Xcm',
      },
    },
  },
  /**
   * Lookup210: pallet_migration_manager::pallet::Event<T>
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
      MigrationFinished: 'Null',
    },
  },
  /**
   * Lookup211: pallet_sudo::pallet::Event<T>
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
        sudoResult: 'Result<Null, SpRuntimeDispatchError>',
      },
    },
  },
  /**
   * Lookup212: frame_system::Phase
   **/
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: 'u32',
      Finalization: 'Null',
      Initialization: 'Null',
    },
  },
  /**
   * Lookup215: frame_system::LastRuntimeUpgradeInfo
   **/
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: 'Compact<u32>',
    specName: 'Text',
  },
  /**
   * Lookup217: frame_system::pallet::Call<T>
   **/
  FrameSystemCall: {
    _enum: {
      fill_block: {
        ratio: 'Perbill',
      },
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
        remark: 'Bytes',
      },
    },
  },
  /**
   * Lookup221: frame_system::limits::BlockWeights
   **/
  FrameSystemLimitsBlockWeights: {
    baseBlock: 'Weight',
    maxBlock: 'Weight',
    perClass: 'FrameSupportWeightsPerDispatchClassWeightsPerClass',
  },
  /**
   * Lookup222: frame_support::weights::PerDispatchClass<frame_system::limits::WeightsPerClass>
   **/
  FrameSupportWeightsPerDispatchClassWeightsPerClass: {
    normal: 'FrameSystemLimitsWeightsPerClass',
    operational: 'FrameSystemLimitsWeightsPerClass',
    mandatory: 'FrameSystemLimitsWeightsPerClass',
  },
  /**
   * Lookup223: frame_system::limits::WeightsPerClass
   **/
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: 'Weight',
    maxExtrinsic: 'Option<Weight>',
    maxTotal: 'Option<Weight>',
    reserved: 'Option<Weight>',
  },
  /**
   * Lookup225: frame_system::limits::BlockLength
   **/
  FrameSystemLimitsBlockLength: {
    max: 'FrameSupportWeightsPerDispatchClassU32',
  },
  /**
   * Lookup226: frame_support::weights::PerDispatchClass<T>
   **/
  FrameSupportWeightsPerDispatchClassU32: {
    normal: 'u32',
    operational: 'u32',
    mandatory: 'u32',
  },
  /**
   * Lookup227: frame_support::weights::RuntimeDbWeight
   **/
  FrameSupportWeightsRuntimeDbWeight: {
    read: 'u64',
    write: 'u64',
  },
  /**
   * Lookup228: sp_version::RuntimeVersion
   **/
  SpVersionRuntimeVersion: {
    specName: 'Text',
    implName: 'Text',
    authoringVersion: 'u32',
    specVersion: 'u32',
    implVersion: 'u32',
    apis: 'Vec<([u8;8],u32)>',
    transactionVersion: 'u32',
    stateVersion: 'u8',
  },
  /**
   * Lookup232: frame_system::pallet::Error<T>
   **/
  FrameSystemError: {
    _enum: [
      'InvalidSpecName',
      'SpecVersionNeedsToIncrease',
      'FailedToExtractRuntimeVersion',
      'NonDefaultComposite',
      'NonZeroRefCount',
      'CallFiltered',
    ],
  },
  /**
   * Lookup233: polkadot_primitives::v2::PersistedValidationData<primitive_types::H256, N>
   **/
  PolkadotPrimitivesV2PersistedValidationData: {
    parentHead: 'Bytes',
    relayParentNumber: 'u32',
    relayParentStorageRoot: 'H256',
    maxPovSize: 'u32',
  },
  /**
   * Lookup236: polkadot_primitives::v2::UpgradeRestriction
   **/
  PolkadotPrimitivesV2UpgradeRestriction: {
    _enum: ['Present'],
  },
  /**
   * Lookup237: sp_trie::storage_proof::StorageProof
   **/
  SpTrieStorageProof: {
    trieNodes: 'BTreeSet<Bytes>',
  },
  /**
   * Lookup239: cumulus_pallet_parachain_system::relay_state_snapshot::MessagingStateSnapshot
   **/
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot: {
    dmqMqcHead: 'H256',
    relayDispatchQueueSize: '(u32,u32)',
    ingressChannels: 'Vec<(u32,PolkadotPrimitivesV2AbridgedHrmpChannel)>',
    egressChannels: 'Vec<(u32,PolkadotPrimitivesV2AbridgedHrmpChannel)>',
  },
  /**
   * Lookup242: polkadot_primitives::v2::AbridgedHrmpChannel
   **/
  PolkadotPrimitivesV2AbridgedHrmpChannel: {
    maxCapacity: 'u32',
    maxTotalSize: 'u32',
    maxMessageSize: 'u32',
    msgCount: 'u32',
    totalSize: 'u32',
    mqcHead: 'Option<H256>',
  },
  /**
   * Lookup243: polkadot_primitives::v2::AbridgedHostConfiguration
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
    validationUpgradeDelay: 'u32',
  },
  /**
   * Lookup249: polkadot_core_primitives::OutboundHrmpMessage<polkadot_parachain::primitives::Id>
   **/
  PolkadotCorePrimitivesOutboundHrmpMessage: {
    recipient: 'u32',
    data: 'Bytes',
  },
  /**
   * Lookup250: cumulus_pallet_parachain_system::pallet::Call<T>
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
        code: 'Bytes',
      },
    },
  },
  /**
   * Lookup251: cumulus_primitives_parachain_inherent::ParachainInherentData
   **/
  CumulusPrimitivesParachainInherentParachainInherentData: {
    validationData: 'PolkadotPrimitivesV2PersistedValidationData',
    relayChainState: 'SpTrieStorageProof',
    downwardMessages: 'Vec<PolkadotCorePrimitivesInboundDownwardMessage>',
    horizontalMessages: 'BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>',
  },
  /**
   * Lookup253: polkadot_core_primitives::InboundDownwardMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundDownwardMessage: {
    sentAt: 'u32',
    msg: 'Bytes',
  },
  /**
   * Lookup256: polkadot_core_primitives::InboundHrmpMessage<BlockNumber>
   **/
  PolkadotCorePrimitivesInboundHrmpMessage: {
    sentAt: 'u32',
    data: 'Bytes',
  },
  /**
   * Lookup259: cumulus_pallet_parachain_system::pallet::Error<T>
   **/
  CumulusPalletParachainSystemError: {
    _enum: [
      'OverlappingUpgrades',
      'ProhibitedByPolkadot',
      'TooBig',
      'ValidationDataNotAvailable',
      'HostConfigurationNotAvailable',
      'NotScheduled',
      'NothingAuthorized',
      'Unauthorized',
    ],
  },
  /**
   * Lookup261: pallet_timestamp::pallet::Call<T>
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<u64>',
      },
    },
  },
  /**
   * Lookup263: pallet_balances::BalanceLock<Balance>
   **/
  PalletBalancesBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
    reasons: 'PalletBalancesReasons',
  },
  /**
   * Lookup264: pallet_balances::Reasons
   **/
  PalletBalancesReasons: {
    _enum: ['Fee', 'Misc', 'All'],
  },
  /**
   * Lookup267: pallet_balances::ReserveData<ReserveIdentifier, Balance>
   **/
  PalletBalancesReserveData: {
    id: '[u8;8]',
    amount: 'u128',
  },
  /**
   * Lookup269: pallet_balances::Releases
   **/
  PalletBalancesReleases: {
    _enum: ['V1_0_0', 'V2_0_0'],
  },
  /**
   * Lookup270: pallet_balances::pallet::Call<T, I>
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
        amount: 'u128',
      },
    },
  },
  /**
   * Lookup273: pallet_balances::pallet::Error<T, I>
   **/
  PalletBalancesError: {
    _enum: [
      'VestingBalance',
      'LiquidityRestrictions',
      'InsufficientBalance',
      'ExistentialDeposit',
      'KeepAlive',
      'ExistingVestingSchedule',
      'DeadAccount',
      'TooManyReserves',
    ],
  },
  /**
   * Lookup275: pallet_transaction_payment::Releases
   **/
  PalletTransactionPaymentReleases: {
    _enum: ['V1Ancient', 'V2'],
  },
  /**
   * Lookup278: pallet_collator_selection::pallet::CandidateInfo<sp_core::crypto::AccountId32, Balance>
   **/
  PalletCollatorSelectionCandidateInfo: {
    who: 'AccountId32',
    deposit: 'u128',
  },
  /**
   * Lookup280: pallet_collator_selection::pallet::Call<T>
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
      leave_intent: 'Null',
    },
  },
  /**
   * Lookup281: pallet_collator_selection::pallet::Error<T>
   **/
  PalletCollatorSelectionError: {
    _enum: [
      'TooManyCandidates',
      'TooFewCandidates',
      'Unknown',
      'Permission',
      'AlreadyCandidate',
      'NotCandidate',
      'TooManyInvulnerables',
      'AlreadyInvulnerable',
      'NoAssociatedValidatorId',
      'ValidatorNotRegistered',
    ],
  },
  /**
   * Lookup283: pallet_authorship::UncleEntryItem<BlockNumber, primitive_types::H256, sp_core::crypto::AccountId32>
   **/
  PalletAuthorshipUncleEntryItem: {
    _enum: {
      InclusionHeight: 'u32',
      Uncle: '(H256,Option<AccountId32>)',
    },
  },
  /**
   * Lookup285: pallet_authorship::pallet::Call<T>
   **/
  PalletAuthorshipCall: {
    _enum: {
      set_uncles: {
        newUncles: 'Vec<SpRuntimeHeader>',
      },
    },
  },
  /**
   * Lookup287: sp_runtime::generic::header::Header<Number, sp_runtime::traits::BlakeTwo256>
   **/
  SpRuntimeHeader: {
    parentHash: 'H256',
    number: 'Compact<u32>',
    stateRoot: 'H256',
    extrinsicsRoot: 'H256',
    digest: 'SpRuntimeDigest',
  },
  /**
   * Lookup288: sp_runtime::traits::BlakeTwo256
   **/
  SpRuntimeBlakeTwo256: 'Null',
  /**
   * Lookup289: pallet_authorship::pallet::Error<T>
   **/
  PalletAuthorshipError: {
    _enum: [
      'InvalidUncleParent',
      'UnclesAlreadySet',
      'TooManyUncles',
      'GenesisUncle',
      'TooHighUncle',
      'UncleAlreadyIncluded',
      'OldUncle',
    ],
  },
  /**
   * Lookup292: development_runtime::SessionKeys
   **/
  DevelopmentRuntimeSessionKeys: {
    aura: 'SpConsensusAuraSr25519AppSr25519Public',
  },
  /**
   * Lookup293: sp_consensus_aura::sr25519::app_sr25519::Public
   **/
  SpConsensusAuraSr25519AppSr25519Public: 'SpCoreSr25519Public',
  /**
   * Lookup294: sp_core::sr25519::Public
   **/
  SpCoreSr25519Public: '[u8;32]',
  /**
   * Lookup297: sp_core::crypto::KeyTypeId
   **/
  SpCoreCryptoKeyTypeId: '[u8;4]',
  /**
   * Lookup298: pallet_session::pallet::Call<T>
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
      purge_keys: 'Null',
    },
  },
  /**
   * Lookup299: pallet_session::pallet::Error<T>
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey', 'NoKeys', 'NoAccount'],
  },
  /**
   * Lookup304: pallet_multisig::Multisig<BlockNumber, Balance, sp_core::crypto::AccountId32>
   **/
  PalletMultisigMultisig: {
    when: 'PalletMultisigTimepoint',
    deposit: 'u128',
    depositor: 'AccountId32',
    approvals: 'Vec<AccountId32>',
  },
  /**
   * Lookup308: pallet_multisig::pallet::Call<T>
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
        call: 'WrapperKeepOpaque<Call>',
        storeCall: 'bool',
        maxWeight: 'Weight',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        maybeTimepoint: 'Option<PalletMultisigTimepoint>',
        callHash: '[u8;32]',
        maxWeight: 'Weight',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId32>',
        timepoint: 'PalletMultisigTimepoint',
        callHash: '[u8;32]',
      },
    },
  },
  /**
   * Lookup310: pallet_proxy::pallet::Call<T>
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
      anonymous: {
        proxyType: 'DevelopmentRuntimeProxyType',
        delay: 'u32',
        index: 'u16',
      },
      kill_anonymous: {
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
        call: 'Call',
      },
    },
  },
  /**
   * Lookup312: pallet_utility::pallet::Call<T>
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
    },
  },
  /**
   * Lookup314: development_runtime::OriginCaller
   **/
  DevelopmentRuntimeOriginCaller: {
    _enum: {
      system: 'FrameSupportDispatchRawOrigin',
      __Unused1: 'Null',
      __Unused2: 'Null',
      __Unused3: 'Null',
      Void: 'SpCoreVoid',
      __Unused5: 'Null',
      __Unused6: 'Null',
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
      __Unused115: 'Null',
      __Unused116: 'Null',
      __Unused117: 'Null',
      __Unused118: 'Null',
      __Unused119: 'Null',
      __Unused120: 'Null',
      PolkadotXcm: 'PalletXcmOrigin',
      CumulusXcm: 'CumulusPalletXcmOrigin',
    },
  },
  /**
   * Lookup315: frame_support::dispatch::RawOrigin<sp_core::crypto::AccountId32>
   **/
  FrameSupportDispatchRawOrigin: {
    _enum: {
      Root: 'Null',
      Signed: 'AccountId32',
      None: 'Null',
    },
  },
  /**
   * Lookup316: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   **/
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: '(u32,u32)',
      Member: 'AccountId32',
      _Phantom: 'Null',
    },
  },
  /**
   * Lookup317: pallet_xcm::pallet::Origin
   **/
  PalletXcmOrigin: {
    _enum: {
      Xcm: 'XcmV1MultiLocation',
      Response: 'XcmV1MultiLocation',
    },
  },
  /**
   * Lookup318: cumulus_pallet_xcm::pallet::Origin
   **/
  CumulusPalletXcmOrigin: {
    _enum: {
      Relay: 'Null',
      SiblingParachain: 'u32',
    },
  },
  /**
   * Lookup319: sp_core::Void
   **/
  SpCoreVoid: 'Null',
  /**
   * Lookup320: pallet_scheduler::pallet::Call<T>
   **/
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      cancel: {
        when: 'u32',
        index: 'u32',
      },
      schedule_named: {
        id: 'Bytes',
        when: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      cancel_named: {
        id: 'Bytes',
      },
      schedule_after: {
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
      schedule_named_after: {
        id: 'Bytes',
        after: 'u32',
        maybePeriodic: 'Option<(u32,u32)>',
        priority: 'u8',
        call: 'FrameSupportScheduleMaybeHashed',
      },
    },
  },
  /**
   * Lookup322: frame_support::traits::schedule::MaybeHashed<development_runtime::Call, primitive_types::H256>
   **/
  FrameSupportScheduleMaybeHashed: {
    _enum: {
      Value: 'Call',
      Hash: 'H256',
    },
  },
  /**
   * Lookup323: pallet_collective::pallet::Call<T, I>
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
      close: {
        proposalHash: 'H256',
        index: 'Compact<u32>',
        proposalWeightBound: 'Compact<Weight>',
        lengthBound: 'Compact<u32>',
      },
      disapprove_proposal: {
        proposalHash: 'H256',
      },
    },
  },
  /**
   * Lookup325: pallet_elections_phragmen::pallet::Call<T>
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
        numDefunct: 'u32',
      },
    },
  },
  /**
   * Lookup326: pallet_elections_phragmen::Renouncing
   **/
  PalletElectionsPhragmenRenouncing: {
    _enum: {
      Member: 'Null',
      RunnerUp: 'Null',
      Candidate: 'Compact<u32>',
    },
  },
  /**
   * Lookup327: pallet_democracy::pallet::Call<T>
   **/
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposalHash: 'H256',
        value: 'Compact<u128>',
      },
      second: {
        proposal: 'Compact<u32>',
        secondsUpperBound: 'Compact<u32>',
      },
      vote: {
        refIndex: 'Compact<u32>',
        vote: 'PalletDemocracyVoteAccountVote',
      },
      emergency_cancel: {
        refIndex: 'u32',
      },
      external_propose: {
        proposalHash: 'H256',
      },
      external_propose_majority: {
        proposalHash: 'H256',
      },
      external_propose_default: {
        proposalHash: 'H256',
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
      cancel_queued: {
        which: 'u32',
      },
      delegate: {
        to: 'MultiAddress',
        conviction: 'PalletDemocracyConviction',
        balance: 'u128',
      },
      undelegate: 'Null',
      clear_public_proposals: 'Null',
      note_preimage: {
        encodedProposal: 'Bytes',
      },
      note_preimage_operational: {
        encodedProposal: 'Bytes',
      },
      note_imminent_preimage: {
        encodedProposal: 'Bytes',
      },
      note_imminent_preimage_operational: {
        encodedProposal: 'Bytes',
      },
      reap_preimage: {
        proposalHash: 'H256',
        proposalLenUpperBound: 'Compact<u32>',
      },
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
      enact_proposal: {
        proposalHash: 'H256',
        index: 'u32',
      },
      blacklist: {
        proposalHash: 'H256',
        maybeRefIndex: 'Option<u32>',
      },
      cancel_proposal: {
        propIndex: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup328: pallet_democracy::conviction::Conviction
   **/
  PalletDemocracyConviction: {
    _enum: ['None', 'Locked1x', 'Locked2x', 'Locked3x', 'Locked4x', 'Locked5x', 'Locked6x'],
  },
  /**
   * Lookup329: pallet_identity::pallet::Call<T>
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
      quit_sub: 'Null',
    },
  },
  /**
   * Lookup330: pallet_identity::types::IdentityInfo<FieldLimit>
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
    twitter: 'Data',
  },
  /**
   * Lookup366: pallet_identity::types::BitFlags<pallet_identity::types::IdentityField>
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
    Twitter: 128,
  },
  /**
   * Lookup367: pallet_identity::types::IdentityField
   **/
  PalletIdentityIdentityField: {
    _enum: [
      '__Unused0',
      'Display',
      'Legal',
      '__Unused3',
      'Web',
      '__Unused5',
      '__Unused6',
      '__Unused7',
      'Riot',
      '__Unused9',
      '__Unused10',
      '__Unused11',
      '__Unused12',
      '__Unused13',
      '__Unused14',
      '__Unused15',
      'Email',
      '__Unused17',
      '__Unused18',
      '__Unused19',
      '__Unused20',
      '__Unused21',
      '__Unused22',
      '__Unused23',
      '__Unused24',
      '__Unused25',
      '__Unused26',
      '__Unused27',
      '__Unused28',
      '__Unused29',
      '__Unused30',
      '__Unused31',
      'PgpFingerprint',
      '__Unused33',
      '__Unused34',
      '__Unused35',
      '__Unused36',
      '__Unused37',
      '__Unused38',
      '__Unused39',
      '__Unused40',
      '__Unused41',
      '__Unused42',
      '__Unused43',
      '__Unused44',
      '__Unused45',
      '__Unused46',
      '__Unused47',
      '__Unused48',
      '__Unused49',
      '__Unused50',
      '__Unused51',
      '__Unused52',
      '__Unused53',
      '__Unused54',
      '__Unused55',
      '__Unused56',
      '__Unused57',
      '__Unused58',
      '__Unused59',
      '__Unused60',
      '__Unused61',
      '__Unused62',
      '__Unused63',
      'Image',
      '__Unused65',
      '__Unused66',
      '__Unused67',
      '__Unused68',
      '__Unused69',
      '__Unused70',
      '__Unused71',
      '__Unused72',
      '__Unused73',
      '__Unused74',
      '__Unused75',
      '__Unused76',
      '__Unused77',
      '__Unused78',
      '__Unused79',
      '__Unused80',
      '__Unused81',
      '__Unused82',
      '__Unused83',
      '__Unused84',
      '__Unused85',
      '__Unused86',
      '__Unused87',
      '__Unused88',
      '__Unused89',
      '__Unused90',
      '__Unused91',
      '__Unused92',
      '__Unused93',
      '__Unused94',
      '__Unused95',
      '__Unused96',
      '__Unused97',
      '__Unused98',
      '__Unused99',
      '__Unused100',
      '__Unused101',
      '__Unused102',
      '__Unused103',
      '__Unused104',
      '__Unused105',
      '__Unused106',
      '__Unused107',
      '__Unused108',
      '__Unused109',
      '__Unused110',
      '__Unused111',
      '__Unused112',
      '__Unused113',
      '__Unused114',
      '__Unused115',
      '__Unused116',
      '__Unused117',
      '__Unused118',
      '__Unused119',
      '__Unused120',
      '__Unused121',
      '__Unused122',
      '__Unused123',
      '__Unused124',
      '__Unused125',
      '__Unused126',
      '__Unused127',
      'Twitter',
    ],
  },
  /**
   * Lookup368: pallet_identity::types::Judgement<Balance>
   **/
  PalletIdentityJudgement: {
    _enum: {
      Unknown: 'Null',
      FeePaid: 'u128',
      Reasonable: 'Null',
      KnownGood: 'Null',
      OutOfDate: 'Null',
      LowQuality: 'Null',
      Erroneous: 'Null',
    },
  },
  /**
   * Lookup369: pallet_vesting::pallet::Call<T>
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
        schedule2Index: 'u32',
      },
    },
  },
  /**
   * Lookup370: pallet_vesting::vesting_info::VestingInfo<Balance, BlockNumber>
   **/
  PalletVestingVestingInfo: {
    locked: 'u128',
    perBlock: 'u128',
    startingBlock: 'u32',
  },
  /**
   * Lookup371: pallet_treasury::pallet::Call<T, I>
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
        proposalId: 'Compact<u32>',
      },
    },
  },
  /**
   * Lookup372: pallet_uniques::pallet::Call<T, I>
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
        bidPrice: 'u128',
      },
    },
  },
  /**
   * Lookup373: pallet_uniques::types::DestroyWitness
   **/
  PalletUniquesDestroyWitness: {
    items: 'Compact<u32>',
    itemMetadatas: 'Compact<u32>',
    attributes: 'Compact<u32>',
  },
  /**
   * Lookup375: pallet_preimage::pallet::Call<T>
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
        hash_: 'H256',
      },
    },
  },
  /**
   * Lookup376: pallet_fees::pallet::Call<T>
   **/
  PalletFeesCall: {
    _enum: {
      set_fee: {
        key: 'CfgTypesFeeKeysFeeKey',
        fee: 'u128',
      },
    },
  },
  /**
   * Lookup377: pallet_anchors::pallet::Call<T>
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
      evict_anchors: 'Null',
    },
  },
  /**
   * Lookup379: pallet_claims::pallet::Call<T>
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
        rootHash: 'H256',
      },
    },
  },
  /**
   * Lookup380: pallet_crowdloan_claim::pallet::Call<T>
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
        trieIndex: 'u32',
      },
    },
  },
  /**
   * Lookup381: sp_runtime::MultiSignature
   **/
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: 'SpCoreEd25519Signature',
      Sr25519: 'SpCoreSr25519Signature',
      Ecdsa: 'SpCoreEcdsaSignature',
    },
  },
  /**
   * Lookup382: sp_core::ed25519::Signature
   **/
  SpCoreEd25519Signature: '[u8;64]',
  /**
   * Lookup384: sp_core::sr25519::Signature
   **/
  SpCoreSr25519Signature: '[u8;64]',
  /**
   * Lookup385: sp_core::ecdsa::Signature
   **/
  SpCoreEcdsaSignature: '[u8;65]',
  /**
   * Lookup387: proofs::Proof<primitive_types::H256>
   **/
  ProofsProof: {
    leafHash: 'H256',
    sortedHashes: 'Vec<H256>',
  },
  /**
   * Lookup388: pallet_crowdloan_reward::pallet::Call<T>
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
        ratio: 'Perbill',
      },
    },
  },
  /**
   * Lookup389: pallet_pool_system::pallet::Call<T>
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
        solution: 'Vec<CfgTypesTranchesTrancheSolution>',
      },
      execute_epoch: {
        poolId: 'u64',
      },
    },
  },
  /**
   * Lookup390: pallet_loans::pallet::Call<T>
   **/
  PalletLoansCall: {
    _enum: {
      initialise_pool: {
        poolId: 'u64',
        loanNftClassId: 'u64',
      },
      create: {
        poolId: 'u64',
        collateral: 'PalletLoansAsset',
      },
      close: {
        poolId: 'u64',
        loanId: 'u128',
      },
      borrow: {
        poolId: 'u64',
        loanId: 'u128',
        amount: 'u128',
      },
      repay: {
        poolId: 'u64',
        loanId: 'u128',
        amount: 'u128',
      },
      price: {
        poolId: 'u64',
        loanId: 'u128',
        interestRatePerYear: 'u128',
        loanType: 'PalletLoansLoanType',
      },
      update_nav: {
        poolId: 'u64',
      },
      add_write_off_group: {
        poolId: 'u64',
        group: 'PalletLoansWriteOffGroupInput',
      },
      write_off: {
        poolId: 'u64',
        loanId: 'u128',
      },
      admin_write_off: {
        poolId: 'u64',
        loanId: 'u128',
        percentage: 'u128',
        penaltyInterestRatePerYear: 'u128',
      },
    },
  },
  /**
   * Lookup391: pallet_loans::types::WriteOffGroupInput<cfg_types::fixed_point::Rate>
   **/
  PalletLoansWriteOffGroupInput: {
    percentage: 'u128',
    overdueDays: 'u64',
    penaltyInterestRatePerYear: 'u128',
  },
  /**
   * Lookup392: pallet_permissions::pallet::Call<T>
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
        scope: 'CfgTypesPermissionsPermissionScope',
      },
    },
  },
  /**
   * Lookup393: pallet_collator_allowlist::pallet::Call<T>
   **/
  PalletCollatorAllowlistCall: {
    _enum: {
      add: {
        collatorId: 'AccountId32',
      },
      remove: {
        collatorId: 'AccountId32',
      },
    },
  },
  /**
   * Lookup394: pallet_restricted_tokens::pallet::Call<T>
   **/
  PalletRestrictedTokensCall: {
    _enum: {
      transfer: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'Compact<u128>',
      },
      transfer_keep_alive: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'Compact<u128>',
      },
      transfer_all: {
        dest: 'MultiAddress',
        currencyId: 'CfgTypesTokensCurrencyId',
        keepAlive: 'bool',
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
        newReserved: 'Compact<u128>',
      },
    },
  },
  /**
   * Lookup395: pallet_nft_sales::pallet::Call<T>
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
        maxOffer: 'PalletNftSalesPrice',
      },
    },
  },
  /**
   * Lookup396: pallet_bridge::pallet::Call<T>
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
        rId: '[u8;32]',
      },
    },
  },
  /**
   * Lookup397: pallet_nft::pallet::Call<T>
   **/
  PalletNftCall: {
    _enum: {
      validate_mint: {
        anchorId: 'H256',
        depositAddress: '[u8;20]',
        proofs: 'Vec<ProofsProof>',
        staticProofs: '[H256;3]',
        destId: 'u8',
      },
    },
  },
  /**
   * Lookup400: pallet_keystore::pallet::Call<T>
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
        newDeposit: 'u128',
      },
    },
  },
  /**
   * Lookup402: pallet_keystore::AddKey<primitive_types::H256>
   **/
  PalletKeystoreAddKey: {
    key: 'H256',
    purpose: 'PalletKeystoreKeyPurpose',
    keyType: 'PalletKeystoreKeyType',
  },
  /**
   * Lookup403: pallet_investments::pallet::Call<T>
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
        investmentId: 'CfgTypesTokensTrancheCurrency',
      },
    },
  },
  /**
   * Lookup404: pallet_liquidity_rewards::pallet::Call<T>
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
        blocks: 'u32',
      },
      set_group_weight: {
        groupId: 'u32',
        weight: 'u64',
      },
      set_currency_group: {
        currencyId: 'CfgTypesTokensCurrencyId',
        groupId: 'u32',
      },
    },
  },
  /**
   * Lookup405: pallet_connectors::pallet::Call<T>
   **/
  PalletConnectorsCall: {
    _enum: {
      set_domain_router: {
        domain: 'PalletConnectorsDomain',
        router: 'PalletConnectorsRoutersRouter',
      },
      add_pool: {
        poolId: 'u64',
        domain: 'PalletConnectorsDomain',
      },
      add_tranche: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domain: 'PalletConnectorsDomain',
      },
      update_token_price: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        domain: 'PalletConnectorsDomain',
      },
      update_member: {
        address: 'PalletConnectorsDomainAddress',
        poolId: 'u64',
        trancheId: '[u8;16]',
        validUntil: 'u64',
      },
      transfer: {
        poolId: 'u64',
        trancheId: '[u8;16]',
        address: 'PalletConnectorsDomainAddress',
        amount: 'u128',
      },
    },
  },
  /**
   * Lookup406: pallet_connectors::DomainAddress<pallet_connectors::Domain>
   **/
  PalletConnectorsDomainAddress: {
    domain: 'PalletConnectorsDomain',
    address: '[u8;32]',
  },
  /**
   * Lookup407: pallet_pool_registry::pallet::Call<T>
   **/
  PalletPoolRegistryCall: {
    _enum: {
      register: {
        admin: 'AccountId32',
        poolId: 'u64',
        trancheInputs: 'Vec<CfgTypesTranchesTrancheInput>',
        currency: 'CfgTypesTokensCurrencyId',
        maxReserve: 'u128',
        metadata: 'Option<Bytes>',
      },
      update: {
        poolId: 'u64',
        changes: 'CfgTypesPoolsPoolChanges',
      },
      execute_update: {
        poolId: 'u64',
      },
      set_metadata: {
        poolId: 'u64',
        metadata: 'Bytes',
      },
    },
  },
  /**
   * Lookup409: cfg_types::tranches::TrancheInput<cfg_types::fixed_point::Rate, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>
   **/
  CfgTypesTranchesTrancheInput: {
    trancheType: 'CfgTypesTranchesTrancheType',
    seniority: 'Option<u32>',
    metadata: 'CfgTypesTranchesTrancheMetadata',
  },
  /**
   * Lookup410: cfg_types::pools::PoolChanges<cfg_types::fixed_point::Rate, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes, development_runtime::MaxTranches>
   **/
  CfgTypesPoolsPoolChanges: {
    tranches: {
      _enum: {
        NoChange: 'Null',
        NewValue: 'Vec<CfgTypesTranchesTrancheUpdate>',
      },
    },
    trancheMetadata: 'OrmlTraitsChangeBoundedVec',
    minEpochTime: 'OrmlTraitsChangeU64',
    vAge: 'OrmlTraitsChangeU64',
  },
  /**
   * Lookup411: development_runtime::MaxTranches
   **/
  DevelopmentRuntimeMaxTranches: 'Null',
  /**
   * Lookup414: cfg_types::tranches::TrancheUpdate<cfg_types::fixed_point::Rate>
   **/
  CfgTypesTranchesTrancheUpdate: {
    trancheType: 'CfgTypesTranchesTrancheType',
    seniority: 'Option<u32>',
  },
  /**
   * Lookup416: orml_traits::Change<sp_runtime::bounded::bounded_vec::BoundedVec<cfg_types::tranches::TrancheMetadata<cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes>, S>>
   **/
  OrmlTraitsChangeBoundedVec: {
    _enum: {
      NoChange: 'Null',
      NewValue: 'Vec<CfgTypesTranchesTrancheMetadata>',
    },
  },
  /**
   * Lookup419: orml_traits::Change<Value>
   **/
  OrmlTraitsChangeU64: {
    _enum: {
      NoChange: 'Null',
      NewValue: 'u64',
    },
  },
  /**
   * Lookup420: cumulus_pallet_xcmp_queue::pallet::Call<T>
   **/
  CumulusPalletXcmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'Weight',
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
        new_: 'Weight',
      },
      update_weight_restrict_decay: {
        _alias: {
          new_: 'new',
        },
        new_: 'Weight',
      },
      update_xcmp_max_individual_weight: {
        _alias: {
          new_: 'new',
        },
        new_: 'Weight',
      },
    },
  },
  /**
   * Lookup421: pallet_xcm::pallet::Call<T>
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
        maxWeight: 'Weight',
      },
      force_xcm_version: {
        location: 'XcmV1MultiLocation',
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
        weightLimit: 'XcmV2WeightLimit',
      },
      limited_teleport_assets: {
        dest: 'XcmVersionedMultiLocation',
        beneficiary: 'XcmVersionedMultiLocation',
        assets: 'XcmVersionedMultiAssets',
        feeAssetItem: 'u32',
        weightLimit: 'XcmV2WeightLimit',
      },
    },
  },
  /**
   * Lookup422: xcm::VersionedXcm<Call>
   **/
  XcmVersionedXcm: {
    _enum: {
      V0: 'XcmV0Xcm',
      V1: 'XcmV1Xcm',
      V2: 'XcmV2Xcm',
    },
  },
  /**
   * Lookup423: xcm::v0::Xcm<Call>
   **/
  XcmV0Xcm: {
    _enum: {
      WithdrawAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        effects: 'Vec<XcmV0Order>',
      },
      ReserveAssetDeposit: {
        assets: 'Vec<XcmV0MultiAsset>',
        effects: 'Vec<XcmV0Order>',
      },
      TeleportAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        effects: 'Vec<XcmV0Order>',
      },
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV0Response',
      },
      TransferAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        dest: 'XcmV0MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        dest: 'XcmV0MultiLocation',
        effects: 'Vec<XcmV0Order>',
      },
      Transact: {
        originType: 'XcmV0OriginKind',
        requireWeightAtMost: 'u64',
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
      RelayedFrom: {
        who: 'XcmV0MultiLocation',
        message: 'XcmV0Xcm',
      },
    },
  },
  /**
   * Lookup425: xcm::v0::order::Order<Call>
   **/
  XcmV0Order: {
    _enum: {
      Null: 'Null',
      DepositAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        dest: 'XcmV0MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'Vec<XcmV0MultiAsset>',
        dest: 'XcmV0MultiLocation',
        effects: 'Vec<XcmV0Order>',
      },
      ExchangeAsset: {
        give: 'Vec<XcmV0MultiAsset>',
        receive: 'Vec<XcmV0MultiAsset>',
      },
      InitiateReserveWithdraw: {
        assets: 'Vec<XcmV0MultiAsset>',
        reserve: 'XcmV0MultiLocation',
        effects: 'Vec<XcmV0Order>',
      },
      InitiateTeleport: {
        assets: 'Vec<XcmV0MultiAsset>',
        dest: 'XcmV0MultiLocation',
        effects: 'Vec<XcmV0Order>',
      },
      QueryHolding: {
        queryId: 'Compact<u64>',
        dest: 'XcmV0MultiLocation',
        assets: 'Vec<XcmV0MultiAsset>',
      },
      BuyExecution: {
        fees: 'XcmV0MultiAsset',
        weight: 'u64',
        debt: 'u64',
        haltOnError: 'bool',
        xcm: 'Vec<XcmV0Xcm>',
      },
    },
  },
  /**
   * Lookup427: xcm::v0::Response
   **/
  XcmV0Response: {
    _enum: {
      Assets: 'Vec<XcmV0MultiAsset>',
    },
  },
  /**
   * Lookup428: xcm::v1::Xcm<Call>
   **/
  XcmV1Xcm: {
    _enum: {
      WithdrawAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        effects: 'Vec<XcmV1Order>',
      },
      ReserveAssetDeposited: {
        assets: 'XcmV1MultiassetMultiAssets',
        effects: 'Vec<XcmV1Order>',
      },
      ReceiveTeleportedAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        effects: 'Vec<XcmV1Order>',
      },
      QueryResponse: {
        queryId: 'Compact<u64>',
        response: 'XcmV1Response',
      },
      TransferAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        beneficiary: 'XcmV1MultiLocation',
      },
      TransferReserveAsset: {
        assets: 'XcmV1MultiassetMultiAssets',
        dest: 'XcmV1MultiLocation',
        effects: 'Vec<XcmV1Order>',
      },
      Transact: {
        originType: 'XcmV0OriginKind',
        requireWeightAtMost: 'u64',
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
      RelayedFrom: {
        who: 'XcmV1MultilocationJunctions',
        message: 'XcmV1Xcm',
      },
      SubscribeVersion: {
        queryId: 'Compact<u64>',
        maxResponseWeight: 'Compact<u64>',
      },
      UnsubscribeVersion: 'Null',
    },
  },
  /**
   * Lookup430: xcm::v1::order::Order<Call>
   **/
  XcmV1Order: {
    _enum: {
      Noop: 'Null',
      DepositAsset: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        maxAssets: 'u32',
        beneficiary: 'XcmV1MultiLocation',
      },
      DepositReserveAsset: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        maxAssets: 'u32',
        dest: 'XcmV1MultiLocation',
        effects: 'Vec<XcmV1Order>',
      },
      ExchangeAsset: {
        give: 'XcmV1MultiassetMultiAssetFilter',
        receive: 'XcmV1MultiassetMultiAssets',
      },
      InitiateReserveWithdraw: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        reserve: 'XcmV1MultiLocation',
        effects: 'Vec<XcmV1Order>',
      },
      InitiateTeleport: {
        assets: 'XcmV1MultiassetMultiAssetFilter',
        dest: 'XcmV1MultiLocation',
        effects: 'Vec<XcmV1Order>',
      },
      QueryHolding: {
        queryId: 'Compact<u64>',
        dest: 'XcmV1MultiLocation',
        assets: 'XcmV1MultiassetMultiAssetFilter',
      },
      BuyExecution: {
        fees: 'XcmV1MultiAsset',
        weight: 'u64',
        debt: 'u64',
        haltOnError: 'bool',
        instructions: 'Vec<XcmV1Xcm>',
      },
    },
  },
  /**
   * Lookup432: xcm::v1::Response
   **/
  XcmV1Response: {
    _enum: {
      Assets: 'XcmV1MultiassetMultiAssets',
      Version: 'u32',
    },
  },
  /**
   * Lookup446: cumulus_pallet_dmp_queue::pallet::Call<T>
   **/
  CumulusPalletDmpQueueCall: {
    _enum: {
      service_overweight: {
        index: 'u64',
        weightLimit: 'Weight',
      },
    },
  },
  /**
   * Lookup447: orml_xtokens::module::Call<T>
   **/
  OrmlXtokensModuleCall: {
    _enum: {
      transfer: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
      transfer_multiasset: {
        asset: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
      transfer_with_fee: {
        currencyId: 'CfgTypesTokensCurrencyId',
        amount: 'u128',
        fee: 'u128',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
      transfer_multiasset_with_fee: {
        asset: 'XcmVersionedMultiAsset',
        fee: 'XcmVersionedMultiAsset',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
      transfer_multicurrencies: {
        currencies: 'Vec<(CfgTypesTokensCurrencyId,u128)>',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
      transfer_multiassets: {
        assets: 'XcmVersionedMultiAssets',
        feeItem: 'u32',
        dest: 'XcmVersionedMultiLocation',
        destWeight: 'u64',
      },
    },
  },
  /**
   * Lookup448: xcm::VersionedMultiAsset
   **/
  XcmVersionedMultiAsset: {
    _enum: {
      V0: 'XcmV0MultiAsset',
      V1: 'XcmV1MultiAsset',
    },
  },
  /**
   * Lookup451: pallet_xcm_transactor::pallet::Call<T>
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
        originKind: 'XcmV0OriginKind',
        weightInfo: 'PalletXcmTransactorTransactWeights',
      },
      set_transact_info: {
        location: 'XcmVersionedMultiLocation',
        transactExtraWeight: 'u64',
        maxWeight: 'u64',
        transactExtraWeightSigned: 'Option<u64>',
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
    },
  },
  /**
   * Lookup452: development_runtime::NullTransactor
   **/
  DevelopmentRuntimeNullTransactor: 'Null',
  /**
   * Lookup453: pallet_xcm_transactor::pallet::CurrencyPayment<cfg_types::tokens::CurrencyId>
   **/
  PalletXcmTransactorCurrencyPayment: {
    currency: 'PalletXcmTransactorCurrency',
    feeAmount: 'Option<u128>',
  },
  /**
   * Lookup454: pallet_xcm_transactor::pallet::Currency<cfg_types::tokens::CurrencyId>
   **/
  PalletXcmTransactorCurrency: {
    _enum: {
      AsCurrencyId: 'CfgTypesTokensCurrencyId',
      AsMultiLocation: 'XcmVersionedMultiLocation',
    },
  },
  /**
   * Lookup455: pallet_xcm_transactor::pallet::TransactWeights
   **/
  PalletXcmTransactorTransactWeights: {
    transactRequiredWeightAtMost: 'u64',
    overallWeight: 'Option<u64>',
  },
  /**
   * Lookup456: chainbridge::pallet::Call<T>
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
        proposal: 'Call',
      },
    },
  },
  /**
   * Lookup457: orml_asset_registry::module::Call<T>
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
        additional: 'Option<CfgTypesTokensCustomMetadata>',
      },
    },
  },
  /**
   * Lookup461: orml_xcm::module::Call<T>
   **/
  OrmlXcmModuleCall: {
    _enum: {
      send_as_sovereign: {
        dest: 'XcmVersionedMultiLocation',
        message: 'XcmVersionedXcm',
      },
    },
  },
  /**
   * Lookup462: pallet_migration_manager::pallet::Call<T>
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
      finalize: 'Null',
    },
  },
  /**
   * Lookup469: pallet_proxy::ProxyDefinition<sp_core::crypto::AccountId32, development_runtime::ProxyType, BlockNumber>
   **/
  PalletProxyProxyDefinition: {
    delegate: 'AccountId32',
    proxyType: 'DevelopmentRuntimeProxyType',
    delay: 'u32',
  },
  /**
   * Lookup471: pallet_sudo::pallet::Call<T>
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: 'Call',
      },
      sudo_unchecked_weight: {
        call: 'Call',
        weight: 'Weight',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'MultiAddress',
      },
      sudo_as: {
        who: 'MultiAddress',
        call: 'Call',
      },
    },
  },
  /**
   * Lookup472: pallet_multisig::pallet::Error<T>
   **/
  PalletMultisigError: {
    _enum: [
      'MinimumThreshold',
      'AlreadyApproved',
      'NoApprovalsNeeded',
      'TooFewSignatories',
      'TooManySignatories',
      'SignatoriesOutOfOrder',
      'SenderInSignatories',
      'NotFound',
      'NotOwner',
      'NoTimepoint',
      'WrongTimepoint',
      'UnexpectedTimepoint',
      'MaxWeightTooLow',
      'AlreadyStored',
    ],
  },
  /**
   * Lookup475: pallet_proxy::Announcement<sp_core::crypto::AccountId32, primitive_types::H256, BlockNumber>
   **/
  PalletProxyAnnouncement: {
    real: 'AccountId32',
    callHash: 'H256',
    height: 'u32',
  },
  /**
   * Lookup477: pallet_proxy::pallet::Error<T>
   **/
  PalletProxyError: {
    _enum: [
      'TooMany',
      'NotFound',
      'NotProxy',
      'Unproxyable',
      'Duplicate',
      'NoPermission',
      'Unannounced',
      'NoSelfProxy',
    ],
  },
  /**
   * Lookup478: pallet_utility::pallet::Error<T>
   **/
  PalletUtilityError: {
    _enum: ['TooManyCalls'],
  },
  /**
   * Lookup481: pallet_scheduler::ScheduledV3<frame_support::traits::schedule::MaybeHashed<development_runtime::Call, primitive_types::H256>, BlockNumber, development_runtime::OriginCaller, sp_core::crypto::AccountId32>
   **/
  PalletSchedulerScheduledV3: {
    maybeId: 'Option<Bytes>',
    priority: 'u8',
    call: 'FrameSupportScheduleMaybeHashed',
    maybePeriodic: 'Option<(u32,u32)>',
    origin: 'DevelopmentRuntimeOriginCaller',
  },
  /**
   * Lookup482: pallet_scheduler::pallet::Error<T>
   **/
  PalletSchedulerError: {
    _enum: ['FailedToSchedule', 'NotFound', 'TargetBlockNumberInPast', 'RescheduleNoChange'],
  },
  /**
   * Lookup484: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  PalletCollectiveVotes: {
    index: 'u32',
    threshold: 'u32',
    ayes: 'Vec<AccountId32>',
    nays: 'Vec<AccountId32>',
    end: 'u32',
  },
  /**
   * Lookup485: pallet_collective::pallet::Error<T, I>
   **/
  PalletCollectiveError: {
    _enum: [
      'NotMember',
      'DuplicateProposal',
      'ProposalMissing',
      'WrongIndex',
      'DuplicateVote',
      'AlreadyInitialized',
      'TooEarly',
      'TooManyProposals',
      'WrongProposalWeight',
      'WrongProposalLength',
    ],
  },
  /**
   * Lookup487: pallet_elections_phragmen::SeatHolder<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenSeatHolder: {
    who: 'AccountId32',
    stake: 'u128',
    deposit: 'u128',
  },
  /**
   * Lookup488: pallet_elections_phragmen::Voter<sp_core::crypto::AccountId32, Balance>
   **/
  PalletElectionsPhragmenVoter: {
    votes: 'Vec<AccountId32>',
    stake: 'u128',
    deposit: 'u128',
  },
  /**
   * Lookup489: pallet_elections_phragmen::pallet::Error<T>
   **/
  PalletElectionsPhragmenError: {
    _enum: [
      'UnableToVote',
      'NoVotes',
      'TooManyVotes',
      'MaximumVotesExceeded',
      'LowBalance',
      'UnableToPayBond',
      'MustBeVoter',
      'DuplicatedCandidate',
      'TooManyCandidates',
      'MemberSubmit',
      'RunnerUpSubmit',
      'InsufficientCandidateFunds',
      'NotMember',
      'InvalidWitnessData',
      'InvalidVoteCount',
      'InvalidRenouncing',
      'InvalidReplacement',
    ],
  },
  /**
   * Lookup493: pallet_democracy::PreimageStatus<sp_core::crypto::AccountId32, Balance, BlockNumber>
   **/
  PalletDemocracyPreimageStatus: {
    _enum: {
      Missing: 'u32',
      Available: {
        data: 'Bytes',
        provider: 'AccountId32',
        deposit: 'u128',
        since: 'u32',
        expiry: 'Option<u32>',
      },
    },
  },
  /**
   * Lookup494: pallet_democracy::types::ReferendumInfo<BlockNumber, primitive_types::H256, Balance>
   **/
  PalletDemocracyReferendumInfo: {
    _enum: {
      Ongoing: 'PalletDemocracyReferendumStatus',
      Finished: {
        approved: 'bool',
        end: 'u32',
      },
    },
  },
  /**
   * Lookup495: pallet_democracy::types::ReferendumStatus<BlockNumber, primitive_types::H256, Balance>
   **/
  PalletDemocracyReferendumStatus: {
    end: 'u32',
    proposalHash: 'H256',
    threshold: 'PalletDemocracyVoteThreshold',
    delay: 'u32',
    tally: 'PalletDemocracyTally',
  },
  /**
   * Lookup496: pallet_democracy::types::Tally<Balance>
   **/
  PalletDemocracyTally: {
    ayes: 'u128',
    nays: 'u128',
    turnout: 'u128',
  },
  /**
   * Lookup497: pallet_democracy::vote::Voting<Balance, sp_core::crypto::AccountId32, BlockNumber>
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
        prior: 'PalletDemocracyVotePriorLock',
      },
    },
  },
  /**
   * Lookup500: pallet_democracy::types::Delegations<Balance>
   **/
  PalletDemocracyDelegations: {
    votes: 'u128',
    capital: 'u128',
  },
  /**
   * Lookup501: pallet_democracy::vote::PriorLock<BlockNumber, Balance>
   **/
  PalletDemocracyVotePriorLock: '(u32,u128)',
  /**
   * Lookup504: pallet_democracy::Releases
   **/
  PalletDemocracyReleases: {
    _enum: ['V1'],
  },
  /**
   * Lookup505: pallet_democracy::pallet::Error<T>
   **/
  PalletDemocracyError: {
    _enum: [
      'ValueLow',
      'ProposalMissing',
      'AlreadyCanceled',
      'DuplicateProposal',
      'ProposalBlacklisted',
      'NotSimpleMajority',
      'InvalidHash',
      'NoProposal',
      'AlreadyVetoed',
      'DuplicatePreimage',
      'NotImminent',
      'TooEarly',
      'Imminent',
      'PreimageMissing',
      'ReferendumInvalid',
      'PreimageInvalid',
      'NoneWaiting',
      'NotVoter',
      'NoPermission',
      'AlreadyDelegating',
      'InsufficientFunds',
      'NotDelegating',
      'VotesExist',
      'InstantNotAllowed',
      'Nonsense',
      'WrongUpperBound',
      'MaxVotesReached',
      'TooManyProposals',
      'VotingPeriodLow',
    ],
  },
  /**
   * Lookup506: pallet_identity::types::Registration<Balance, MaxJudgements, MaxAdditionalFields>
   **/
  PalletIdentityRegistration: {
    judgements: 'Vec<(u32,PalletIdentityJudgement)>',
    deposit: 'u128',
    info: 'PalletIdentityIdentityInfo',
  },
  /**
   * Lookup514: pallet_identity::types::RegistrarInfo<Balance, sp_core::crypto::AccountId32>
   **/
  PalletIdentityRegistrarInfo: {
    account: 'AccountId32',
    fee: 'u128',
    fields: 'PalletIdentityBitFlags',
  },
  /**
   * Lookup516: pallet_identity::pallet::Error<T>
   **/
  PalletIdentityError: {
    _enum: [
      'TooManySubAccounts',
      'NotFound',
      'NotNamed',
      'EmptyIndex',
      'FeeChanged',
      'NoIdentity',
      'StickyJudgement',
      'JudgementGiven',
      'InvalidJudgement',
      'InvalidIndex',
      'InvalidTarget',
      'TooManyFields',
      'TooManyRegistrars',
      'AlreadyClaimed',
      'NotSub',
      'NotOwned',
    ],
  },
  /**
   * Lookup519: pallet_vesting::Releases
   **/
  PalletVestingReleases: {
    _enum: ['V0', 'V1'],
  },
  /**
   * Lookup520: pallet_vesting::pallet::Error<T>
   **/
  PalletVestingError: {
    _enum: ['NotVesting', 'AtMaxVestingSchedules', 'AmountLow', 'ScheduleIndexOutOfBounds', 'InvalidScheduleParams'],
  },
  /**
   * Lookup521: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   **/
  PalletTreasuryProposal: {
    proposer: 'AccountId32',
    value: 'u128',
    beneficiary: 'AccountId32',
    bond: 'u128',
  },
  /**
   * Lookup524: frame_support::PalletId
   **/
  FrameSupportPalletId: '[u8;8]',
  /**
   * Lookup525: pallet_treasury::pallet::Error<T, I>
   **/
  PalletTreasuryError: {
    _enum: [
      'InsufficientProposersBalance',
      'InvalidIndex',
      'TooManyApprovals',
      'InsufficientPermission',
      'ProposalNotApproved',
    ],
  },
  /**
   * Lookup526: pallet_uniques::types::CollectionDetails<sp_core::crypto::AccountId32, DepositBalance>
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
    isFrozen: 'bool',
  },
  /**
   * Lookup530: pallet_uniques::types::ItemDetails<sp_core::crypto::AccountId32, DepositBalance>
   **/
  PalletUniquesItemDetails: {
    owner: 'AccountId32',
    approved: 'Option<AccountId32>',
    isFrozen: 'bool',
    deposit: 'u128',
  },
  /**
   * Lookup531: pallet_uniques::types::CollectionMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesCollectionMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool',
  },
  /**
   * Lookup532: pallet_uniques::types::ItemMetadata<DepositBalance, StringLimit>
   **/
  PalletUniquesItemMetadata: {
    deposit: 'u128',
    data: 'Bytes',
    isFrozen: 'bool',
  },
  /**
   * Lookup536: pallet_uniques::pallet::Error<T, I>
   **/
  PalletUniquesError: {
    _enum: [
      'NoPermission',
      'UnknownCollection',
      'AlreadyExists',
      'WrongOwner',
      'BadWitness',
      'InUse',
      'Frozen',
      'WrongDelegate',
      'NoDelegate',
      'Unapproved',
      'Unaccepted',
      'Locked',
      'MaxSupplyReached',
      'MaxSupplyAlreadySet',
      'MaxSupplyTooSmall',
      'UnknownItem',
      'NotForSale',
      'BidTooLow',
    ],
  },
  /**
   * Lookup537: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
   **/
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: 'Option<(AccountId32,u128)>',
      Requested: 'u32',
    },
  },
  /**
   * Lookup540: pallet_preimage::pallet::Error<T>
   **/
  PalletPreimageError: {
    _enum: ['TooLarge', 'AlreadyNoted', 'NotAuthorized', 'NotNoted', 'Requested', 'NotRequested'],
  },
  /**
   * Lookup541: pallet_anchors::PreCommitData<primitive_types::H256, sp_core::crypto::AccountId32, BlockNumber, Balance>
   **/
  PalletAnchorsPreCommitData: {
    signingRoot: 'H256',
    identity: 'AccountId32',
    expirationBlock: 'u32',
    deposit: 'u128',
  },
  /**
   * Lookup543: pallet_anchors::pallet::Error<T>
   **/
  PalletAnchorsError: {
    _enum: [
      'AnchorAlreadyExists',
      'AnchorStoreDateInPast',
      'AnchorStoreDateAboveMaxLimit',
      'PreCommitAlreadyExists',
      'NotOwnerOfPreCommit',
      'InvalidPreCommitProof',
      'EvictionDateTooBig',
      'FailedToConvertEpochToDays',
    ],
  },
  /**
   * Lookup544: pallet_claims::pallet::Error<T>
   **/
  PalletClaimsError: {
    _enum: ['InsufficientBalance', 'InvalidProofs', 'MustBeAdmin', 'UnderMinPayout'],
  },
  /**
   * Lookup546: pallet_crowdloan_claim::pallet::Error<T>
   **/
  PalletCrowdloanClaimError: {
    _enum: [
      'PalletAlreadyInitialized',
      'PalletNotInitialized',
      'ClaimAlreadyProcessed',
      'InvalidProofOfContribution',
      'ClaimedAmountIsOutOfBoundaries',
      'MustBeAdministrator',
      'InvalidClaimAmount',
      'InvalidContributorSignature',
      'OngoingLease',
      'OutOfLeasePeriod',
    ],
  },
  /**
   * Lookup547: pallet_crowdloan_reward::pallet::Error<T>
   **/
  PalletCrowdloanRewardError: {
    _enum: ['MustBeAdministrator', 'RewardInsufficient', 'PalletNotInitialized'],
  },
  /**
   * Lookup548: cfg_types::pools::PoolDetails<cfg_types::tokens::CurrencyId, cfg_types::tokens::TrancheCurrency, EpochId, Balance, cfg_types::fixed_point::Rate, development_runtime::MaxSizeMetadata, cfg_primitives::types::TrancheWeight, TrancheId, PoolId>
   **/
  CfgTypesPoolsPoolDetails: {
    currency: 'CfgTypesTokensCurrencyId',
    tranches: 'CfgTypesTranches',
    parameters: 'CfgTypesPoolsPoolParameters',
    metadata: 'Option<Bytes>',
    status: 'CfgTypesPoolsPoolStatus',
    epoch: 'CfgTypesEpochEpochState',
    reserve: 'CfgTypesReservesReserveDetails',
  },
  /**
   * Lookup549: development_runtime::MaxSizeMetadata
   **/
  DevelopmentRuntimeMaxSizeMetadata: 'Null',
  /**
   * Lookup551: cfg_types::tranches::Tranches<Balance, cfg_types::fixed_point::Rate, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency, TrancheId, PoolId>
   **/
  CfgTypesTranches: {
    tranches: 'Vec<CfgTypesTranchesTranche>',
    ids: 'Vec<[u8;16]>',
    salt: '(u64,u64)',
  },
  /**
   * Lookup553: cfg_types::tranches::Tranche<Balance, cfg_types::fixed_point::Rate, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency>
   **/
  CfgTypesTranchesTranche: {
    trancheType: 'CfgTypesTranchesTrancheType',
    seniority: 'u32',
    currency: 'CfgTypesTokensTrancheCurrency',
    debt: 'u128',
    reserve: 'u128',
    loss: 'u128',
    ratio: 'Perquintill',
    lastUpdatedInterest: 'u64',
  },
  /**
   * Lookup556: cfg_types::pools::PoolParameters
   **/
  CfgTypesPoolsPoolParameters: {
    minEpochTime: 'u64',
    maxNavAge: 'u64',
  },
  /**
   * Lookup558: cfg_types::pools::PoolStatus
   **/
  CfgTypesPoolsPoolStatus: {
    _enum: ['Open'],
  },
  /**
   * Lookup559: cfg_types::epoch::EpochState<EpochId>
   **/
  CfgTypesEpochEpochState: {
    current: 'u32',
    lastClosed: 'u64',
    lastExecuted: 'u32',
  },
  /**
   * Lookup560: cfg_types::reserves::ReserveDetails<Balance>
   **/
  CfgTypesReservesReserveDetails: {
    max: 'u128',
    total: 'u128',
    available: 'u128',
  },
  /**
   * Lookup561: cfg_types::epoch::ScheduledUpdateDetails<cfg_types::fixed_point::Rate, cfg_types::consts::pools::MaxTrancheNameLengthBytes, cfg_types::consts::pools::MaxTrancheSymbolLengthBytes, development_runtime::MaxTranches>
   **/
  CfgTypesEpochScheduledUpdateDetails: {
    changes: 'CfgTypesPoolsPoolChanges',
    scheduledTime: 'u64',
  },
  /**
   * Lookup562: pallet_pool_system::solution::EpochExecutionInfo<Balance, cfg_types::fixed_point::Rate, EpochId, cfg_primitives::types::TrancheWeight, BlockNumber, cfg_types::tokens::TrancheCurrency>
   **/
  PalletPoolSystemSolutionEpochExecutionInfo: {
    epoch: 'u32',
    nav: 'u128',
    reserve: 'u128',
    maxReserve: 'u128',
    tranches: 'CfgTypesTranchesEpochExecutionTranches',
    bestSubmission: 'Option<PalletPoolSystemSolutionEpochSolution>',
    challengePeriodEnd: 'Option<u32>',
  },
  /**
   * Lookup563: cfg_types::tranches::EpochExecutionTranches<Balance, cfg_types::fixed_point::Rate, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency>
   **/
  CfgTypesTranchesEpochExecutionTranches: {
    tranches: 'Vec<CfgTypesTranchesEpochExecutionTranche>',
  },
  /**
   * Lookup565: cfg_types::tranches::EpochExecutionTranche<Balance, cfg_types::fixed_point::Rate, cfg_primitives::types::TrancheWeight, cfg_types::tokens::TrancheCurrency>
   **/
  CfgTypesTranchesEpochExecutionTranche: {
    currency: 'CfgTypesTokensTrancheCurrency',
    supply: 'u128',
    price: 'u128',
    invest: 'u128',
    redeem: 'u128',
    minRiskBuffer: 'Perquintill',
    seniority: 'u32',
  },
  /**
   * Lookup567: cfg_types::pools::PoolDepositInfo<sp_core::crypto::AccountId32, Balance>
   **/
  CfgTypesPoolsPoolDepositInfo: {
    depositor: 'AccountId32',
    deposit: 'u128',
  },
  /**
   * Lookup568: pallet_pool_system::pallet::Error<T>
   **/
  PalletPoolSystemError: {
    _enum: [
      'PoolInUse',
      'InvalidJuniorTranche',
      'InvalidTrancheStructure',
      'NoSuchPool',
      'MinEpochTimeHasNotPassed',
      'ChallengeTimeHasNotPassed',
      'InSubmissionPeriod',
      'NAVTooOld',
      'TrancheId',
      'WipedOut',
      'InvalidSolution',
      'NotInSubmissionPeriod',
      'InsufficientCurrency',
      'RiskBufferViolated',
      'NoNAV',
      'EpochNotExecutedYet',
      'CannotAddOrRemoveTranches',
      'InvalidTrancheSeniority',
      'InvalidTrancheUpdate',
      'BadMetadata',
      'MetadataForCurrencyNotFound',
      'TrancheTokenNameTooLong',
      'TrancheSymbolNameTooLong',
      'FailedToRegisterTrancheMetadata',
      'FailedToUpdateTrancheMetadata',
      'InvalidTrancheId',
      'TooManyTranches',
      'NotNewBestSubmission',
      'NoSolutionAvailable',
      'PoolParameterBoundViolated',
      'NoScheduledUpdate',
      'ScheduledTimeHasNotPassed',
      'UpdatePrerequesitesNotFulfilled',
      'InvalidCurrency',
    ],
  },
  /**
   * Lookup569: pallet_loans::types::LoanDetails<pallet_loans::types::Asset<ClassId, cfg_primitives::types::ItemId>, BlockNumber>
   **/
  PalletLoansLoanDetails: {
    collateral: 'PalletLoansAsset',
    status: 'PalletLoansLoanStatus',
  },
  /**
   * Lookup570: pallet_loans::types::LoanStatus<BlockNumber>
   **/
  PalletLoansLoanStatus: {
    _enum: {
      Created: 'Null',
      Active: 'Null',
      Closed: {
        closedAt: 'u32',
      },
    },
  },
  /**
   * Lookup572: pallet_loans::types::PricedLoanDetails<cfg_primitives::types::ItemId, cfg_types::fixed_point::Rate, Balance, NormalizedDebt>
   **/
  PalletLoansPricedLoanDetails: {
    loanId: 'u128',
    loanType: 'PalletLoansLoanType',
    interestRatePerSec: 'u128',
    originationDate: 'Option<u64>',
    normalizedDebt: 'u128',
    totalBorrowed: 'u128',
    totalRepaid: 'u128',
    writeOffStatus: 'PalletLoansWriteOffStatus',
    lastUpdated: 'u64',
  },
  /**
   * Lookup573: pallet_loans::types::WriteOffStatus<cfg_types::fixed_point::Rate>
   **/
  PalletLoansWriteOffStatus: {
    _enum: {
      None: 'Null',
      WrittenOff: {
        writeOffIndex: 'u32',
      },
      WrittenOffByAdmin: {
        percentage: 'u128',
        penaltyInterestRatePerSec: 'u128',
      },
    },
  },
  /**
   * Lookup575: pallet_loans::types::NAVDetails<Balance>
   **/
  PalletLoansNavDetails: {
    latest: 'u128',
    lastUpdated: 'u64',
  },
  /**
   * Lookup577: pallet_loans::types::WriteOffGroup<cfg_types::fixed_point::Rate>
   **/
  PalletLoansWriteOffGroup: {
    percentage: 'u128',
    overdueDays: 'u64',
    penaltyInterestRatePerSec: 'u128',
  },
  /**
   * Lookup579: pallet_loans::pallet::Error<T>
   **/
  PalletLoansError: {
    _enum: [
      'PoolMissing',
      'PoolNotInitialised',
      'PoolAlreadyInitialised',
      'MissingLoan',
      'MaxBorrowAmountExceeded',
      'ValueOverflow',
      'NormalizedDebtOverflow',
      'LoanIsClosed',
      'LoanTypeInvalid',
      'LoanNotActive',
      'RepayTooEarly',
      'NFTOwnerNotFound',
      'NotAssetOwner',
      'NotAValidAsset',
      'NftTokenNonceOverflowed',
      'LoanNotRepaid',
      'LoanMaturityDatePassed',
      'LoanValueInvalid',
      'LoanAccrueFailed',
      'LoanPresentValueFailed',
      'LoanHealthy',
      'WrittenOffByAdmin',
      'NoValidWriteOffGroup',
      'InvalidWriteOffGroupIndex',
      'InvalidWriteOffGroup',
      'TooManyWriteOffGroups',
      'TooManyActiveLoans',
    ],
  },
  /**
   * Lookup581: cfg_types::permissions::PermissionRoles<Now, development_runtime::MinDelay, TrancheId, Moment>
   **/
  CfgTypesPermissionsPermissionRoles: {
    poolAdmin: 'CfgTypesPermissionsPoolAdminRoles',
    currencyAdmin: 'CfgTypesPermissionsCurrencyAdminRoles',
    permissionedAssetHolder: 'CfgTypesPermissionsPermissionedCurrencyHolders',
    trancheInvestor: 'CfgTypesPermissionsTrancheInvestors',
  },
  /**
   * Lookup582: development_runtime::MinDelay
   **/
  DevelopmentRuntimeMinDelay: 'Null',
  /**
   * Lookup583: cfg_types::permissions::PoolAdminRoles
   **/
  CfgTypesPermissionsPoolAdminRoles: {
    bits: 'u32',
  },
  /**
   * Lookup584: cfg_types::permissions::CurrencyAdminRoles
   **/
  CfgTypesPermissionsCurrencyAdminRoles: {
    bits: 'u32',
  },
  /**
   * Lookup585: cfg_types::permissions::PermissionedCurrencyHolders<Now, development_runtime::MinDelay, Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyHolders: {
    info: 'Option<CfgTypesPermissionsPermissionedCurrencyHolderInfo>',
  },
  /**
   * Lookup587: cfg_types::permissions::PermissionedCurrencyHolderInfo<Moment>
   **/
  CfgTypesPermissionsPermissionedCurrencyHolderInfo: {
    permissionedTill: 'u64',
  },
  /**
   * Lookup588: cfg_types::permissions::TrancheInvestors<Now, development_runtime::MinDelay, TrancheId, Moment>
   **/
  CfgTypesPermissionsTrancheInvestors: {
    info: 'Vec<CfgTypesPermissionsTrancheInvestorInfo>',
  },
  /**
   * Lookup590: cfg_types::permissions::TrancheInvestorInfo<TrancheId, Moment>
   **/
  CfgTypesPermissionsTrancheInvestorInfo: {
    trancheId: '[u8;16]',
    permissionedTill: 'u64',
  },
  /**
   * Lookup591: pallet_permissions::pallet::Error<T>
   **/
  PalletPermissionsError: {
    _enum: ['RoleAlreadyGiven', 'RoleNotGiven', 'NoRoles', 'NoEditor', 'WrongParameters', 'TooManyRoles'],
  },
  /**
   * Lookup592: pallet_collator_allowlist::pallet::Error<T>
   **/
  PalletCollatorAllowlistError: {
    _enum: ['CollatorAlreadyAllowed', 'CollatorNotReady', 'CollatorNotPresent'],
  },
  /**
   * Lookup593: pallet_restricted_tokens::pallet::Error<T>
   **/
  PalletRestrictedTokensError: {
    _enum: ['PreConditionsNotMet'],
  },
  /**
   * Lookup594: pallet_nft_sales::pallet::Error<T>
   **/
  PalletNftSalesError: {
    _enum: ['NotFound', 'NotOwner', 'AlreadyForSale', 'NotForSale', 'InvalidOffer'],
  },
  /**
   * Lookup595: pallet_bridge::pallet::Error<T>
   **/
  PalletBridgeError: {
    _enum: ['InvalidTransfer'],
  },
  /**
   * Lookup596: pallet_interest_accrual::RateDetails<cfg_types::fixed_point::Rate>
   **/
  PalletInterestAccrualRateDetails: {
    accumulatedRate: 'u128',
    referenceCount: 'u32',
  },
  /**
   * Lookup597: pallet_interest_accrual::Release
   **/
  PalletInterestAccrualRelease: {
    _enum: ['V0', 'V1', 'V2'],
  },
  /**
   * Lookup598: pallet_interest_accrual::pallet::Error<T>
   **/
  PalletInterestAccrualError: {
    _enum: ['DebtCalculationFailed', 'DebtAdjustmentFailed', 'NoSuchRate', 'NotInPast', 'InvalidRate', 'TooManyRates'],
  },
  /**
   * Lookup599: pallet_nft::pallet::Error<T>
   **/
  PalletNftError: {
    _enum: ['InvalidProofs', 'DocumentNotAnchored'],
  },
  /**
   * Lookup602: pallet_keystore::Key<BlockNumber, Balance>
   **/
  PalletKeystoreKey: {
    purpose: 'PalletKeystoreKeyPurpose',
    keyType: 'PalletKeystoreKeyType',
    revokedAt: 'Option<u32>',
    deposit: 'u128',
  },
  /**
   * Lookup604: pallet_keystore::pallet::Error<T>
   **/
  PalletKeystoreError: {
    _enum: ['NoKeys', 'TooManyKeys', 'KeyAlreadyExists', 'KeyNotFound', 'KeyAlreadyRevoked'],
  },
  /**
   * Lookup606: cfg_types::orders::Order<Balance, OrderId>
   **/
  CfgTypesOrdersOrder: {
    amount: 'u128',
    submittedAt: 'u64',
  },
  /**
   * Lookup608: pallet_investments::pallet::Error<T>
   **/
  PalletInvestmentsError: {
    _enum: [
      'OrderNotCleared',
      'OrderStillActive',
      'UnknownInvestment',
      'CollectRequired',
      'ZeroPricedInvestment',
      'OrderNotInProcessing',
      'OrderInProcessing',
      'NoNewOrder',
      'NoActiveInvestOrder',
      'NoActiveRedeemOrder',
    ],
  },
  /**
   * Lookup611: pallet_rewards::mechanism::base::Currency<Balance, sp_arithmetic::fixed_point::FixedI128, development_runtime::MaxCurrencyMovements>
   **/
  PalletRewardsMechanismBaseCurrency: {
    totalStake: 'u128',
    rptChanges: 'Vec<i128>',
  },
  /**
   * Lookup614: development_runtime::MaxCurrencyMovements
   **/
  DevelopmentRuntimeMaxCurrencyMovements: 'Null',
  /**
   * Lookup617: pallet_rewards::mechanism::base::Group<Balance, sp_arithmetic::fixed_point::FixedI128>
   **/
  PalletRewardsMechanismBaseGroup: {
    totalStake: 'u128',
    rpt: 'i128',
  },
  /**
   * Lookup619: pallet_rewards::mechanism::base::Account<Balance, IBalance>
   **/
  PalletRewardsMechanismBaseAccount: {
    stake: 'u128',
    rewardTally: 'i128',
    lastCurrencyMovement: 'u16',
  },
  /**
   * Lookup620: pallet_rewards::pallet::Error<T, I>
   **/
  PalletRewardsError: {
    _enum: ['CurrencyWithoutGroup', 'CurrencyInSameGroup', 'CurrencyMaxMovementsReached'],
  },
  /**
   * Lookup622: pallet_liquidity_rewards::EpochData<BlockNumber, Balance, GroupId, Weight, development_runtime::MaxGroups>
   **/
  PalletLiquidityRewardsEpochData: {
    duration: 'u32',
    reward: 'u128',
    weights: 'BTreeMap<u32, u64>',
  },
  /**
   * Lookup623: development_runtime::MaxGroups
   **/
  DevelopmentRuntimeMaxGroups: 'Null',
  /**
   * Lookup625: pallet_liquidity_rewards::pallet::Error<T>
   **/
  PalletLiquidityRewardsError: {
    _enum: ['MaxChangesPerEpochReached'],
  },
  /**
   * Lookup626: pallet_connectors::pallet::Error<T>
   **/
  PalletConnectorsError: {
    _enum: [
      'PoolNotFound',
      'TrancheNotFound',
      'TrancheMetadataNotFound',
      'MissingTranchePrice',
      'MissingRouter',
      'InvalidTransferAmount',
      'UnauthorizedTransfer',
      'FailedToBuildEthereumXcmCall',
    ],
  },
  /**
   * Lookup627: pallet_pool_registry::PoolMetadata<development_runtime::MaxSizeMetadata>
   **/
  PalletPoolRegistryPoolMetadata: {
    metadata: 'Bytes',
  },
  /**
   * Lookup628: pallet_pool_registry::PoolRegistrationStatus
   **/
  PalletPoolRegistryPoolRegistrationStatus: {
    _enum: ['Registered', 'Unregistered'],
  },
  /**
   * Lookup629: pallet_pool_registry::pallet::Error<T>
   **/
  PalletPoolRegistryError: {
    _enum: [
      'BadMetadata',
      'PoolAlreadyRegistered',
      'InvalidTrancheUpdate',
      'MetadataForCurrencyNotFound',
      'NoSuchPoolMetadata',
      'TrancheTokenNameTooLong',
      'TrancheSymbolNameTooLong',
    ],
  },
  /**
   * Lookup631: cumulus_pallet_xcmp_queue::InboundChannelDetails
   **/
  CumulusPalletXcmpQueueInboundChannelDetails: {
    sender: 'u32',
    state: 'CumulusPalletXcmpQueueInboundState',
    messageMetadata: 'Vec<(u32,PolkadotParachainPrimitivesXcmpMessageFormat)>',
  },
  /**
   * Lookup632: cumulus_pallet_xcmp_queue::InboundState
   **/
  CumulusPalletXcmpQueueInboundState: {
    _enum: ['Ok', 'Suspended'],
  },
  /**
   * Lookup635: polkadot_parachain::primitives::XcmpMessageFormat
   **/
  PolkadotParachainPrimitivesXcmpMessageFormat: {
    _enum: ['ConcatenatedVersionedXcm', 'ConcatenatedEncodedBlob', 'Signals'],
  },
  /**
   * Lookup638: cumulus_pallet_xcmp_queue::OutboundChannelDetails
   **/
  CumulusPalletXcmpQueueOutboundChannelDetails: {
    recipient: 'u32',
    state: 'CumulusPalletXcmpQueueOutboundState',
    signalsExist: 'bool',
    firstIndex: 'u16',
    lastIndex: 'u16',
  },
  /**
   * Lookup639: cumulus_pallet_xcmp_queue::OutboundState
   **/
  CumulusPalletXcmpQueueOutboundState: {
    _enum: ['Ok', 'Suspended'],
  },
  /**
   * Lookup641: cumulus_pallet_xcmp_queue::QueueConfigData
   **/
  CumulusPalletXcmpQueueQueueConfigData: {
    suspendThreshold: 'u32',
    dropThreshold: 'u32',
    resumeThreshold: 'u32',
    thresholdWeight: 'Weight',
    weightRestrictDecay: 'Weight',
    xcmpMaxIndividualWeight: 'Weight',
  },
  /**
   * Lookup643: cumulus_pallet_xcmp_queue::pallet::Error<T>
   **/
  CumulusPalletXcmpQueueError: {
    _enum: ['FailedToSend', 'BadXcmOrigin', 'BadXcm', 'BadOverweightIndex', 'WeightOverLimit'],
  },
  /**
   * Lookup644: pallet_xcm::pallet::Error<T>
   **/
  PalletXcmError: {
    _enum: [
      'Unreachable',
      'SendFailure',
      'Filtered',
      'UnweighableMessage',
      'DestinationNotInvertible',
      'Empty',
      'CannotReanchor',
      'TooManyAssets',
      'InvalidOrigin',
      'BadVersion',
      'BadLocation',
      'NoSubscription',
      'AlreadySubscribed',
    ],
  },
  /**
   * Lookup645: cumulus_pallet_xcm::pallet::Error<T>
   **/
  CumulusPalletXcmError: 'Null',
  /**
   * Lookup646: cumulus_pallet_dmp_queue::ConfigData
   **/
  CumulusPalletDmpQueueConfigData: {
    maxIndividual: 'Weight',
  },
  /**
   * Lookup647: cumulus_pallet_dmp_queue::PageIndexData
   **/
  CumulusPalletDmpQueuePageIndexData: {
    beginUsed: 'u32',
    endUsed: 'u32',
    overweightCount: 'u64',
  },
  /**
   * Lookup650: cumulus_pallet_dmp_queue::pallet::Error<T>
   **/
  CumulusPalletDmpQueueError: {
    _enum: ['Unknown', 'OverLimit'],
  },
  /**
   * Lookup651: orml_xtokens::module::Error<T>
   **/
  OrmlXtokensModuleError: {
    _enum: [
      'AssetHasNoReserve',
      'NotCrossChainTransfer',
      'InvalidDest',
      'NotCrossChainTransferableCurrency',
      'UnweighableMessage',
      'XcmExecutionFailed',
      'CannotReanchor',
      'InvalidAncestry',
      'InvalidAsset',
      'DestinationNotInvertible',
      'BadVersion',
      'DistinctReserveForAssetAndFee',
      'ZeroFee',
      'ZeroAmount',
      'TooManyAssetsBeingSent',
      'AssetIndexNonExistent',
      'FeeNotEnough',
      'NotSupportedMultiLocation',
      'MinXcmFeeNotDefined',
    ],
  },
  /**
   * Lookup652: pallet_xcm_transactor::pallet::Error<T>
   **/
  PalletXcmTransactorError: {
    _enum: [
      'IndexAlreadyClaimed',
      'UnclaimedIndex',
      'NotOwner',
      'UnweighableMessage',
      'CannotReanchor',
      'AssetHasNoReserve',
      'InvalidDest',
      'NotCrossChainTransfer',
      'AssetIsNotReserveInDestination',
      'DestinationNotInvertible',
      'ErrorSending',
      'DispatchWeightBiggerThanTotalWeight',
      'WeightOverflow',
      'AmountOverflow',
      'TransactorInfoNotSet',
      'NotCrossChainTransferableCurrency',
      'XcmExecuteError',
      'BadVersion',
      'MaxWeightTransactReached',
      'UnableToWithdrawAsset',
      'FeePerSecondNotSet',
      'SignedTransactNotAllowedForDestination',
      'FailedMultiLocationToJunction',
    ],
  },
  /**
   * Lookup655: orml_tokens::BalanceLock<Balance>
   **/
  OrmlTokensBalanceLock: {
    id: '[u8;8]',
    amount: 'u128',
  },
  /**
   * Lookup657: orml_tokens::AccountData<Balance>
   **/
  OrmlTokensAccountData: {
    free: 'u128',
    reserved: 'u128',
    frozen: 'u128',
  },
  /**
   * Lookup659: orml_tokens::ReserveData<ReserveIdentifier, Balance>
   **/
  OrmlTokensReserveData: {
    id: '[u8;8]',
    amount: 'u128',
  },
  /**
   * Lookup661: orml_tokens::module::Error<T>
   **/
  OrmlTokensModuleError: {
    _enum: [
      'BalanceTooLow',
      'AmountIntoBalanceFailed',
      'LiquidityRestrictions',
      'MaxLocksExceeded',
      'KeepAlive',
      'ExistentialDeposit',
      'DeadAccount',
      'TooManyReserves',
    ],
  },
  /**
   * Lookup664: chainbridge::types::ProposalVotes<sp_core::crypto::AccountId32, BlockNumber>
   **/
  ChainbridgeProposalVotes: {
    votesFor: 'Vec<AccountId32>',
    votesAgainst: 'Vec<AccountId32>',
    status: 'ChainbridgeProposalStatus',
    expiry: 'u32',
  },
  /**
   * Lookup665: chainbridge::types::ProposalStatus
   **/
  ChainbridgeProposalStatus: {
    _enum: ['Initiated', 'Approved', 'Rejected'],
  },
  /**
   * Lookup666: chainbridge::pallet::Error<T>
   **/
  ChainbridgeError: {
    _enum: [
      'ThresholdNotSet',
      'InvalidChainId',
      'InvalidThreshold',
      'ChainNotWhitelisted',
      'ChainAlreadyWhitelisted',
      'ResourceDoesNotExist',
      'RelayerAlreadyExists',
      'RelayerInvalid',
      'MustBeRelayer',
      'RelayerAlreadyVoted',
      'ProposalAlreadyExists',
      'ProposalDoesNotExist',
      'ProposalNotComplete',
      'ProposalAlreadyComplete',
      'ProposalExpired',
    ],
  },
  /**
   * Lookup667: orml_asset_registry::module::Error<T>
   **/
  OrmlAssetRegistryModuleError: {
    _enum: ['AssetNotFound', 'BadVersion', 'InvalidAssetId', 'ConflictingLocation', 'ConflictingAssetId'],
  },
  /**
   * Lookup668: orml_xcm::module::Error<T>
   **/
  OrmlXcmModuleError: {
    _enum: ['Unreachable', 'SendFailure', 'BadVersion'],
  },
  /**
   * Lookup669: pallet_migration_manager::MigrationStatus
   **/
  PalletMigrationManagerMigrationStatus: {
    _enum: ['Inactive', 'Ongoing', 'Complete'],
  },
  /**
   * Lookup670: pallet_migration_manager::pallet::Error<T>
   **/
  PalletMigrationManagerError: {
    _enum: ['TooManyAccounts', 'TooManyVestings', 'TooManyProxies', 'MigrationAlreadyCompleted', 'OnlyFinalizeOngoing'],
  },
  /**
   * Lookup671: pallet_sudo::pallet::Error<T>
   **/
  PalletSudoError: {
    _enum: ['RequireSudo'],
  },
  /**
   * Lookup674: frame_system::extensions::check_non_zero_sender::CheckNonZeroSender<T>
   **/
  FrameSystemExtensionsCheckNonZeroSender: 'Null',
  /**
   * Lookup675: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   **/
  FrameSystemExtensionsCheckSpecVersion: 'Null',
  /**
   * Lookup676: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   **/
  FrameSystemExtensionsCheckTxVersion: 'Null',
  /**
   * Lookup677: frame_system::extensions::check_genesis::CheckGenesis<T>
   **/
  FrameSystemExtensionsCheckGenesis: 'Null',
  /**
   * Lookup680: frame_system::extensions::check_nonce::CheckNonce<T>
   **/
  FrameSystemExtensionsCheckNonce: 'Compact<u32>',
  /**
   * Lookup681: frame_system::extensions::check_weight::CheckWeight<T>
   **/
  FrameSystemExtensionsCheckWeight: 'Null',
  /**
   * Lookup682: pallet_transaction_payment::ChargeTransactionPayment<T>
   **/
  PalletTransactionPaymentChargeTransactionPayment: 'Compact<u128>',
  /**
   * Lookup683: development_runtime::Runtime
   **/
  DevelopmentRuntimeRuntime: 'Null',
}
