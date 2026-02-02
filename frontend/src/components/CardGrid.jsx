import ProfileCard from "./ProfileCard";
// import ClientCard from "./ClientCard"

export default function CardGrid({ cards }) {
    return(
        <section className="card-grid">
            {cards.map((card, index) => (
                <ProfileCard key={index} {...card} />
            ))}
        </section>
    );
}

