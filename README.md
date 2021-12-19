# image-processing-api
## Overview

This project is developed for Udacity Full-stack web development nanodegree, to prove my ability to use what i've learned in real-world scenarios.

## How to build and start the server

The project can be built and run in the following ways

### 1. Install all dependencies

`yarn`

### 2. Build

`yarn build`

This command will build the typeScript code into JavaScript and save them in the `./build` folder.

### 3. Start the Server

`yarn start`

This command will start the server running on port `3000`.

## Testing and Linting

Here, I will show you how to run the test and also how to check that our code respects all the eslint rules.

### 1. Linting

`yarn lint`

### 2. Testing

`yarn test`

## Endpoint


### `/api/images/?width=<width>&height=<height>&filename=<image_name>`

Method: `get`
URL Params: `height` and `width` - the height or width of the image in pixels
Query Param: `filename` - the specific image you are requesting.

    For example: `localhost:3000/api/images/?width=600&height=500&filename=fjord`

#### Available Image options

1. `encenadaport`
2. `fjord`
3. `icelandwaterfall`
4. `palmtunnel`
5. `santamonica`

### Functionality

- User can query endpoint using various params and queries to retrieve an image with a specified height and width.
- All images requested will be saved to disk.
- There is a cache layer. If a user requests an image size that has already been requested, there is no need for resizing and the previously resized image will be returned.

## Built With

- [NodeJS](https://nodejs.org/en/) - The JavaScript runtime.
- [Express](https://expressjs.com/) - The web framework.
- [TypeScript](https://www.typescriptlang.org/) - The language used.
- [Sharp](https://sharp.pixelplumbing.com/) - NodeJS image processor.
