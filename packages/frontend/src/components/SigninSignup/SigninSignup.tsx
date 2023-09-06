import { NextPage } from 'next'
import React from 'react'
import { useState } from 'react'

import Signin from './Signin/Signin'
import Signup from './Signup/Signup'

const SigninSignup: NextPage = () => {
  const [loginComponent, setLoginComponent] = useState(true)

  const handleClickRegistration = () => setLoginComponent(false)
  const handleClickLogin = () => setLoginComponent(true)

  return loginComponent ? (
    <Signin handleClickRegistration={handleClickRegistration} />
  ) : (
    <Signup handleClickLogin={handleClickLogin} />
  )
}
export default React.memo(SigninSignup)
