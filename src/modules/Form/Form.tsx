import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

interface FormProps {
    isSignIn: boolean;
}

function Form(props: FormProps = {
    isSignIn: true
}) {

    const navigate = useNavigate();

    const [data, setData] = useState({
        fullName: props.isSignIn ? "" : "",
        confirmPassword: props.isSignIn ? "" : "",
        email: "",
        password: "",
    });

    const [error, setError] = useState({
        emailError: "",
        passwordError: ""
    });

    const [globalError, setGlobalError] = useState('')

    const inputValidation = () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email validation
        if (!emailRegex.test(data.email)) {
            setError(prev => ({ ...prev, emailError: "Please enter a valid email address" }));
            isValid = false;
        } else {
            setError(prev => ({ ...prev, emailError: "" }));
        }

        // Password validation (for sign up)
        if (!props.isSignIn) {
            if (data.password !== data.confirmPassword) {
                setError(prev => ({ ...prev, passwordError: "Passwords don't match" }));
                isValid = false;
            } else {
                setError(prev => ({ ...prev, passwordError: "" }));
            }
        }
        return isValid;
    }

    const handleSubmit: () => Promise<void> = async () => {
        // console.log(`form data => ${JSON.stringify(data)}`);
        if (!inputValidation()) {
            return;
        }
        try {
            let response;
            if (props.isSignIn) {
                response = await authService.signIn({
                    email: data.email,
                    password: data.password
                });
                // Handle successful sign in
                // navigate('/');
            } else {
                response = await authService.signUp({
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName || ""
                });
                // Handle successful sign up
                // navigate('/');
            }
            console.log(`response => ${JSON.stringify(response)}`);
        } catch (error: Error | any) {
            // Handle error (show error message to user)
            // console.error('Authentication error:', error);
            setData(() => {
                return {
                    fullName: props.isSignIn ? "" : "",
                    confirmPassword: props.isSignIn ? "" : "",
                    email: "",
                    password: "",
                }
            })
            const errorMessage = error instanceof Error ? error.message : String(error);
            setGlobalError(() => errorMessage);
        }

    }

    return (
        <div className="bg-white w-[32rem] h-[42rem] shadow-lg rounded-2xl flex flex-col justify-center 
    items-center">
            <div className="text-3xl font-bold">Welcome {props.isSignIn ? "Back" : "to"}</div>
            <div className="tetx-xl font-normal mb-3">{props.isSignIn ? "Sign in to get explored" : "Sign up now to get started"}
            </div>

            <form className="w-5/6 md:w-3/5 flex flex-col items-center justify-center"
                onSubmit={(event: any) => { event.preventDefault(); handleSubmit() }}>

                {!props.isSignIn
                    && <Input {...{
                        label: "Full name", name: "fullName", placeholder: "Full name", type: "text", value: data.fullName, required: true, className: 'rounded-md',
                        onChange: (event: any) => { setData({ ...data, fullName: event.target.value }) }
                    }}></Input>
                }

                <Input {...{
                    label: "Email",
                    name: "email",
                    placeholder: "Email",
                    type: "email",
                    value: data.email,
                    required: true,
                    className: 'rounded-md',
                    error: error.emailError,
                    onChange: (event: any) => { setData({ ...data, email: event.target.value }) }
                }} />

                <Input {...{ label: "Password", name: "password", placeholder: "Password", type: "password", value: data.password, className: 'rounded-md', required: true, onChange: (event: any) => { setData({ ...data, password: event.target.value }) } }}></Input>

                {!props.isSignIn
                    && <Input {...{
                        label: "Confirm Password",
                        name: "confirmPassword",
                        placeholder: "Confirm Password",
                        type: "password",
                        value: data.confirmPassword,
                        required: true,
                        className: 'rounded-md mb-4',
                        error: error.passwordError,
                        onChange: (event: any) =>
                            setData({ ...data, confirmPassword: event.target.value })
                    }} />
                }

                <Button {...{
                    type: "submit", label: props.isSignIn ? "Sign In" : "Sign Up",
                    className: "w-3/4 mt-4 mb-3 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                }}>{props.isSignIn ? "Sign In" : "Sign Up"}</Button>


            </form>

            <span className="text-sm text-gray-600">
                {props.isSignIn ? "Don't have an account? " : "Already have an account? "}
                <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline" onClick={() => {
                    navigate(props.isSignIn ? "/user/sign_up" : "/user/sign_in");
                }}>
                    {props.isSignIn ? "Sign Up" : "Sign In"}
                </a></span>

            <div className="h-1">
                {globalError && <div className="text-red-500 text-center">{globalError}</div>}
            </div>
        </div>
    );
}

export default Form;