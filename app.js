// config
const config = {
  tcp: {
    port: 5044,
  },
  io: {
    port: 4200,
  },
};

// create a stdout and file logger
const fs = require('fs');
const log = require('simple-node-logger').createSimpleLogger('server.log');
const io = require('socket.io')(config.io.port);
const net = require('net');

// empty log file
fs.unlinkSync('server.log');

// ================== TCP SERVER ======================
const sockets = [];

const server = net.createServer((socket) => {
  log.info('[TCP] New IOT-client connected.');
  // Put this new client in the list
  sockets.push(socket);

  // Callback for incomming message
  socket.on('data', (data) => {
    const hexData = data.toString('hex').toUpperCase();
    log.info(`[TCP] DATA from ${socket.remoteAddress}:${socket.remotePort}`);
    log.info(`      ${hexData}`);
    // emit command response to all IO sockets
    io.emit('frameReceived', {
      client: {
        address: socket.remoteAddress,
        port: socket.remotePort,
      },
      hexData,
    });
  });

  // Callback on client leaves
  // Remove the client from the list when it leaves
  socket.on('end', () => {
    sockets.splice(sockets.indexOf(socket), 1);
    log.info(`[TCP] Client ${socket.remoteAddress}:${socket.remotePort} disconnected.`);
  });

  // Callback on error
  socket.on('error', (error) => {
    log.info(`[TCP] ${error}`);
  });
});

// start tcp server
server.listen(config.tcp.port, () => {
  log.info(`[TCP] Server listening on ${config.tcp.port}`);
});

// ================== SOCKET.IO SERVER ======================
log.info(`[WEB] Server listening on ${config.io.port}`);
// callback when there is new connection
io.on('connection', (ioClient) => {
  log.info('[WEB] New WEB-client connected.');
  ioClient.emit('connected');

  // callback when new send from Apps
  ioClient.on('send', (req) => {
    // find the socket client
    const socket = sockets.find(
      (el) => el.remoteAddress === req.client.address && el.remotePort === req.client.port,
    );
    // send command/ack to specified client
    if (socket) {
      // send command/ack
      socket.write(Buffer.from(req.hex, 'hex'));
      // decide the frame
      const frame = req.command ? 'COMMAND' : 'ACK';
      // info
      log.info(`[TCP] ${frame} to ${socket.remoteAddress}:${socket.remotePort}`);
      log.info(`      ${req.hex}`);
    }
  });
});
