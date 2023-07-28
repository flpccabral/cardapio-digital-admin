import LoginForm from "./components/Form";

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="py-8 px-4 mx-4 sm:px-8 rounded-md bg-neutral-200 shadow-md shadow-neutral-950/25 max-w-sm w-full">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;