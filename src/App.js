import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import RecipeItem from "./components/RecipeItem";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState(() => {
    const localData = localStorage.getItem("recipes");
    return localData ? JSON.parse(localData) : [];
  }); // Set the existing data at initial value if it already exists in local storage; otherwise, set the empty array as initial value.

  const inputField = useRef(null);

  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();

    getData(searchQuery); // giving the search value to getData func so that it can fetch data from api using this search value

    setSearchQuery(""); // reset the search input value to empty sring

    inputField.current.blur(); // after completion of search, the cursor will be blur

    setRecipes([]); // reset the state of recipes array everytime after submitting the form

    setError("");

    navigate("/"); // navigate to home page from any page
  };

  // getting search data from the API
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

  // Checking the existance of local data
  const checkLocalData = (data) => {
    const localData = JSON.parse(localStorage.getItem("recipes")); // Set the local data into the array as an object in the local storage

    const existedData = localData.some((item) => item.id === data.id); // Return the existing data if the data already exists.

    // Set data if it doesn't already exist in local storage; else, get it by filtering all previously collected data and delete it, and update the state with the filtered information.
    if (!existedData) {
      setSavedItems([...savedItems, data]);
    } else {
      const filteredData = localData.filter((item) => item.id !== data.id);

      setSavedItems(filteredData);
    }
  };

  // fetching a certain item with a specific item id in the favourites page
  const favouriteHandler = (id) => {
    fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => checkLocalData(data?.data?.recipe));

    navigate("/favourites"); // navigate to favourite page from home page
  };

  // update the saved items
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
