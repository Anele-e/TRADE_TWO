// import ProfileCard from "./ProfileCard";
// import ClientCard from "./ClientCard"

export default function CardGrid({ items, renderCard }) {
    return(
        <section className="card-grid">
            {items.map((item) => renderCard(item))}
        </section>
    );
}

