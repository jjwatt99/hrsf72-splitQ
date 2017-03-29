var mysql = require('mysql');
var Promise = require('bluebird');
var schema = require('./schema.js')
var database = 'gewd';

var connection = mysql.createConnection({
  user: 'root',
  password: ''
});

var db = Promise.promisifyAll(connection, {multiArgs: true});

db.connectAsync().then(function() {
	return db.queryAsync('DROP DATABASE IF EXISTS ' + database);
}).then(function() {
	return db.queryAsync('CREATE DATABASE ' + database);
}).then(function() {
	return db.queryAsync('USE ' + database);
}).then(function() {
	return db.queryAsync(schema.members);
}).then(function() {
	return db.queryAsync(schema.trips);
}).then(function() {
	return db.queryAsync(schema.tripsMem);
}).then(function() {
	return db.queryAsync(schema.admin);
}).then(function() {
	return db.queryAsync(schema.tid);
}).then(function() {
	return db.queryAsync(schema.memId);
}).then(function() {
	return db.queryAsync(schema.receipts);
}).then(function() {
	return db.queryAsync(schema.payor);
}).then(function() {
	return db.queryAsync(schema.rtid);
}).then(function() {
	return db.queryAsync(schema.items);
}).then(function() {
	return db.queryAsync(schema.irec);
}).then(function() {
	return db.queryAsync(schema.consumed);
}).then(function() {
	return db.queryAsync(schema.cid);
}).then(function() {
	return db.queryAsync(schema.cpayor);
}).then(function() {
	return db.queryAsync(schema.payee);
}).then(function() {
	return db.queryAsync(schema.crec);
}).then(function() {
	return db.queryAsync(schema.ctrip);
});
