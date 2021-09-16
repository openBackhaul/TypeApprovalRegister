'use strict';


/**
 * Returns remote IP address or hostname
 *
 * uuid String 
 * returns inline_response_200_31
 **/
exports.getTcpClientRemoteAddress = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "tcp-client-interface-1-0:remote-address" : {
    "domain-name" : "Not yet defined.",
    "ip-address" : {
      "ipv-4-address" : "10.118.125.157",
      "ipv-6-address" : "0:0:0:0:0:0:0:0"
    }
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns target TCP port at server
 *
 * uuid String 
 * returns inline_response_200_32
 **/
exports.getTcpClientRemotePort = function(uuid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "tcp-client-interface-1-0:remote-port" : 1000
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Configures remote IP address or hostname
 *
 * body Tcpclientinterfaceconfiguration_remoteaddress_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putTcpClientRemoteAddress = function(body,uuid) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Configures target TCP port at server
 *
 * body Tcpclientinterfaceconfiguration_remoteport_body 
 * uuid String 
 * no response value expected for this operation
 **/
exports.putTcpClientRemotePort = function(body,uuid) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

