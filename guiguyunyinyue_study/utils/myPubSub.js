let PubSub = {};
let messages = {};
let index = 0;
PubSub.subscribe = function(message, fn){
  let token = index++;
  token = token.toString();
  if(messages[message]){
    messages[message][token] = fn;
  }else {
    messages[message] = {};
    messages[message][token] = fn;
  }
  
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
