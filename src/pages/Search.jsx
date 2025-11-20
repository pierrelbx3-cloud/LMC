export default function Search() {
  return (
    <div>
      <h2 className="mb-4">Rechercher un Hangar</h2>
      <div className="card p-4 bg-light">
        <p>Filtres : Manufacturer | Type Avion | Services | Date</p>
        <button className="btn btn-primary">Lancer la recherche</button>
      </div>
    </div>
  );
}