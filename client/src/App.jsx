import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Lists from './routes/Lists';
import Recipes from './routes/Recipes';
import Items from './routes/Items';
import ListDetail from './routes/ListDetail';
import RecipeDetail from './routes/RecipeDetail';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/lists" element={<Lists/>}></Route>
                <Route path="/lists/:id" element={<ListDetail/>}></Route>
                <Route path="/recipes" element={<Recipes/>}></Route>
                <Route path="/recipes/:id" element={<RecipeDetail/>}></Route>
                <Route path="/items" element={<Items/>}></Route>
            </Routes>
        </Router>
    )
}

export default App;