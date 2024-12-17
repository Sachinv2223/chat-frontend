
import Dashboard from './modules/Dashboard/Dashboard.tsx'
import Form from './modules/Form/Form.tsx'
import { Navigate, Route, Routes } from 'react-router-dom'

const ProtectedRoutes = ({ children }: any) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;
  console.log(`isLoggedIn: ` + isLoggedIn);
  // Redirect to sign-in if not logged in and not on auth pages
  // Redirect to dashboard if logged in and on auth pages
  // Otherwise, render children
  if (!isLoggedIn && !['/user/sign_in', '/user/sign_up'].includes(window.location.pathname)) {
    return <Navigate to="/user/sign_in" />;
  } else if (isLoggedIn && ['/user/sign_in', '/user/sign_up'].includes(window.location.pathname) && localStorage.getItem('user:token')) {
    return <Navigate to="/" />;
  }
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
          <Route path="*" element={<Navigate to="/user/sign_in" />} />
        </Routes>
      </div>
    </>
  )
}

export default App
