<p align="center">
  <h1 align="center">Serverless PDF</h1>
  <p align="center">
    A simple serverless PDF generation API with Azure functions in Typescript.
  </p>
</p>

<p align="center">
  <a href="https://sonarcloud.io/summary/overall?id=Serverless-PDF">
    <img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=alert_status"
      alt="Quality gate status"
    />
  </a>
  <a
    href="https://sonarcloud.io/component_measures?id=Serverless-PDF&metric=reliability_rating&view=list"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=reliability_rating"
      alt="Reliability rating"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=VULNERABILITY&id=Serverless-PDF"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=vulnerabilities"
      alt="Vulnerabilities"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=BUG&id=Serverless-PDF"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=bugs"
      alt="Bugs"
  /></a>
  <a
    href="https://sonarcloud.io/project/issues?resolved=false&types=CODE_SMELL&id=Serverless-PDF"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=code_smells"
      alt="Code smells"
  /></a>
  <a
    href="https://sonarcloud.io/component_measures?id=Serverless-PDF&metric=coverage&view=list"
    ><img
      src="https://sonarcloud.io/api/project_badges/measure?project=Serverless-PDF&metric=coverage"
      alt="Coverage"
  /></a>
</p>

<p align="center">
  <a
    href="https://github.com/GuilhermeMGBR/ServerlessPdf/actions/workflows/sonarcloud-coverage.yml?query=branch%3Amain"
  >
    <img
      src="https://github.com/GuilhermeMGBR/ServerlessPdf/actions/workflows/sonarcloud-coverage.yml/badge.svg?event=push&branch=main"
      alt="SonarCloud CI status"
    />
  </a>
  <a
    href="https://github.com/GuilhermeMGBR/ServerlessPdf/actions/workflows/deploy.yml?query=branch%3Amain"
  >
    <img
      src="https://github.com/GuilhermeMGBR/ServerlessPdf/actions/workflows/deploy.yml/badge.svg?event=push&branch=main"
      alt="Deploy CI status"
    />
  </a>
  <a  href="https://github.com/GuilhermeMGBR?tab=overview">
    <img
      src="https://img.shields.io/badge/created%20by-@guilhermemgbr-4BBAAB.svg"
      alt="Created by Guilherme Garcia"
    />
  </a>
  <a href="https://github.com/GuilhermeMGBR/ServerlessPdf" rel="nofollow">
    <img
      src="https://img.shields.io/github/package-json/v/GuilhermeMGBR/ServerlessPdf?filename=src/package.json&color=red"
      alt="Version"
    />
  </a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"
    ><img
      src="https://img.shields.io/github/license/GuilhermeMGBR/ServerlessPdf"
      alt="License"
  /></a>
</p>

## Index

