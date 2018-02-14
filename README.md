<p align="left">
  <a href="https://github.com/yggdrasilts" target="blank">
      <img src="http://www.shibamiandme.com/images/full_logo.png" />
  </a>
</p>

Create applications easy to scale and full-featured.

Yggdrasil architecture makes easy to create javascript backend applications. Using [TypeScript](https://www.typescriptlang.org/) features, it makes easy to scale and maintain them as well.

## Prerequisites

* Install [NodeJS](https://nodejs.org/en/) (_Yggdrasil recommends to use [nvm](https://github.com/creationix/nvm)_)
* Install [yarn](https://yarnpkg.com) (_Yggdrasil recommends to use yarn to build its applications_)

## Getting Started

To start to use yggdrasil architecture, you could use the starter project:

```bash
git clone https://github.com/yggdrasilts/yggdrasil-starter.git [PROJECT_NAME]
cd [PROJECT_NAME]
yarn install
yarn start
```

The default access is in **[http://localhost:3000](http://localhost:3000)**.

## Built With

Yggdrasil uses the following frameworks/tools to be developed.

* [NodeJS](https://nodejs.org/en/) - A JavaScript runtime built on [Chrome's V8 JavaScript engine](https://developers.google.com/v8/).
* [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript.
* [Expressjs](http://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
* [yarn](https://yarnpkg.com) - Fast, reliable and secure dependency management.
* [npm](https://www.npmjs.com/) - The package manager for JavaScript and the world’s largest software registry.
* [Lerna](https://lernajs.io/) - A tool for managing JavaScript projects with multiple packages.
* [TSLint](https://palantir.github.io/tslint/) - An extensible linter for the [TypeScript](https://www.typescriptlang.org/) language.
* [Mocha](https://mochajs.org/) - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun
* [Istanbul](https://istanbul.js.org/) - JavaScript test coverage made simple.
* [Gulp](https://gulpjs.com/) - Gulp is a toolkit for automating painful or time-consuming tasks in your development workflow, so you can stop messing around and build something.

## Yggdrasil modules

Yggdrasil is divided in the following modules to give all its functionalities:

* **[@yggdrasilts/core](lib/core)**: Core module provides common and basic functionality that allows an yggdrasil application runs.
* **[@yggdrasilts/mvc](lib/mvc)**: MVC module provides basic mvc functionalities.
* **[@yggdrasilts/security](lib/security)**: Security module provides all the security functionalities that all kind of application needs.
* **[@yggdrasilts/data](lib/data)**: Data module is powered by [typeorm](http://typeorm.io/), a powerful [TypeScript](https://www.typescriptlang.org/) [ORM](https://en.wikipedia.org/wiki/Object-relational_mapping), and provides all the functionalities to connect and use a variety of databases.
* **[@yggdrasilts/testing](lib/testing)**: Testing modules provides functionalities to have all yggdrasil application well tested.
* **[@yggdrasilts/devs](lib/devs)**: Devs modules is a modules only thought for development purpose and contains all the necessary to develop any yggdrasil application.

## Author / Contributors

* **[telco2011](https://github.com/telco2011)** - Telecom engineer, developer enthusiastic 👾, inline skates lover, biker 🏍, coffee lover and barista initiated ☕️.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
