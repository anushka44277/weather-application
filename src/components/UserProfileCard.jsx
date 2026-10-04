import "../styles/components.css";

function UserProfileCard({ user, onLogout }) {
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="upc-container">
      <div className="upc-avatar">{user.image
        ? <img src={user.image} alt="avatar" />
        : <span>{initials}</span>}
      </div>
      <div className="upc-info">
        <p className="upc-name">{user.firstName} {user.lastName}</p>
        <p className="upc-username">@{user.username}</p>
        <p className="upc-email">{user.email}</p>
      </div>
      <button className="upc-logout" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default UserProfileCard;
