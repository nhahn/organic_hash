Organic Hash
============

Converts strings to awesome scifi objects!!

Organic Hash hashes strings (user ID, hashes) to a human-readable, scifi-themed
representation.

## Demo

http://truly-civilized-pancakes.herokuapp.com

## Install

```bash
$ npm install organic_hash --save 
```

## Usage

Basic usage

```javascript
var organicHash = require('organic_hash')();
organicHash.hash('ID_A3AHG7FKPIV07')
// "clearly-mongoloid-pressure"

organicHash.hash('asldkjasldkjasdlkajsd')
// 'technically-common-device' 

organicHash.hash('nhahn')
// 'dangerously-successful-gun' 
```

Different length

```javascript
var organicHash = require('organic_hash')(4);
organicHash.hash('Zero')
// 'slowly-regular-personally-hibernation'
```

Random hashes
    
```javascript
var organicHash = require('organic_hash')();
organicHash.rand();
// 'purposefully-weak-neurotoxin'
```

## Authors

Nathan Hahn <nhahn@cs.cmu.edu> ported the library to Javascript
Joseph Chee Chang <josephcc.cmu@gmail.com> and Zero Cho <itszero@gmail.com>

## License

Apache License, Version 2.0

## URL

https://github.com/nhahn/organic_hash


