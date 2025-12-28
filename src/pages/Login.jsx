import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Connexion avec email et mot de passe
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // REDIRECTION : On envoie l'utilisateur vers le dashboard pro
      navigate('/pro/dashboard');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Connexion Pro</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email Professionnel</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}