var oQuery = require('../index.js');

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
console.log('Find all object will contains "num" property');
console.log(oQuery.wildcard('/**', ['num'], obj));
console.log();
console.log('Get object property ["b"]["num"]', '----', oQuery.get('/b/num', obj) === obj['b']['num'], '\n');

console.log('Get object property ["arr"][1]', '----', oQuery.get('/arr/1', obj) === obj['arr'][1], '\n');

console.log('Get object property is undefined property', '----', oQuery.get('/b/num/nonProp/isUndef', obj) === undefined, '\n');

oQuery.set('/b/newProp', 'string', obj);
console.log('Set object property: /b/newProp -> value: "string"', '----', oQuery.get('/b/newProp', obj) === 'string', '\n');

oQuery.set('/arr/3', 123, obj);
console.log('Set object property in array: /arr/3 -> value: 123', '----', oQuery.get('/arr/3', obj) === 123, '\n');

oQuery.remove('/arr/3', obj);
console.log('Remove object property in array: /arr/3', '----', oQuery.get('/arr/3', obj) === undefined, '\n');

oQuery.remove('/a', obj);
console.log('Remove object property: /a', '----', oQuery.get('/a', obj) === undefined, '\n');
