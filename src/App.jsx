// src/App.jsx
import Button from './components/Button';
// Assurez-vous d'avoir effacé les directives @tailwind de votre index.css ou app.css si vous les aviez mises.

function App() {
  return (
    <div className="App">
      <h1>Mon Application React</h1>
      
      {/* Utilisation du nouveau composant stylisé */}
      <Button>Cliquez-moi !</Button> 
      
      <p>Nous continuons sans framework CSS.</p>
    </div>
  );
}

export default App;