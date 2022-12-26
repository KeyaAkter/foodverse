import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import RecipeItem from "./components/RecipeItem";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState(() => {
    const localData = localStorage.getItem("recipes");
    return localData ? JSON.parse(localData) : [];
  });

  const navigate = useNavigate();

  const inputField = useRef(null);

  const searchHandler = (e) => {
    e.preventDefault();

    getData(searchQuery); // giving the search value to getData func so that it can fetch data from api using this search value

    setSearchQuery(""); // reset the search input value to empty sring
    inputField.current.blur(); // after completion of search, the cursor will be blur
    setRecipes([]); // reset the state of recipes array everytime after submitting the form
    setError("");
    navigate("/");
  };

  // getting search data from api
  const getData = async (searchQuery) => {
    try {
      setLoading(true); // set the loading value to true if it takes a while to fetch the data.

      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}`
      );
      if (!res.ok) throw new Error("Something went wrong!"); // If there's a server error, this message will show up.

      const data = await res.json();

      if (data.results === 0) throw new Error("No recipe found!"); // this error message will appear if search query doesn't match any of the recipes on the API

      setRecipes(data?.data?.recipes); // set the value of the recipes variable

      setLoading(false); // Loading must be false after getting the recipes.
    } catch (err) {
      setError(err.message); // set the error message to the error variable
    }
  };

  const checkLocalData = (data) => {
    const localData = JSON.parse(localStorage.getItem("recipes"));

    const existedData = localData.some((item) => item.id === data.id);

    if (!existedData) {
      setSavedItems([...savedItems, data]);
    } else {
      const filteredData = localData.filter((item) => item.id !== data.id);

      setSavedItems(filteredData);
    }
  };

  // fetching a certain item with a specific item id
  const favouriteHandler = (id) => {
    fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => checkLocalData(data.data.recipe));

    navigate("/favourites");
  };

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(savedItems));
  }, [savedItems]);

  return (
    <>
      <div className="app min-h-screen bg-rose-50 text-gray-600 text-lg">
        <Navbar
          savedItems={savedItems}
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
          <Route
            path="/favourites"
            element={<Favourites savedItems={savedItems} />}
          />
          <Route
            path="/recipe-item/:id"
            element={
              <RecipeItem
                savedItems={savedItems}
                favouriteHandler={favouriteHandler}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
