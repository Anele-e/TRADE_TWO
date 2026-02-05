export default function WorkerCard({ worker }) {
    return (
        <div className="card">
            <div className="card-info">
                <h4>{worker.username}</h4>
                <p>Skills: {worker.skills}</p>
            </div>
        </div>
    )
}
