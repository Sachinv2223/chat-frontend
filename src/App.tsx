import './App.css'
import Dashboard from './modules/Dashboard/Dashboard'
// import Form from './modules/Form'

function App() {

  return (
    <>
      <div className="bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100 
      min-h-screen flex justify-center items-center">
        {/* <Form {...{ isSignIn: false }}></Form> */}
        <Dashboard></Dashboard>
      </div>
    </>
  )
}

export default App
