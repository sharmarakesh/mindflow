// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDTR1fUAGnfJeBJeANhbCwBcVgulMBLD-Y',
    authDomain: 'mindflow-rt.firebaseapp.com',
    databaseURL: 'https://mindflow-rt.firebaseio.com',
    projectId: 'mindflow-rt',
    storageBucket: 'mindflow-rt.appspot.com',
    messagingSenderId: '8483088621'
  }
};
