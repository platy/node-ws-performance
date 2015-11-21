var Primus = require('primus');

['websockets', 'engine.io', 'faye', 'browserchannel', 'sockjs', 'socket.io'].forEach(transformer =>
  describe(transformer + ' performance', () => {
    const testMessage = new Buffer('something that will be sent over the ws lots of times');
    const loadSize = 8000;
    const timeout = 8000;
    var primus, serverSocket, clientSocket;
    before('server listen', done => {
      primus = Primus.createServer(ws => {
        serverSocket = ws;
      }, {port: 23466, transformer: transformer });
      primus.once('initialised', () => done())
    });
    after('server close', done => {
      primus.once('close', () => done());
      primus.destroy();
    })
    before('connect client', done => {
      var cOpen = false, sOpen = false;
      clientSocket = new primus.Socket('http://localhost:23466');
      clientSocket.once('open', () => {
        cOpen = true;
        if(sOpen) done();
      });
      primus.once('connection', () => {
        sOpen = true;
        if(cOpen) done();
      })
    });
    it('sends ' + loadSize + ' messages up in less than a second', function(done) {
      this.timeout(timeout);
      var received = 0;
      serverSocket.on('data', msg => {
        received++;
        if(received == loadSize)
          done();
      });
      for (var i = 0; i < loadSize; i++) {
        clientSocket.write(testMessage);
      }
    });
    it('sends ' + loadSize + ' messages down in less than a second', function(done) {
      this.timeout(timeout);
      var received = 0;
      clientSocket.on('data', msg => {
        received++;
        if(received == loadSize)
          done();
      });
      for (var i = 0; i < loadSize; i++) {
        serverSocket.write(testMessage);
      }
    });
    it('sends ' + loadSize + ' messages up & down in less than a second', function(done) {
      this.timeout(timeout);
      var receivedUp = 0, receivedDown =0;
      clientSocket.on('data', msg => {
        receivedDown++;
        if(receivedDown == loadSize && receivedUp == loadSize)
          done();
      });
      serverSocket.on('data', msg => {
        receivedUp++;
        if(receivedDown == loadSize && receivedUp == loadSize)
          done();
      });
      for (var i = 0; i < loadSize; i++) {
        serverSocket.write(testMessage);
        clientSocket.write(testMessage);
      }
    })
  }));