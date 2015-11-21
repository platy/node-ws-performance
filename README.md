# Node websocket library performance

Some basic performance tests for the various websocket libraries for node using primus.

Its just a few mocha tests which send thousands of messages in each direction for each of the transformers.

## Results

So far, the results I have consistently seen go in this order, with fastest at the top:

1. browserchannel
2. websockets
3. socket.io
4. engine.io
5. faye
6. sockjs

browserchannel and websockets are very similar.
