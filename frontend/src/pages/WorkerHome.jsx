import NavBar from "../components/NavBar";
import CardGrid from "../components/CardGrid";
import ClientCard from "../components/ClientCard";
import { useState } from "react";

export default function WorkerHome( {user}) {
    const [selected, setSelected] = useState([]);
    const options = [
  "Door Installer", "Furniture maker", "mechanic", "Bricklayer",
  "Electrician", "Tile setter", "Plumbing", "Gardening"
];

    const toggleOption = (option) => {
        setSelected(prev => 
            prev.includes(option) ? prev.filter(o => o !== option)
            : [...prev, option]
        );
    };
    const clientWithJobsSample = [
        {},
        {}
    ]
    return (
        <>
            <NavBar />
            <div className="home-container">
                <h1>Welcome, {user.username}!</h1>

                <p>What skills do you have? </p>
                <div className="skill-options">
                    {options.map(option => (
                        <button key={option} type="button"
                        className={`chip ${selected.includes(option) ? "active" : ""}`} onClick={() => toggleOption(option)}>
                            {option}
                        </button>
                    ))}
                </div>
                {/* Show worker-specific content here. */}
                <CardGrid items={clientWithJobsSample} renderCard={(client) => (
                    <ClientCard key={client.id} client={client} />
                )}
                />
                {/* Available Jobs, Assigned Tasks, etc.             */}
                
            </div>
        </>
    )

}