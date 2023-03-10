import Header from "../components/Header"
import NavBar from "../components/NavBar"
import ShoppingList from "../components/ShoppingList"

const Home = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div className="container-fluid">
                <Header text="Home"></Header>
            </div>
        </div>
    )
}

export default Home;