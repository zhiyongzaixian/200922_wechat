// toString


let arr  = [1,2,3];
console.log(arr.toString()) // 1,2,3
console.log(Object.prototype.toString.call(arr).slice(8, -1)) // [object Array]