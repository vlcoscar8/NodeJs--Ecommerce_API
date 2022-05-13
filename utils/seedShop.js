import mongoose from "mongoose";
import dotenv from "dotenv";
import { Brand } from "../api/models/brand.schema.js";
import { Product } from "../api/models/product.schema.js";
import { Genre } from "../api/models/genre.schema.js";
import { Shop } from "../api/models/shop.schema.js";
import { data } from "./data.js";

dotenv.config();
const DB_URL = process.env.DB_URL;

const products = data;

const shop = [
    {
        genres: [],
        lastBuys: [],
        mostValuated: [],
        mostCommented: [],
    },
];

const genres = [
    {
        genre: "Man",
        categories: [],
    },
    {
        genre: "Woman",
        categories: [],
    },
];

const brands = [
    {
        name: "Nike",
        genre: "Man",
        products: [],
    },
    {
        name: "Adidas",
        genre: "Man",
        products: [],
    },
    {
        name: "Puma",
        genre: "Man",
        products: [],
    },
    {
        name: "Reebok",
        genre: "Man",
        products: [],
    },
    {
        name: "Nike",
        genre: "Woman",
        products: [],
    },
    {
        name: "Adidas",
        genre: "Woman",
        products: [],
    },
    {
        name: "Puma",
        genre: "Woman",
        products: [],
    },
    {
        name: "Reebok",
        genre: "Woman",
        products: [],
    },
];

const shopDoc = shop.map((shop) => new Shop(shop));

const genresDoc = genres.map((genre) => new Genre(genre));

const brandsDoc = brands.map((brnd) => new Brand(brnd));

const productsDoc = products.map((product) => new Product(product));

const creationSeed = mongoose
    .connect(
        "mongodb+srv://vlcoscar8:sMZl71f0NTWiHJnA@cluster0.sod8s.mongodb.net/E-commerce",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(async () => {
        await createCollections();
        await insertGenresOnShop();
        await insertBrandsOnGenre();
        await insertProductOnCategories();
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        console.log("Seed created successfully");
    });

const createCollections = async () => {
    await Shop.collection.drop();
    await Shop.insertMany(shopDoc);

    await Genre.collection.drop();
    await Genre.insertMany(genresDoc);

    await Brand.collection.drop();
    await Brand.insertMany(brandsDoc);

    await Product.collection.drop();
    await Product.insertMany(productsDoc);
};

const insertGenresOnShop = async () => {
    const genres = await Genre.find();
    const shop = await Shop.find();

    genres.forEach(
        async (genre) =>
            await Shop.findByIdAndUpdate(shop[0].id, {
                $push: {
                    genre: genre,
                },
            })
    );
};

const insertBrandsOnGenre = async () => {
    const brands = await Brand.find();
    const manBrands = brands.filter((brnd) => brnd.genre === "Man");
    const womanBrands = brands.filter((brnd) => brnd.genre === "Woman");

    manBrands.forEach(
        async (brnd) =>
            await Genre.findOneAndUpdate(
                { genre: brnd.genre },
                {
                    $push: {
                        brands: brnd,
                    },
                }
            )
    );

    womanBrands.forEach(
        async (brnd) =>
            await Genre.findOneAndUpdate(
                { genre: brnd.genre },
                {
                    $push: {
                        brands: brnd,
                    },
                }
            )
    );
};

const insertProductOnCategories = async () => {
    const products = await Product.find();

    products.forEach(
        async (pro) =>
            await Brand.findOneAndUpdate(
                { genre: pro.genre, name: pro.brand },
                {
                    $push: {
                        products: pro,
                    },
                }
            )
    );
};
