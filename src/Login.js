import React from 'react';
import { signInWithGoogle } from './firebaseUtils'; // adjust the path

const Login = () => {
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    );
}

export default Login;