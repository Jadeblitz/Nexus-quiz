const fs = require('fs');

const content = fs.readFileSync('App.jsx', 'utf8');

const expectedHandlers = [
    'handleEmailAuth',
    'handleGoogleLogin',
    'handleFacebookLogin',
    'handleLogout'
];

let allPresent = true;
expectedHandlers.forEach(handler => {
    if (!content.includes(handler)) {
        console.error(`Missing handler: ${handler}`);
        allPresent = false;
    }
});

const imports = [
    'FirebaseAuthentication',
    'LogOut',
    'Mail',
    'Lock'
];

imports.forEach(imp => {
    if (!content.includes(imp)) {
        console.error(`Missing import: ${imp}`);
        allPresent = false;
    }
});

if (allPresent) {
    console.log('All verification checks passed successfully.');
} else {
    process.exit(1);
}
