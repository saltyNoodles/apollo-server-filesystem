# Apollo Server Filesystem Example

This is an example project using Apollo Server to query and store data on the filesystem.

## Getting Started

### Running the local filesystem example

In your terminal run the following commands:

1. `git clone https://github.com/saltyNoodles/apollo-server-filesystem.git` to clone the project on your machine
2. `cd apollo-server-filesystem` to move into the project directory
3. `yarn` or `npm install` to install all dependencies
4. `yarn start` or `npm run start` to start the development server

### Running the Dropbox example

1. `git clone https://github.com/saltyNoodles/apollo-server-filesystem.git` to clone the project on your machine
2. `cd apollo-server-filesystem` to move into the project directory
3. `yarn` or `npm install` to install all dependencies
4. Create a new file in the root called `.env` with and paste in the following:

   ```
   DROPBOX_ACCESS_TOKEN = YOUR_ACCESS_TOKEN_HERE
   DROPBOX_CONTENT_DIRECTORY = 'graphql-filesystem-example'
   ```

   **Be sure to replace `YOUR_ACCESS_TOKEN_HERE` with your actual Dropbox access token**

5. `yarn start --dropbox` or `npm run start --dropbox` to start the development server

### Prerequisites

To run the project locally, you need a few things already installed on your machine.

- [Node JS](https://nodejs.org)  
  Since the app is _written_ in Node, you do need to have Node installed on your machine to run it.
- [NPM](https://www.npmjs.com) or [Yarn](https://yarnpkg.com)  
  The project uses Yarn as the package manager, but NPM will technically still work with it just fine.

## Built With

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Node](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [Typescript](https://www.typescriptlang.org)
- [GraphQL](https://graphql.org)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
