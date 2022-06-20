# Challenge #1

# Challenge #2

The **Log Persistence & Analysing Service (LPAS)** can handle both gRPC and REST API using unified method naming, arguments and results. Therefore API is described only once.

## Preparation

To build production-ready Docker container use the next command:
```shell
docker build -f docker/Dockerfile .
```

Also there is need to provide required environment variables before running the container. See <code>[.env.example](.env.example)</code>

## Running

### Locally

First install needed deps:
```
yarn install
```
Create `.env` file according to <code>[.env.example](.env.example)</code>

Now you're able to start the service with
```
yarn start
```

### In the cloud

It's **strongly recommended** to use Docker to build production-ready container (see [Preparation](#preparation) section).  
P.S. There is no additional parameters you can specify. Just run the container as-is.

If you want to use native node installation on the cloud, you'll need at least Node 18.  
First get yourself the repo, install dependencies and run
```
yarn build
```
You will see a directory named `dist`. Copy all the files from it to your server. Now `cd` to the directory with copied files on the server, setup required environment variables (see [Preparation](#preparation) section) and run
```
node index
```
Bear in mind that production-ready version does not include `dotenv` module so it will not be able to read variables from `.env` file

## Testing

Testing isn't done each time container builds to prevent testing duplication while building multi-platform container.  

### Running tests

Before you will be able to run tests locally or on the CI platform, please make sure you've provided at least `MONGO_CONNECTION_URL` env parameter. It's strongly recommended to use separated DB for tests to make sure all your production data is safe.  
To run tests invoke `test` script:
```
yarn test
```
