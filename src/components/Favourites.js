import Recipe from "./Recipe";

const Favourites = ({ savedItems }) => {
  return (
    <div className="favoutite-section ">
      <div className="favourite-text text-2xl lg:text-4xl font-semibold text-rose-300 text-center py-8 capitalize leading-normal">
        {savedItems.length === 0 ? (
          <p>Your favourite list is empty!</p>
        ) : (
          <p>Your favourite recipe{savedItems.length !== 1 ? "s" : null}</p>
        )}
      </div>

      <div className="favourite-items container mx-auto py-10 flex flex-wrap gap-10 justify-center">
        {savedItems.map((recipe) => (
          <Recipe key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
