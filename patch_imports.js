const fs = require('fs');

let content = fs.readFileSync('App.jsx', 'utf8');

if (!content.includes("import { FirebaseAuthentication }")) {
    const importStr = "import { FirebaseAuthentication } from '@capacitor-firebase/authentication';\n";
    content = importStr + content;
}

if (content.includes("from 'lucide-react';")) {
    content = content.replace("from 'lucide-react';", ", LogOut, Mail, Lock } from 'lucide-react';");
}

fs.writeFileSync('App.jsx', content);
