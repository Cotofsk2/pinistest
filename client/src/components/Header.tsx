interface HeaderProps {
  username: string;
}

export default function Header({ username }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Gestión de Casas del Hotel</h1>
          <p className="text-sm text-slate-500">Portal de Comunicación del Personal</p>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="/readonly" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Vista de Solo Lectura
          </a>
          <span className="text-sm font-medium">Bienvenido, {username}</span>
          <button className="bg-blue-800 text-white px-3 py-1 rounded text-sm">Salir</button>
        </div>
      </div>
    </header>
  );
}
