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
    log.info(`[TCP] Data from ${socket.remoteAddress}:${socket.remotePort}`);
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
    log.info(`[TCP] Error: ${error}`);
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

  // callback when new command from Apps
  ioClient.on('command', (req) => {
    // send command to device
    const socket = sockets.find(
      (el) => el.remoteAddress === req.client.address && el.remotePort === req.client.port,
    );
    // send command to specified client
    if (socket) {
      // send command
      socket.write(Buffer.from(req.hexCommand, 'hex'));
    }
  });

  // callback for ACK from Apps
  ioClient.on('ack', (req) => {
    // send ack to device
    const socket = sockets.find(
      (el) => el.remoteAddress === req.client.address && el.remotePort === req.client.port,
    );
    // send ack to specified client
    if (socket) {
      let hex = req.hexACK;
      // combine command (if any)
      if (req.hexCommand) {
        hex += req.hexCommand;
        // command sent (Apps waitting command response)
        log.info(`[TCP] Command to ${socket.remoteAddress}:${socket.remotePort}`);
        log.info(`      ${req.hexCommand}`);
      }
      // ack (and command) sent
      log.info(`[TCP] ACK to ${socket.remoteAddress}:${socket.remotePort}`);
      log.info(`      ${req.hexACK}`);
      // send ack (and command)
      socket.write(Buffer.from(hex, 'hex'));
    }
  });
});
