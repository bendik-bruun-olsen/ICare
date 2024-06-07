import { AuthUser } from "./components/firebase/AuthUser";
import { CreateUser } from "./components/firebase/CreateUser";

function App() {
  return (
    <>
      <AuthUser />
      <br />
      <CreateUser />
    </>
  );
}

export default App;
