
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';




export default function ProductDetails() {
    const {id} = useParams();
    const navigate = useNavigate();
    const { data, error } = useProduct(id);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }


    if (!data) return <div>Loading...</div>;


    const { title, image_url, description, price, category } = data;


    return (
        <div className="max-w-4xl mx-auto p-8">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-blue-600 hover:underline flex items-center gap-2 font-medium"
            >
                ← Back to Products
            </button>
        <div className="max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                src={image_url}
                alt={description}
            />
            <div className="flex flex-col">
                <strong
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 self-start">
                    {category}
                </strong>
                <h1 className="text-3xl font-bold mt-4">{title}</h1>
                <h2 className="text-2xl font-semibold text-green-600 my-2">${price}</h2>
                <p className="my-4 text-gray-600 leading-relaxed">{description}</p>
            </div>
        </div>
        </div>
    );
}