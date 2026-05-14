import { useState } from 'react'
import { router } from './api.routes.jsx'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/auth/auth.context.jsx'

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
