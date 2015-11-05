"use strict";
(function (root, factory) {
    // Configuration
    var exportName = 'oQuery';
    var dependenciesNames = [];

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(exportName, dependencies, factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        var resolvedDependencies = dependenciesNames.map(function (name) {
            return require(name);
        });
        module.exports = factory.apply(root, resolvedDependencies);
    } else {
        // Browser globals (root is window)
        var resolvedDependencies = dependenciesNames.map(function (name) {
            return root[name];
        });
        root[exportName] = factory.apply(root, resolvedDependencies);
    }

// Dependencies passed as arguments
}(this,function(){
    var objectQuery = {};
    function pointerToObjPath(pointer){
        return pointer.split('/').filter(function(objPath) {
            return objPath !== '';
        });
    }
    function objPathToPointer(objPath){
        return objPath.join('/');
    }

    objectQuery.deepMerge = function(target, src) {
        var array = Array.isArray(src)
        var dst = array && [] || {}

        if (array) {
            target = target || []
            dst = dst.concat(target)
            src.forEach(function(e, i) {
                if (typeof target[i] === 'undefined') {
                    dst[i] = e
                } else if (typeof e === 'object') {
                    dst[i] = merge(target[i], e)
                } else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e)
                    }
                }
            })
        } else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key]
                })
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key]
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key]
                    } else {
                        dst[key] = merge(target[key], src[key])
                    }
                }
            });
        }

        return dst
    }
    objectQuery.set = function(pointer, patch, obj){
        if(pointer !== '/' && pointer !== ''){
            var link = obj;
            var objPath = pointerToObjPath(pointer);

            for(var i = 0, len = objPath.length - 1; i < len; i++){
                var tmp = link[objPath[i]];
                if(tmp !== undefined){
                    link = tmp;
                }else{
                    link[objPath[i]] = {};
                    link = link[objPath[i]];
                }
            }
            link[objPath[objPath.length - 1]] = patch;
        }else{
            obj = patch;
        }
        return obj;
    };
    objectQuery.get = function(pointer, obj){
        if(!obj) return undefined;
        for(var i = 0, points = pointerToObjPath(pointer), _length = points.length; i < _length; i++){
            obj = obj[points[i]];
            if(obj === undefined){
                return undefined;
            }
        }
        return obj;
    };
    objectQuery.remove = function(pointer, obj){
        var pointerInArray = pointerToObjPath(pointer);
        var removedItem = pointerInArray[pointerInArray.length-1];
        
        pointerInArray.splice(pointerInArray.length-1,1);
        pointer = objPathToPointer(pointerInArray);
        
        var patch = objectQuery.get(pointer,obj);

        if(Array.isArray(patch)){
            patch.splice(removedItem,1);
        }else{
            delete patch[removedItem];
        }
        return objectQuery.set(pointer, patch, obj);
    }
    objectQuery.wildcard = function(pattern, findOptions, obj, filter){
        var points = pattern.split('/');
        var pointsLength = points.length;
        var vStack = [{obj: obj, level:1, path:''}];
        var res = [];
        while(vStack.length !== 0){
            var node = vStack.pop();
            if(node['obj'] instanceof Object && node['obj'] !== null){
                var point = points[node.level];
                if(point === '*'){
                    for(var i = 0, keys = Object.keys(node['obj']), _len = keys.length; i < _len; i++){
                        vStack.push({obj: node['obj'][keys[i]], level: (node.level + 1), path: node['path'] + '/' + keys[i]});  
                    }
                }else if(point === '**'){
                    for(var i = 0, keys = Object.keys(node['obj']), _len = keys.length; i < _len; i++){
                        vStack.push({obj: node['obj'][keys[i]], level: (node.level), path: node['path'] + '/' + keys[i]});  
                    }
                }else{
                    vStack.push({obj: node['obj'][point], level: (node.level + 1), path: node['path'] + '/' + point});
                }
                if(point === '**' || node.level === pointsLength){
                    if(!!findOptions === false || checkSearchOptions(findOptions, node['obj'])){

                        if( ((filter instanceof Function) && filter(node['obj'], node['path'])) || !(filter instanceof Function) ){
                            res.push({
                                path: node['path'],
                                res: node['obj']
                            });
                        }
                    }
                }
            }
        }
        return res;
    }
    function checkSearchOptions(findOptions, obj){
        return findOptions.every(function(findOption){
            if(findOption instanceof Object){
                var findKey = Object.keys(findOption)[0];
                if(findKey === 'url' && findKey in obj){
                    findOption[findKey] = findOption[findKey]
                        .charAt(findOption[findKey].length-1) === '/' ? 
                        findOption[findKey].substr(0, findOption[findKey].length-1) : findOption[findKey];
                    obj[findKey] = obj[findKey]
                        .charAt(obj[findKey].length-1) === '/' ? 
                        obj[findKey].substr(0, obj[findKey].length-1) : obj[findKey];
                }
                return findKey in obj && findOption[findKey] === obj[findKey];
            }else{
                return findOption in obj;
            }
        });
    }
    return objectQuery
}));