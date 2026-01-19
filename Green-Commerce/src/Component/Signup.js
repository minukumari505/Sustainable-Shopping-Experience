import React, { useState } from "react";
import "../Css/Login.css";
import { Link, useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import toast
import { toast } from "react-toastify";
function Signup() {
    const navigate=useNavigate();

    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const submit = () => {
        const resposne = fetch(`http://localhost:8080/signup`, {
            "method": "post",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then((res) => res.json())
            .then((result) => {
                if (!result.success) {
                    // error toast
                    return toast.error(result.message || "SignUp failed", {
                        position: "top-right"
                    });
                }

                // success toast
                toast.success("User Createed successfully!", {
                    position: "top-right"
                });
                navigate("/login")
                console.log("result is ", result);
            })

            .catch((error) => {
                console.log("error is ", error);
            })

        //   const data= response.json();
        //   console.log("data is ",data);

    }
    return (
        <div className="login">
            <Link to="/">
                <img
                    className="login__logo"
                    src="../images/amazon_black.jpg"
                />
            </Link>
            <div className="login__container">
                <h1>Sign-Up</h1>
                <form>
                    <h5>Email</h5>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        aria-required
                    />

                    <h5>Password</h5>
                    <input
                        type="password"
                        aria-required
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    
                        <button
                          onClick={
                            (e)=>{
                                e.preventDefault()
                                submit()}}
                            className="login__signInButton"
                            type="submit"
                        >
                            Register
                        </button>
                    

                    <p>
                        By signing Up you agree the Terms and Conditions of the Amazon fake
                        clone. Please see our privacy notice and out cookies policy
                    </p>
                    <Link to="/login">
                        <button className="login__registerButton"
                        >
                            Sign in  your Amazon account
                        </button>
                    </Link>
                    
                </form>
            </div>
        </div>
    );
}

export default Signup;