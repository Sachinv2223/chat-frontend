
import Dashboard from './modules/Dashboard/Dashboard.tsx'
import Form from './modules/Form/Form.tsx'
import { Navigate, Route, Routes } from 'react-router-dom'

const ProtectedRoutes = ({ children }: any) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;
  console.log(isLoggedIn);
  if (!isLoggedIn && !['/user/sign_in', '/user/sign_up'].includes(window.location.pathname)) { return <Navigate to="/user/sign_in" />; }
  else if (isLoggedIn && ['/user/sign_in', '/user/sign_up'].includes(window.location.pathname)) { return <Navigate to="/" />; }
  return children;
}

function App() {
  return (
    <>
      <div className="bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100 
          min-h-screen flex justify-center items-center">
        <Routes>
          <Route
            path="/user/sign_in"
            element={<ProtectedRoutes>
              <Form {...{ isSignIn: true }}></Form>
            </ProtectedRoutes>}
          />
          <Route
            path="/user/sign_up"
            element={<ProtectedRoutes>
              <Form {...{ isSignIn: false }}></Form>
            </ProtectedRoutes>}
          />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Dashboard></Dashboard>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App
