export default function Header({ user, onLogout }) {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {user && (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.username}</span>
            <button 
              onClick={onLogout}
              className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
