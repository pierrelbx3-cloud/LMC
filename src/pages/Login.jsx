import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Exemple simple de Login via Magic Link
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Vérifiez vos emails pour le lien de connexion !');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mt-5">Espace Professionnel</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Pro</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
}