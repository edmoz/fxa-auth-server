/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Client = require('./')
var crypto = require('crypto')

// var email = 'eddie'+uniqueID()+'@example.com'
var email  = 'suckafree@gmail.com';
var password = 'foobarfoobar';

var publicKey = {
  "algorithm":"RS",
  "n":"4759385967235610503571494339196749614544606692567785790953934768202714280652973091341316862993582789079872007974809511698859885077002492642203267408776123",
  "e":"65537"
}
var duration = 1000 * 60 * 60 * 24
var client = null

function uniqueID() {
  return crypto.randomBytes(10).toString('hex');
}

function dumpObj(obj){
  var st = "";  
  for(var i in obj){
    st += i + ":"+obj[i] + "\n";
  }
  return st;
}

// var publicURL = 'http://127.0.0.1:9000';
var publicURL = 'https://api-accounts.dev.lcip.org';

console.log("Creating account:")
Client.create(publicURL, email, password, { preVerified: true })
  .then(
    function (x) {
      client = x
      return client.keys()
    }
  )
  .then(
    function (keys) {
      console.log('my kA:', keys.kA.toString('hex'))
      console.log('my kB:', keys.kB.toString('hex'))
      console.log('my wrapKb:', keys.wrapKb.toString('hex'))
    }
  )
  // Sign with key
  .then(
    function () {
      return client.sign(publicKey, duration)
    }
  )
  .then(
    function (cert) {
      console.log('my cert:', cert)
      return 'done'
    }
  )
  // Check if acct exists
  .then(
    function () {
      return client.accountExists(email)
    }
  )
  .then(
    function (accountExists) {
      console.log('\nAccountExists:\n', accountExists)
    }
  )
  // Request email
  .then(
    function () {
      console.log('requestVerifyEmail');
      return client.requestVerifyEmail();
    }
  )
  .then(
    function (verifyEmail) {
      console.log("veryify email: " + dumpObj(verifyEmail));
    }
  )
  // Login
  .then(
    function () {
      console.log("LOGGING IN");
      return Client.login("http://127.0.0.1:9000", email, password);
    }
  )
  .then(
    function (loginResponse) {
      console.log('\nLogin returned:\n', loginResponse)
    }
  )
  .done(console.log, console.error)

