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
        ...(!props.isSignIn && { fullName: "", confirmPassword: "" }),
        email: "",
        password: "",
    });

    const handleSubmit: () => Promise<void> = async () => {
        console.log(`form data => ${JSON.stringify(data)}`);

        try {
            if (props.isSignIn) {
                const response = await authService.signIn({
                    email: data.email,
                    password: data.password
                });
                // Handle successful sign in
                navigate('/');
            } else {
                const response = await authService.signUp({
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName || ""
                });
                // Handle successful sign up
                navigate('/');
            }
        } catch (error) {
            // Handle error (show error message to user)
            console.error('Authentication error:', error);
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
                    }}></Input>}

                <Input {...{
                    label: "Email", name: "email", placeholder: "Email", type: "email", value: data.email, required: true, className: 'rounded-md',
                    onChange: (event: any) => { setData({ ...data, email: event.target.value }) }
                }}>
                </Input>

                <Input {...{ label: "Password", name: "password", placeholder: "Password", type: "password", value: data.password, className: 'rounded-md', required: true, onChange: (event: any) => { setData({ ...data, password: event.target.value }) } }}></Input>

                {!props.isSignIn && (
                    <>
                        <Input
                            {...{
                                label: "Confirm Password", name: "confirmPassword", placeholder: "Confirm Password", type: "password", value: data.confirmPassword, required: true, className: 'rounded-md',
                                onChange: (event: any) =>
                                    setData({ ...data, confirmPassword: event.target.value }),
                            }}
                        />
                    </>
                )}

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
        </div>
    );
}

export default Form;