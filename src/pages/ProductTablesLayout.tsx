import {Outlet, useNavigate} from "react-router-dom";
import {useState} from "react";
import {To} from "react-router";


const tabBase =
    'px-6 py-4 font-normal text-xl tracking-wide';
const tabActive =
    'text-gray-900 font-bold border-b-2 border-gray-500';
const tabInactive =
    'text-gray-900 hover:text-gray-700 border-b-2 border-transparent';

const tabs = [
    { label: 'Paginated', key: 'paginated', path: '/product-tables/paginated' },
    { label: 'On Demand', key: 'on-demand', path: '/product-tables/on-demand' },
    { label: 'Long', key: 'long', path: '/product-tables/long' }
];

const ProductTablesLayout = () => {
    const [activeTab, setActiveTab] = useState('paginated');
    const navigate = useNavigate();

    const setPage = (page: string, path: To) => {
        setActiveTab(page);
        navigate(path);
    };

    return (
        <div className="min-h-full mx-auto min-w-full">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center border-b border-gray-100 w-auto space-x-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`${tabBase} ${activeTab === tab.key ? tabActive : tabInactive}`}
                            onClick={() => setPage(tab.key, tab.path)}
                            aria-current={activeTab === tab.key ? 'page' : undefined}
                            data-active={activeTab === tab.key}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <main className="w-full flex flex-col items-center justify-center p-4">
                    <div>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ProductTablesLayout;