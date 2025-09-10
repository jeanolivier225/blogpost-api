import {useEffect, useState} from 'react';
import {Eye, EyeOff, Lock, Mail, User} from 'lucide-react';
import MultiSelect from '../../components/MultiSelect';
import {protectedApi} from '../../services/http.service';
import {toast, ToastContainer} from 'react-toastify';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import type {Alert} from '../../models/Others/Alert.tsx';
import type {Author, Category, Source} from '../../models/Models/Article.tsx';
import type {MultiValue} from "react-select";
import type {SelectOption} from "../../models/Others/SelectOption.ts";

interface FormValues {
    name: string;
    email: string;
    password: string;
    new_password: string;
    new_password_confirmation: string;
    authors: number[];
    sources: number[];
    categories: number[];
}

interface UserInterface {
    id: number;
    name: string;
    email: string;
    pref_authors: Transformer[];
    pref_categories: Transformer[];
    pref_sources: Transformer[];
}

interface Transformer {
    id: number;
    name?: string;
    full_name?: string;
}

const ProfileForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<UserInterface | null>(null);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState<Alert | null>(null);

    const handleSubmit = async (values: FormValues) => {
        try {
            setSubmitting(true);
            await protectedApi.updateProfile(values);
            console.log(values);
            toast.success('Profile updated');
        } catch (error: any) {
            console.log(error);
            setAlert(error);
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            new_password: '',
            new_password_confirmation: '',
            authors: [],
            sources: [],
            categories: []
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Enter the fullname"),
            email: Yup.string().email("Invalid email format").required("Enter the email address"),
            password: Yup.string().min(6, "Password must be 6 characters at least").required("Enter the password"),
        }),
        onSubmit: handleSubmit
    });

    const dataTransform = (data: Transformer[] | undefined) => {
        return data?.map((item: Transformer) => ({
            value: item.id,
            label: item.name || item.full_name || `Item ${item.id}`
        })) || [];
    };

    const getProfile = async () => {
        try {
            const response = await protectedApi.getProfile();
            const userData = response.data;
            setUser(userData);

            formik.setValues({
                ...formik.values,
                name: userData.name || '',
                email: userData.email || ''
            });
        } catch (error: any) {
            console.log(error);
            setAlert(error);
        }
    };

    const getSources = async () => {
        try {
            setLoading(true)
            const response = await protectedApi.getSources();
            setSources(response.data);
            setLoading(false)
        } catch (error: any) {
            console.log(error);
            setAlert(error);
            setLoading(false)
        }
    };

    const getCategories = async () => {
        try {
            setLoading(true)
            const response = await protectedApi.getCategories();
            setCategories(response.data);
            setLoading(false)
        } catch (error: any) {
            console.log(error);
            setAlert(error);
            setLoading(false)
        }
    };

    const getAuthors = async () => {
        try {
            setLoading(true)
            const response = await protectedApi.getAuthors();
            setAuthors(response.data);
            setLoading(false)
        } catch (error: any) {
            console.log(error);
            setAlert(error);
            setLoading(false)
        }
    };

    const handleChangeSource = (selectedValues: MultiValue<SelectOption>) => {
        const values = selectedValues ? selectedValues.map((item: SelectOption) => item.value) : [];
        formik.setFieldValue('sources', values);
    };

    const handleChangeCategory = (selectedValues: MultiValue<SelectOption>) => {
        const values = selectedValues ? selectedValues.map((item: SelectOption) => item.value) : [];
        formik.setFieldValue('categories', values);
    };

    const handleChangeAuthor = (selectedValues: MultiValue<SelectOption>) => {
        const values = selectedValues ? selectedValues.map((item: SelectOption) => item.value) : [];
        formik.setFieldValue('authors', values);
    };

    useEffect(() => {

        getProfile();
        getSources();
        getCategories();
        getAuthors();

    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            {alert && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {alert.message || 'Une erreur est survenue'}
                </div>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fullname
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Fullname"
                            />
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                        )}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Email address"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                        )}
                    </div>


                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="new_password"
                                value={formik.values.new_password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="New password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                        )}
                    </div>

                    {/* Confirmation mot de passe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New password confirmation
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="new_password_confirmation"
                                value={formik.values.new_password_confirmation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="New password confirmation"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Auteurs */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favorite authors
                        </label>
                        <MultiSelect
                            options={dataTransform(authors)}
                            defaultValue={dataTransform(user?.pref_authors)}
                            onChange={handleChangeAuthor}
                            isMulti
                        />
                    </div>

                    {/* Catégories */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favorite categories
                        </label>
                        <MultiSelect
                            options={dataTransform(categories)}
                            defaultValue={dataTransform(user?.pref_categories)}
                            onChange={handleChangeCategory}
                            isMulti
                        />
                    </div>

                    {/* Sources */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favorite sources
                        </label>
                        <MultiSelect
                            options={dataTransform(sources)}
                            defaultValue={dataTransform(user?.pref_sources)}
                            onChange={handleChangeSource}
                            isMulti
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={submitting || !formik.isValid}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {submitting ? 'Updating profile...' : 'Update profile'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProfileForm;
