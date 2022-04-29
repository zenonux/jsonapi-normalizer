# jsonapi-normalizer

Utility to normalize JSON API data.

## Install

```bash
npm i @urcloud/jsonapi-normalizer -S
```

## Usage

```js
import JsonapiNormalizer from '@urcloud/jsonapi-normalizer'
const { data, meta, links } = JsonapiNormalizer.deserialize(jsonapiData)
```
