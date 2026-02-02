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

// const WCard = ({ worker }) => {
//   return (
//     <div className="worker-card">
//       <h3>{worker.first_name} {worker.last_name}</h3>
//       <p>Username: {worker.username}</p>
//       <p>Email: {worker.email}</p>
//     </div>
//   );
// };

// export default WorkerCard;