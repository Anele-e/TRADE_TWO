// import ProfileCard from "./ProfileCard";
// import ClientCard from "./ClientCard"

export default function CardGrid({ items, renderCard }) {
    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "2rem"
    };
    return(
        <section style={gridStyle}>
            {items.map((item) => renderCard(item))}
        </section>
    );
}

