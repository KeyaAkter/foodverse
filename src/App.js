import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import { useRef, useState } from "react";
import RecipeItem from "./components/RecipeItem";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputField = useRef(null);

  const searchHandler = (e) => {
    e.preventDefault();

    getData(searchQuery); // giving the search value to getData func so that it can fetch data from api using this search value

    setSearchQuery(""); // reset the search input value to empty sring
    inputField.current.blur(); // after completion of search, the cursor will be blur
    setRecipes([]); // reset the state of recipes array everytime after submitting the form
  };

  // getting search data from api
  const getData = async (searchQuery) => {
    try {
      setLoading(true); // set the loading value into true

      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}`
      );
      if (!res.ok) throw new Error("Something went wrong!");
      const data = await res.json();

      if (data.results === 0) throw new Error("No recipe found!");

      setRecipes(data?.data?.recipes); // set the value of the recipes variable

      setLoading(false); // after setting the recipes, loading will be false
    } catch (err) {
      setError(err.message); // if error occurs, error message will show
    }
  };

  return (
    <>
      <div className="app min-h-screen bg-rose-50 text-gray-600 text-lg">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputField={inputField}
          searchHandler={searchHandler}
        />
        <Routes>
          <Route
            path="/"
            element={<Home recipes={recipes} loading={loading} error={error} />}
          />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/recipe-item/:id" element={<RecipeItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
