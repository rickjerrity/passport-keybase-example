# passport-keybase Express Example

This is an example of how to use the [passport-keybase](https://github.com/rickjerrity/passport-keybase) [Passport](http://www.passportjs.com/) strategy inside of an [Express](https://expressjs.com) server.

## Installation

First clone this repo. Then run the following command:

`npm install`

## Configuration

The `keybase-id` package that this server depends on requires a Keybase client executable to be installed, which will then need to be configured as the `keybasePath` option when initializing the `KeybaseId` client. More information can be found inside the [Keybase ID](https://github.com/rickjerrity/keybase-id) repo README.

Next, you will need to replace the `twitterApiKey` and `twitterApiSecret` option values with your own Twitter API Key and Secret if you have them, or remove these options entirely if you don't.

## Running

After installing and configuring the server, it is time to run it by executing the following command:

`npm start`

The server should now be listening on port 3000 if everything went well. Load up [https://localhost:3000/](https://localhost:3000/) in your browser, and follow the instructions for authenticating using Keybase ID!
