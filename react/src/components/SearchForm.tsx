import {useEffect, useState} from 'react';
import {Search} from 'lucide-react';
import Select, {type SingleValue} from 'react-select';
import {protectedApi} from '../services/http.service';
import {useFormik} from 'formik';
import type {Alert} from '../models/Others/Alert.tsx';
import type {Author, Category, Source} from '../models/Models/Article.tsx';
import type {SelectOption} from "../models/Others/SelectOption.ts";

interface FormValues {
    search: string | null;
    author_id: string | null;
    source_id: string | null;
    category_id: string | null;
}

interface Transformer {
    id: number;
    name?: string;
    full_name?: string;
}

interface Props {
    onSubmit: (values: FormValues) => void;
    onReset: () => void;
}

const SearchForm = ({ onSubmit, onReset }: Props) => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<Alert | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{author: SelectOption|null, source: SelectOption|null, category: SelectOption|null}>({
        author: null,
        source: null,
        category: null
    })

    const resetForm = () => {
        formik.resetForm();
        setSelectedOptions(state => ({...state, source: null, category: null, author: null}));
        onReset();
    };

    const formik = useFormik({
        initialValues: {
            search: '',
            author_id: '',
            source_id: '',
            category_id: ''
        },
        onSubmit: (values) => {
            setAlert(null);
            onSubmit(values);
        }
    });

    const dataTransform = (data: Transformer[] | undefined) => {
        return data?.map((item: Transformer) => ({
            value: item.id,
            label: item.name || item.full_name || `Item ${item.id}`
        })) || [];
    };

    const getSources = async () => {
        try {
            const response = await protectedApi.getSources();
            setSources(response.data);
        } catch (error) {
            setSources([]);
            throw error;
        }
    };

    const getCategories = async () => {
        try {
            const response = await protectedApi.getCategories();
            setCategories(response.data);
        } catch (error) {
            setCategories([]);
            throw error;
        }
    };

    const getAuthors = async () => {
        try {
            const response = await protectedApi.getAuthors();
            setAuthors(response.data);
        } catch (error) {
            setAuthors([]);
            throw error;
        }
    };

    const handleChangeAuthor = (selectedOption: SingleValue<SelectOption>) => {
        formik.setFieldValue('author_id', selectedOption ? selectedOption.value : '');
        setSelectedOptions(state => ({...state, author: selectedOption}));
    };

    const handleChangeSource = (selectedOption: SingleValue<SelectOption>) => {
        formik.setFieldValue('source_id', selectedOption ? selectedOption.value : '');
        setSelectedOptions(state => ({...state, source: selectedOption}));
    };

    const handleChangeCategory = (selectedOption: SingleValue<SelectOption>) => {
        formik.setFieldValue('category_id', selectedOption ? selectedOption.value : '');
        setSelectedOptions(state => ({...state, category: selectedOption}));
    };


    const dismissAlert = () => {
        setAlert(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setAlert(null);

            await Promise.all([
                getSources(),
                getCategories(),
                getAuthors()
            ]);

            setLoading(false);
        };

        fetchData();
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
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
                    {alert.message || 'Une erreur est survenue'}
                    <button
                        onClick={dismissAlert}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl leading-none"
                        type="button"
                    >
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Recherche
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                value={formik.values.search}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Rechercher..."
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Author
                        </label>
                        <Select
                            options={dataTransform(authors)}
                            onChange={handleChangeAuthor}
                            value={selectedOptions.author}
                            isClearable
                            placeholder="Sélectionner un auteur"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <Select
                            options={dataTransform(categories)}
                            onChange={handleChangeCategory}
                            value={selectedOptions.category}
                            isClearable
                            placeholder="Sélectionner une catégorie"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Source
                        </label>
                        <Select
                            options={dataTransform(sources)}
                            onChange={handleChangeSource}
                            value={selectedOptions.source}
                            isClearable
                            placeholder="Sélectionner une source"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                <div className="pt-3">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center w-24 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Filter
                    </button>
                    <button
                        onClick={resetForm}
                        type="button"
                        className="m-2 inline-flex items-center justify-center w-24 h-10 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        Reset filter
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
