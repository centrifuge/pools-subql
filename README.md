# Centrifuge Subquery

[![SubQuery](https://img.shields.io/static/v1?label=built+with&message=SubQuery&color=FF4581)](https://subquery.network/)

<!-- [![Docker](https://img.shields.io/static/v1?label=shipped+with&message=Docker&color=287cf9)](https://www.docker.com/) -->

A GraphQL API to query the Centrifuge Parachain on Polkadot.

## :seedling: Staging

[![Pipeline](https://github.com/embrio-tech/centrifuge-subql/actions/workflows/deploy.yml/badge.svg)](https://github.com/embrio-tech/centrifuge-subql/actions/workflows/deploy.yml)

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

## :file_cabinet: Data Model

!!! Data fields ending with an underscore `_` are automatically reset at the end of a period and bust be of type `BigInt`!!!

```mermaid
erDiagram
    Account ||--o{ TrancheBalance: ""
    Account ||--o{ CurrencyBalance: ""

    Loan ||--|| LoanState: ""
    Loan ||--o{ LoanSnapshot: ""
    LoanState ||..|| LoanSnapshot: "onNewPeriod"

    Pool ||--|| PoolState: ""
    Pool ||--o{ PoolSnapshot: ""
    PoolState ||..|| PoolSnapshot: "onNewPeriod"

    Tranche }o--|| Pool: ""
    Tranche ||--|| TrancheState: ""
    Tranche ||--o{ TrancheSnapshot: ""
    TrancheState ||..|| TrancheSnapshot: "onNewPeriod"

    Epoch }|--|| Pool: ""
    Epoch }o--|| EpochState: ""
    EpochState ||--|| Tranche: ""

    InvestorTransaction }o--|| Account: ""
    InvestorTransaction ||--|| Pool: ""
    InvestorTransaction ||--|| Tranche: ""
    InvestorTransaction ||--|| Epoch: ""

    OutstandingOrder }o--|| Account: ""
    OutstandingOrder ||--|| Pool: ""
    OutstandingOrder ||--|| Tranche: ""
    OutstandingOrder ||--|| Epoch: ""

    BorrowerTransaction }o--|| Account: ""
    BorrowerTransaction ||--|| Epoch: ""
    BorrowerTransaction ||--|| Loan: ""

    Currency ||--|{ Pool: ""
```
