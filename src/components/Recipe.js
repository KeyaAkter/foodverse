import { Link } from "react-router-dom";

const Recipe = ({ recipe }) => {
  return (
    <div className="recipe w-80 overflow-hidden bg-white/75 rounded-2xl shadow-xl p-5 shadow-rose-100 border-2 border-white flex flex-col gap-5">
      <div className="img h-40 overflow-hidden rounded-lg flex justify-center items-center">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="block w-full rounded-lg"
        />
      </div>
      <div className="texts">
        <span className="publisher text-xs uppercase text-sky-400 font-semibold tracking-widest">
          {recipe.publisher}
        </span>
        <h2 className="title text-2xl font-semibold truncate">
          {recipe.title}
        </h2>
        <Link
          to={`/recipe-item/${recipe.id}`}
          className="bg-gradient-to-br from-rose-400 to-rose-600 text-rose-50 p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-2 inline-block shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300 duration-300"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default Recipe;
