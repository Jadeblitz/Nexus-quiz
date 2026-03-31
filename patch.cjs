const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

// Replace first conflict
code = code.replace(
`<<<<<<< feat/manual-auth-error-fix-11776493011005056587
  const [authError, setAuthError] = useState('');
=======
  const [authError, setAuthError] = useState("");
>>>>>>> main`,
`  const [authError, setAuthError] = useState('');`
);

// Replace second conflict
const conflict2 = `<<<<<<< feat/manual-auth-error-fix-11776493011005056587

      let errorMessage = "Login failed. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Email not registered. Please sign up first.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }

      setAuthError(errorMessage);
=======
      let errMsg = "Login failed. Please try again.";
      if (error?.message?.includes('auth/user-not-found') || error?.code === 'auth/user-not-found') {
        errMsg = "Email not registered. Please sign up first.";
      } else if (error?.message?.includes('auth/wrong-password') || error?.code === 'auth/wrong-password') {
        errMsg = "Incorrect password. Please try again.";
      }
      setAuthError(errMsg);
>>>>>>> main`;

const replacement2 = `      let errorMessage = "Login failed. Please try again.";
      if (error?.code === 'auth/user-not-found' || error?.message?.includes('auth/user-not-found')) {
        errorMessage = "Email not registered. Please sign up first.";
      } else if (error?.code === 'auth/wrong-password' || error?.message?.includes('auth/wrong-password')) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error?.code === 'auth/invalid-credential' || error?.message?.includes('auth/invalid-credential')) {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error?.code === 'auth/invalid-email' || error?.message?.includes('auth/invalid-email')) {
        errorMessage = "Invalid email format.";
      }

      setAuthError(errorMessage);`;

code = code.replace(conflict2, replacement2);

fs.writeFileSync('App.jsx', code);
console.log('App.jsx patched successfully');
