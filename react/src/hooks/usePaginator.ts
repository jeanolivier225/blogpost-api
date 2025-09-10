import { useState } from 'react';

const usePaginator = (perPage = 10) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }
    
    const totalPages = Math.ceil(totalItems / perPage);
    
    return [
        currentPage,
        totalPages,
        onPageChange,
        setTotalItems
    ]
    
};

export default usePaginator;