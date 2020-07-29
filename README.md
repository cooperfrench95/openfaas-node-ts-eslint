# Using this template

## 1. Create new function

Make sure you have a `template` folder which contains `node-ts-eslint` folder, which in turn contains your actual template. You can also achieve this with:
`faas template pull https://github.com/cooperfrench95/openfaas-node-ts-eslint`

```bash
faas new --lang node-ts-eslint helloworld
```
Okay, now you've finished your function.

## 2. Build new function

```bash
faas-cli build -f ./helloworld.yml
```

## 3. "Deploy" new function

```bash
docker run -p 3000:8080 helloworld:latest
```

Now it should be ready on localhost:3000.
