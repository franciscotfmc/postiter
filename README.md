postiter
========

Simple real time board, built on the purpose to speed up our retrospective meetings at <a href="http://gerencianet.com.br" target="_blank">Gerencianet</a>.

Live app: <a href="http://postiter.com" target="_blank">postiter.com</a>

It's also a proof of concept of the MEAN architecture and some other ideas:
* use grunt tasks to build the app, among other dev environment issues
* keep things running clean in one terminal tab, like the express server, client and server unit tests with jasmine
* use mongo to optimize data reading
* use node view engine before login
* load Angular app only after login and never more
* isolate server and client code
* the client app must be built in small modules
  * TODO: create a Yeoman scaffold for this structure

### Running the app

Clone postiter:
```console
git clone git@github.com:franciscotfmc/postiter.git
```

Install server dependencies:
```console
npm install
```

Install client dependencies:
```console
bower install
```

Copy the auth.js file in ignored folder and put it in server/config directory. As the login is via Facebook, you will need to configure an id:
```javascript
module.exports = {
  'facebookAuth': {
    'clientID': 'id',
    'clientSecret': 'secret',
    'callbackURL': 'url'
  }
};

```

Run the app with grunt:
```console
grunt serve
```
