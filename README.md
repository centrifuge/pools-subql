# Centrifuge Subquery

[![SubQuery](https://img.shields.io/static/v1?label=built+with&message=SubQuery&color=FF4581)](https://subquery.network/)

<!-- [![Docker](https://img.shields.io/static/v1?label=shipped+with&message=Docker&color=287cf9)](https://www.docker.com/) -->

A GraphQL API to query the Centrifuge Parachain on Polkadot.

## :seedling: Staging

Use GraphQL query endpoint at [https://api.subquery.network/sq/embrio-tech/centrifuge-subql](https://explorer.subquery.network/subquery/embrio-tech/centrifuge-subql) or try the API with the [SubQuery Playground](https://explorer.subquery.network/subquery/embrio-tech/centrifuge-subql).

## :construction_worker_man: Development

### Environment

- [Typescript](https://www.typescriptlang.org/) are required to compile project and define types.
- Both SubQuery CLI and generated Project have dependencies and require [Node](https://nodejs.org/en/).
  - node: version specified in [`.nvmrc`](/.nvmrc)
- [Yarn](https://classic.yarnpkg.com/en/)


### Code generation

To generate the entities based on `schema.graphql`, run:

```
yarn codegen
```

### Run locally

To build and run the subquery locally in Docker, run:

```
yarn build && docker-compose pull && docker-compose up
```

### Access

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that are ready to query.

### Linter

#### Automatic Linting

Staged code is linted automatically with a `pre-commit` hook.

#### Manual Linting

You can run the linter with

    yarn lint

To fix fixable lint errors use

    yarn lint:fix

### Commit

This repository uses commitlint to enforce commit message conventions. You have to specify the type of the commit in your commit message. Use one of the [supported types](https://github.com/pvdlg/conventional-changelog-metahub).

    git commit -m "[type]: foo bar"

## Data Model

!!! Data fields ending with an underscore `_` are automatically reset at the end of a period and bust be of type `BigInt`!!!

```mermaid
erDiagram
    Timekeeper {
        string id PK
        date lastPeriodStart
    }

    Pool ||--|| PoolState: ""
    Pool {
        String id PK
        String type "idx"

        Date timestamp
        Int blockNumber

        String currency
        String metadata

        Int minEpochTime
        Int maxNavAge

        Int currentEpoch
        Int lastEpochClosed
        Int lastEpochExecuted

        String stateId FK
    }

    PoolState ||..|| PoolSnapshot: "onNewPeriod"
    PoolState{
        String id PK
        String type "idx"

        BigInt netAssetValue
        BigInt totalReserve
        BigInt availableReserve
        BigInt maxReserve
        BigInt totalDebt

        BigInt totalBorrowed_
        BigInt totalRepaid_
        BigInt totalInvested_
        BigInt totalRedeemed_
        BigInt totalNumberOfLoans_

        BigInt totalEverBorrowed
        BigInt totalEverNumberOfLoans
    }

    PoolSnapshot }o--|| Pool: ""
    PoolSnapshot {
        String id PK
        String poolId FK

        Date timestamp
        Int blockNumber

        BigInt netAssetValue
        BigInt totalReserve
        BigInt availableReserve
        BigInt maxReserve
        BigInt totalDebt

        BigInt totalBorrowed
        BigInt totalRepaid
        BigInt totalInvested
        BigInt totalRedeemed

        BigInt totalBorrowed_
        BigInt totalRepaid_
        BigInt totalInvested_
        BigInt totalRedeemed_
        BigInt totalNumberOfLoans_

        BigInt totalEverBorrowed
        BigInt totalEverNumberOfLoans
    }

    Tranche }o--|| Pool: ""
    Tranche ||--|| TrancheState: ""
    Tranche {
        String id PK
        String type "idx"
        String poolId FK
        String trancheId

        Bool isResidual
        Int seniority
        BigInt interestRatePerSec
        BigInt minRiskBuffer

        String state FK
    }

    TrancheState ||..|| TrancheSnapshot: "onNewPeriod"
    TrancheState {
        String id PK
        String type "idx"

        BigInt supply
        Float price

        BigInt outstandingInvestOrders
        BigInt outstandingRedeemOrders

        BigInt yield30Days
        BigInt yield90Days
        BigInt yieldSinceInception
    }

    TrancheSnapshot }o--|| Tranche: ""
    TrancheSnapshot {
        String id PK
        String trancheId FK

        Date timestamp
        Int blockNumber

        BigInt supply
        Float price

        BigInt outstandingInvestOrders
        BigInt outstandingRedeemOrders

        BigInt yield30Days
        BigInt yield90Days
        BigInt yieldSinceInception
    }

    Epoch }|--|| Pool: ""
    Epoch {
        String id PK
        String poolId FK

        Int index

        Date openedAt
        Date closedAt
        Date executedAt

        BigInt totalBorrowed
        BigInt totalRepaid
        BigInt totalInvested
        BigInt totalRedeemed
    }

    InvestorTransaction }o--|| Account: ""
    InvestorTransaction ||--|| Pool: ""
    InvestorTransaction ||--|| Tranche: ""
    InvestorTransaction ||--|| Epoch: ""
    InvestorTransaction {}


    BorrowerTransaction }o--|| Account: ""
    BorrowerTransaction ||--|| Epoch: ""
    BorrowerTransaction ||--|| Loan: ""
    BorrowerTransaction {}


    OutstandingOrder }o--|| Account: ""
    OutstandingOrder ||--|| Pool: ""
    OutstandingOrder ||--|| Tranche: ""
    OutstandingOrder ||--|| Epoch: ""
    OutstandingOrder {}

    Account {}
    AccountBalance {}
    Loan {}
    Proxy {}
    AnonymousProxy {}
```
