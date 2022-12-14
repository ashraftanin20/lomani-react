import bcrypt from 'bcryptjs';
const data = {
    users: [
        {
            name: 'Ashraf Tanin',
            email: 'ashraf.tanin@gmail.com',
            password: bcrypt.hashSync('tanin@22', 8),
            isAdmin: true,
        },
        {
            name: 'Samir',
            email: 'samir@gmail.com',
            password: bcrypt.hashSync('samir@22', 8),
            isAdmin: false,
        },
    ],
    products: [
        {
            name: 'Nike Slim Shirt',
            category: 'Shirts',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality men shirt product',
        },
        {
            name: 'Adidas Slim Shirt',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 100,
            countInStock: 5,
            brand: 'Adidas',
            rating: 4.0,
            numReviews: 10,
            description: 'High quality men shirt product',
        },
        {
            name: 'Lacoste Free Shirt',
            category: 'Shirts',
            image: '/images/p3.jpg',
            countInStock: 0,
            price: 220,
            brand: 'Lacoste',
            rating: 4.8,
            numReviews: 17,
            description: 'High quality men shirt product',
        },
        {
            name: 'Nike Slim Pant',
            category: 'Pants',
            image: '/images/p4.jpg',
            countInStock: 15,
            price: 78,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 14,
            description: 'High quality men shirt product',
        },
        {
            name: 'Puma Slim Pant',
            category: 'Pants',
            image: '/images/p5.jpg',
            countInStock: 20,
            price: 65,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality men shirt product',
        },
        {
            name: 'Adidas Fit Pant',
            category: 'Pants',
            image: '/images/p6.jpg',
            countInStock: 10,
            price: 139,
            brand: 'Adidas',
            rating: 4.5,
            numReviews: 15,
            description: 'High quality men shirt product',
        }
    ]
}

export default data;