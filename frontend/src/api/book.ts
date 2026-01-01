const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface BookList {
    book_id: string
    title: string
    stock_quantity: number
    price: number
    cover_image_url: string
}


export interface BookDetail{
    book_id: string
    title: string
    author: string
    publisher: string | null
    publication_year: number | null
    price: number
    stock_quantity: number
    sold_quantity: number
    description: string | null
    cover_image_url: string | null
    category_name: string | null
}

export async function fetchBookList(): Promise<BookList[]> {
    const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Fetch danh sách thất bại')
    }

    return response.json()
}


export async function fetchBookDetail(book_id: string): Promise<BookDetail> {
    const response = await fetch(`${API_BASE_URL}/books/${book_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Fetch chi tiết sách thất bại')
    }

    return response.json()
}
