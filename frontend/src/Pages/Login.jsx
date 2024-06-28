import React, {useState, useEffect, useContext} from 'react';
import { ShopContext } from '../Context/ShopContext';
import * as yup from 'yup';

import './CSS/Login.css';

export const Login = () => {
  const [process, setProcess] = useState('Log In')
  const [logInForm, setLoginForm] = useState({email: "", password: ""})
  const [signupForm, setSignupForm] = useState({name: "", email: "", password: "", reenterPassword: "", otp: ""})
  const [signupFormError, setSignupFormError] = useState({})
  const [otpInputError, setotpInputError] = useState(false)

  // Log In
  function handleLogInForm(e) {
    setLoginForm({...logInForm, [e.target.name]: e.target.value})
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    // console.log(logInForm);  
    await fetch(`${'apiUrl'}/login`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        'content-type': "application/json"
      },
      body: JSON.stringify(logInForm)
    })
    .then(response => response.json())
    .then(response => {
      if(response.success == true) {
        localStorage.setItem("auth-token", response.token)
        if(response.isAdmin) {
          window.location.assign('/admin')
        }
        else {
          window.location.assign('/')
        }
      }
      else {
        alert(response.error)
      }
    })
    .catch(()=> {alert("Something is wrong. Please try again.")})
  }

  // Sign Up
  function handleSignupForm(e) {
    setSignupForm({...signupForm, [e.target.name]: e.target.value})
  }

  const validationSchema = yup.object({
    name: yup.string()
      .required("Name is required.")
      .matches(/^[a-zA-Z\s]{3,50}$/, "Please enter valid name."),
    email: yup.string()
      .required("Email is required.")
      .matches(/^(?=.{1,320}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email id is not valid"),
    password: yup.string()
      .required("Password is required.")
      .max(16, "Password must be at most 16 characters.")
      .matches(/[!@#$%^&*()\-_=+\[\]{};:'"\\|,.<>/?`~]/, "Password must contain at least one special character.")
      .matches(/[0-9]/, "Password must contain at least one number.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .min(8, "Password must be at least 8 characters."),
    reenterPassword: yup.string()
      .required("Confirm your password.")
      .oneOf([yup.ref('password')], "Re-entered password didn't match.")
  })

  async function handleSignupSubmit(e) {
    e.preventDefault();
    try {
      await validationSchema.validate(signupForm, {abortEarly: false});
      // All form data is vaild. Send user data to server.
      await fetch("http://localhost:4000/email-veryfication", {
        method: "POST",
        headers: {
          Accept: "application/json",
          'content-type': "application/json"
        },
        body: JSON.stringify({email: signupForm.email})
      })
      .then(response => response.json())
      .then(data => {
        if(data.success === true) {
          setProcess("Submit OTP")
        }
        else {
          alert(data.error)
        }
      })
      .catch(()=> {alert("Something is wrong. Please try again.")})
    }
    catch(error) {
      // If signupForm has error.
      let errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message
      });
      setSignupFormError(errors)
    }
  }

  useEffect(() => {
    console.log(signupFormError)
  }, [signupFormError])

  // OTP submit and register
  async function handleOtpSubmit(e){
    e.preventDefault()
    if((/^\d{6}$/).test(signupForm.otp)) {
      await fetch("http://localhost:4000/signup", {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify(signupForm) 
      })
      .then(response => response.json())
      .then(response => {
        if(response.success === true) {
          localStorage.setItem("auth-token", response.token)
          window.location.assign('/')
          alert("You have been registered.")
        }
        else {
          alert(response.error)
          setProcess("Sign Up")
        }
      })
      .catch(()=> {
        setProcess("Sign Up")
        alert("Something is wrong. Please try again.")
      })
    }
    else {
      setotpInputError(true)
    }
  }

  return (
    <div className='login'>
        <div className="main-section">
            <div className="data-input">
                <div className="title">
                    <p>{process}</p>
                </div>
                {process == 'Log In' &&
                  // Login form
                  <form id='login-form'>
                    <label htmlFor="email"> Email </label>
                    <input type="email" name="email" onChange={handleLogInForm} placeholder="Email Id" required />
                    <label htmlFor="password"> Password </label>
                    <input type="password" name="password" onChange={handleLogInForm} placeholder="Password" 
                      title="Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character." 
                      pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-]).{8,16}$" 
                      required />
                    <button className="submit-btn" onClick={handleLoginSubmit}>Log In</button>
                  </form>
                }
                {process == 'Sign Up' &&
                  // Signup form
                  <form id='signup-form'>
                    <label htmlFor="name"> Full Name </label>
                      <input type="text" name="name" placeholder="Full Name" required onChange={handleSignupForm} />
                      {<p className='invalid-input-warning'>{signupFormError.name}</p>}
                    
                    <label htmlFor="email"> Email </label>
                      <input type="text" name="email" placeholder="Email Id" required onChange={handleSignupForm} />
                      {<p className='invalid-input-warning'>{signupFormError.email}</p>}
                    
                    <label htmlFor="password"> Password </label>
                      <p className='instruction'>8-16 characters, including uppercase, lowercase, number, and special character.</p>
                      <input type="password" name="password" placeholder="Password" onChange={handleSignupForm} />
                      {<p className='invalid-input-warning'>{signupFormError.password}</p>}               
                    
                    <label htmlFor="password">Reenter Password</label>
                      <input type="password" name="reenterPassword" placeholder="Reenter Password" required onChange={handleSignupForm} />
                      {<p className='invalid-input-warning'>{signupFormError.reenterPassword}</p>}
                    
                    <button className="submit-btn" onClick={handleSignupSubmit}> Submit </button>
                  </form>
                  }
                  {process == "Submit OTP" &&
                    // OTP submit form
                    <form>
                      <label>OTP</label>
                      <input type="number" name='otp' placeholder='Enter the OTP' pattern="^\d{6}$" required  onChange={handleSignupForm} />
                      {otpInputError && <p className='invalid-input-warning'>The OTP is 6 numbers long.</p>}
                      <p className='instruction-highlighted'>The OTP will expire after 10 minutes.</p>
                      <button className="submit-btn" onClick={handleOtpSubmit}> Submit OTP </button>
                    </form>
                  }
            </div>

            {process == 'Log In' &&
              <div className="other-options">
                  <span>New user ? </span>
                  <button onClick={()=>setProcess('Sign Up')}> Sign Up </button>
              </div>
            }

            {process == 'Sign Up' &&
              <div className="other-options">
                  <span>Already an user ? </span>
                  <button onClick={()=>setProcess('Log In')}> Log In </button>
              </div>
            }

            {process == 'Submit OTP' &&
              <div className="other-options">
                  <span>Send OTP again ? </span>
                  <button onClick={()=>setProcess('Log In')}> Resend OTP </button>
              </div>
            }
        </div>
    </div>
  )
}