- [About the application](#about-the-application)
  - [Technologies](#technologies)
  - [Tools](#tools)
- [Getting started](#getting-started)
- [Development](#development)
- [License](#license)

## About the application

A simple serverless PDF generation API with Azure functions in Typescript.

- The endpoints are also stateless and can scale as far as your wallet allows.
- The endpoint behaviors (located within a service) can be utilized and deployed using a conventional Node.js server.

### Technologies

- [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview) as serverless infrastructure
- [Node.js](https://nodejs.org) as cross-platform JavaScript runtime environment
- [Typescript](http://typescriptlang.org) as a strongly typed programming language
- [Zod](https://github.com/colinhacks/zod) for type schema validation

### Tools

- [Yarn](https://yarnpkg.com) as package manager
- [Babel](https://babeljs.io) for high performance javascript compilation
- [Prettier](https://prettier.io) for code formatting and better commits/diffs
- [Jest](https://jestjs.io) for testing
- [Sonar](https://www.sonarsource.com) for code analysis
- [Husky](https://typicode.github.io/husky/) for git hooks
- [Docker](https://www.docker.com) for local testing and simulation

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Getting started

<details><summary>Environment configuration</summary>

#### Create a `local.settings.json` file inside the `./src` folder.

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development"
  }
}
```

#### To run and debug functions locally, install [azure-functions-core-tools](https://github.com/Azure/azure-functions-core-tools) on your machine

Installation with yarn:

```bash
yarn global add azure-functions-core-tools
```

=> The 'devcontainer' comes with this preinstalled

<details><summary>[macOS only] Install Chromium</summary>

Install chromium with [Homebrew](https://brew.sh)

```bash
brew install chromium
```
=> It will install Chromium on your Application folder while creating a link to `/usr/local/bin/chromium`
</details>

</details>

<details><summary>Dependencies</summary>

- Open the terminal inside the `src` folder
- Install dependencies with [yarn](https://yarnpkg.com)

```bash
yarn
```

</details>

<details><summary>Recommended VS Code extensions:</summary>

- [SonarLint](https://marketplace.visualstudio.com/items?itemName=sonarsource.sonarlint-vscode) - Code linting
- [ES Lint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript linting
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) - Prettier and human-readable TypeScript errors
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) - Highlighting of errors and other language diagnostics
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) - Git extensions
- [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) - Official Azure Functions extension
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) - Spell checker
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Lightweight HTTP request client

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## Development

<details><summary>Running locally</summary>

### Build and run the App:

This will install the required dependencies, build and start!

```bash
yarn start
OR
yarn s
```

- To start without installing dependencies or re-building the app:

```bash
yarn start:only
OR
yarn so
```

=> Remember to follow the environment configuration from the [Getting started](#getting-started) before running the app!

</details>

<details><summary>Manual build</summary>

### Run the build command:

This will install the dependencies and run a build

```bash
yarn build
OR
yarn b
```

- To run a build without installing dependencies:

```bash
yarn build:only
OR
yarn bo
```

- The build can re-run after each file save in watch mode

```bash
yarn watch:build
OR
yarn wb
```

</details>

<details><summary>Linting</summary>

### Run the lint command:

```bash
yarn lint
OR
yarn l
```

</details>

<details><summary>Formatting</summary>

### Run the format command:

This will automatically fix errors where possible

```bash
yarn format
OR
yarn f
```

- To check formatting errors without making changes to files:

```bash
yarn format-check
OR
yarn fc
```

</details>

<details><summary>Type check</summary>

Make sure to have installed dependencies from the initial setup

### Run type check:

```bash
yarn type-check
OR
yarn tc
```

- The type check can re-run after each file save in watch mode

```bash
yarn watch:type-check
OR
yarn wtc
```

</details>

<details><summary>Testing</summary>

Make sure to have installed dependencies from the initial setup

<details><summary>Run tests, skipping integration tests</summary>

```bash
yarn test
OR
yarn t
```

- The test can re-run after each file save in watch mode

```bash
yarn watch:test
OR
yarn wt
```
</details>

<details><summary>Run all tests (including integration tests)</summary>

```bash
yarn test:all
OR
yarn ta
```

- The test can re-run after each file save in watch mode

```bash
yarn watch:test:all
OR
yarn wta
```
</details>

</details>

<details><summary>Sonar analysis</summary>

To run an analysis locally with SonarQube and Docker:

### Start a local SonarQube instance:

```bash
yarn sonar-server:start
OR
yarn ss
```

<details><summary>[Optional] Persist analysis results</summary>

To persist the analysis results when running a local server of SonarQube:

### Create a `.env.sonar-server.local` file at this repository's root folder (same folder as the Readme)

```sh
SONAR_JDBC_URL={{YOUR_URL}} # sample: jdbc:postgresql://hostname.com/db_name
SONAR_JDBC_USERNAME={{YOUR_USERNAME}}
SONAR_JDBC_PASSWORD={{YOUR_PASSWORD}}
```

Replace placeholders with the connection values to your PostgreSQL instance:

- `{{YOUR_URL}}`
- `{{YOUR_USERNAME}}`
- `{{YOUR_PASSWORD}}`

> It is possible to run an instance of PostgreSQL inside another docker container!

### Start a local SonarQube instance with persistence:

```bash
yarn sonar-server:start-persistent
OR
yarn ssp
```

</details>

### Sonar Scanner configuration

Set environment variables with sonar server connection details:

- SVRLSSPDF_SONARQUBE_LOCAL_HOSTURL
- SVRLSSPDF_SONARQUBE_LOCAL_LOGIN

> They can be set inline, before the run command:
>
> ```bash
> SVRLSSPDF_SONARQUBE_LOCAL_HOSTURL=https://your.local.url; SVRLSSPDF_SONARQUBE_LOCAL_LOGIN=sqp_yourTokenXYZ; yarn sonar
> ```

### Run Sonar Scanner

```bash
yarn sonar
OR
yarn sn
```

</details>

<details><summary>Pre-commit hook</summary>

> The `pre-commit` hook should run automatically before every commit through `Husky`.

To manually run all pre-commit checks:

```bash
yarn pre-commit
OR
yarn pc
```

This hook does type checking, linting, format checking and runs all tests, stopping and showing errors from the first one to fail, if any.

</details>

<details><summary>[optional] Source .secrets to local environment</summary>

> The secrets will be sourced from a `.secrets` file at this repository's root folder (same folder as the Readme)

To source local environment secrets on terminal open, add this to your `.bashrc` or `.zshrc`:

```sh
#
# Allow parent to initialize shell
#
if [[ -n $ZSH_INIT_COMMAND_SVRLSSPDF ]]; then
  echo "Running: $ZSH_INIT_COMMAND_SVRLSSPDF"
  eval "$ZSH_INIT_COMMAND_SVRLSSPDF"
fi
```

This will trigger a [dev-environment-init.sh](./.vscode/dev-environment-init.sh) run when using `Visual Studio Code` on `macOS`.

</details>

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

## License

This project is licensed under the **MIT license**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.

<sup><a href="#index" title="Return to index">&UpArrowBar;</a></sup>

<p align="right">
<a href="https://sonarcloud.io/summary/new_code?id=Serverless-PDF"><img src=
"https://sonarcloud.io/images/project_badges/sonarcloud-black.svg"
alt="SonarCloud" /></a>
</p>
