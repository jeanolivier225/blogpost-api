import React, {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import type {Auth} from '../../models/FormData/Auth.tsx';
import {authService} from '../../services/http.service';
import {toast, ToastContainer} from 'react-toastify';
import type {Alert} from '../../models/Others/Alert.tsx';
import {Link, useParams} from 'react-router-dom';


const Auth: React.FC = () => {

    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [showPassword, setShowPassword] = useState(false);


    const { action } = useParams();


    const handleSubmit = async (values: Auth) => {

        if(submitting) return;

        try {
            setSubmitting(true);

            if(action == "register") {
                await authService.register(values);
            }
            else {
                await authService.login(values);
            }

            toast.success('Authentication successfull');
        } catch (error: any) {
            setAlert(error);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
            password_confirmation: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().ensure().email().required("Veuillez saisir votre adresse email"),
            password: Yup.string().ensure().min(4, "Le mot de passe doit etre de 6 caracteres au minimun").required("Veuillez saisir votre mot de passe"),
            name: action === 'register'
                ? Yup.string().ensure().required("Veuillez saisir votre nom")
                : Yup.string().ensure().nullable(),
            password_confirmation: action === 'register'
                ? Yup.string().ensure().oneOf([Yup.ref('password')], "Les mots de passe doivent etre identiques").
                    min(6, "Le mot de passe doit etre de 6 caracteres au minimun").
                    required("Veuillez saisir votre mot de passe")
                : Yup.string().ensure().nullable(),
        }),
        onSubmit: handleSubmit
    });


    return (
        <div className="min-h-screen flex bg-white">

            <div className="w-1/2 flex items-center justify-center p-12">
                <div className="w-full max-w-sm">
                    {alert && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {alert.message || 'An error occured'}
                        </div>
                    )}
                    <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                        {action === 'register' ? 'Registration' : 'Authentication'}
                    </h1>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">



                        {
                            action === 'register' && (
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                                        placeholder="Fullname"
                                        required
                                    />
                                </div>
                            )
                        }




                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors"
                                placeholder="Email"
                                required
                            />
                        </div>


                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors pr-12"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>


                        {
                            action === 'register' && (
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={formik.values.password_confirmation}
                                        onChange={formik.handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition-colors pr-12"
                                        placeholder="Password confirmation"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            )
                        }


                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            {submitting ? 'Logging in...' : 'Login'}
                        </button>


                        <div className="text-center">
                            {action === 'register' ? 'Already have an account' : 'Don\'t have an account'} {' '}
                            <Link to={action === 'register' ? '/auth/login' : '/auth/register'} className="text-sm text-gray-500 hover:text-gray-700">
                                {action === 'register' ? 'Login' : 'Create account'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>


            <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        </div>
                        <p className="text-lg font-medium">Welcome !</p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Auth;
