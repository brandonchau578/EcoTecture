import './App.css';
import Homepage from './components/Homepage/Homepage.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import Layout from "./Routes/Layout/Layout.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<Homepage />
        },
        {
          path: "/Login",
          element: <LoginForm />,
        },
      ]
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
