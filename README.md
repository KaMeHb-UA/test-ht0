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

## API

There is the same API on both gRPC and REST API endpoints so you can use any endpoint and protocol you prefer. It's recommended to use gRPC where it's possible due to speed & transfer size efficiency.  

You can find machine-readable API references for REST API in <code>[test-ht0.postman_collection.json](test-ht0.postman_collection.json) (Postman collection)</code> and for gRPC — in <code>[src/grpc.proto](src/grpc.proto)</code> (Protocol Buffers definition).

### Human-readable APIs description

#### log
Saves log entry in the DB.  
<code>**Request**</code>
```json
{
    "Timestamp": "datetime string (ex. ISO 8601)",
    "Category": "string",
    "Origin": "string",
    "Message": "string"
}
```
<code>**Response**</code>
```typescript
{}
```

#### analyze
Analyzes logs in the DB. Each type of the request defines its own rest parameters. Available types: `count`.
##### count
Counts logs in the DB filtering them using patterns for each field. To count all the logs, simply don't specify any pattern.  
Each pattern is an array of 1 or 2 string elements. The first one is a regexp for filtering, and the second one specifies a list of flags if provided.  
Example:  
<code>**Request**</code>
```json
{
    "patterns": {
        "Category": ["category name", "i"],
    },
    "type": "count"
}
```
<code>**Response**</code>
```typescript
{
    "count": int64
}
```

## Motivation of using modules, patterns, etc.

### Modules

#### esbuild
Extremely fast JS bundler written in Go with easy-understandable API.

#### @grpc/grpc-js
JS implementation of gRPC. Should be used instead of `grpc` module in all the new projects due to few reasons: deprecation of `grpc`, irrequirement of native build tools, standard way of bundling.

#### @grpc/proto-loader
Standard and recommended module to load `.proto` definitions. Does not require native build.

#### mongodb
Standard and recommended driver for MongoDB. Does not require native build.

#### dotenv
Just a helper for loading environment variables from `.env` file. Used only in non-production builds.

### Patterns

#### Dynamic registering and loading components
Used for:
- Metrics. We can measure loading time of each component in runtime
- Tests. We can replace real components with stub ones to test each component in isolated env or test how components interpolate with each other (unit and integration tests accordingly)

#### Multi-stage docker builds
Used to reduce production image size by saving only really required layers.

#### Distroless base docker image
Used to reduce production image size by stripping all the stuff that is not used in production. For example, shell.
