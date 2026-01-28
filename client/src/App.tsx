import { RouterProvider } from "react-router-dom";
import Router from "./router";
import AuthContextProvider from "./context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={Router}/>
    </AuthContextProvider>
  );
}

export default App;
