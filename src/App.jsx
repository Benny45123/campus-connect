import { useContext, useState } from 'react'
import Auth from './pages/Auth'
import "./App.css"
import HomePage from './pages/HomePage'
import DashBoard from './components/DashBoard'
import { AppContext } from './context/AppContext'
import Write from './pages/Write'
import { Routes, Route } from 'react-router-dom'
import SelectedArticlePage from './components/selectedArticlePage'

import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import StoriesPage from './pages/StoriesPage'


function App() {
  const { user, loading } = useContext(AppContext);
  if (loading) return <div>Loading..</div>
  return (
    <>
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Auth />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/Library' element={<LibraryPage />} />
        <Route path='/Profile' element={<ProfilePage />} />
        <Route path='/Stories' element={<StoriesPage />} />
        <Route path='/new-story' element={user ? <Write /> : <Auth />} />
        <Route path='/:search' element={<HomePage />} />
        <Route path='/article/:slug' element={<SelectedArticlePage/>}/>
      </Routes>
    </>
  )
}

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path='/' element={<HomePage />} />
//         <Route path='/Library' element={<LibraryPage />} />
//         <Route path='/Profile' element={<ProfilePage />} />
//         <Route path='/Stories' element={<StoriesPage />} />
//         <Route path='/new-story' element={<Write />} />
//       </Routes>
//     </>
//   )
// }

export default App