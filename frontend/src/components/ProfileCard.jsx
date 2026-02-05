export default function ProfileCard( {user} ) {

  return (
    <div className="card">
      <img src="" alt="pic" />
      <div className="card-info">
        <h4>{user.username}</h4>
        <p></p>
      </div>
    </div>
  );
}
