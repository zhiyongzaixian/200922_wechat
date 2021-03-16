let PubSub = {};
let messages = {};
let index = 0;
PubSub.subscribe = function(message, fn){
  let token = index++;
  messages[message][token] = fn;
  // let obj = {
  //   musicId: {
  //     token: fn,
  //     token2: fn
  //   }
  // }
}


PubSub.publish = function(message, data){
  if(!messages[message]){
    return;
  }


  for(let key in messages[message]){
    messages[message][key](data);
  }
}


export default PubSub;
