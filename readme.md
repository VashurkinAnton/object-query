#Object query
Ease way to get, set and find object property.
##Instalation
```
npm install object-query
``` 
##Usage 
For ES5
```
var oQuery = require('object-query');
```
or for ES6
```
import * as oQuery from 'object-query'
```

##Methods

In all demos uses this object
```
var obj = {
	a: 'str',
	b: {
		num: 123
	},
	e: {
		f: {
			num: 'string num'
		}
	},
	arr: [1,2,4, {num: 321}, {num: 'str num in arr'}]
};
```
### oQuery.get(path, object);
Get some property in object or array;

```
console.log(oQuery.get('/b/num', obj));

console.log(oQuery.get('/arr/1', obj));
```

### oQuery.set(path, patch, object);
Set some property in object or array;

```
oQuery.set('/b/newProp', 'string', obj);
console.log(oQuery.get('/b/newProp', obj));

oQuery.set('/arr/3', 123, obj);
console.log(oQuery.get('/arr', obj));
```

### oQuery.remove(path, object);
Remove some property in object or array;

```
oQuery.remove('/arr/3', obj);
console.log(oQuery.get('/arr', obj));
oQuery.remove('/a', obj);
console.log(oQuery.get('/', obj));

```

### oQuery.wildcard(pattern, [findProps], object, filter);
Find props by pattern and params

```
console.log(oQuery.wildcard('/**', ['num'], obj));
```

##Licese
See license in LICENSE.md