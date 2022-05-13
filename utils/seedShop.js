import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../api/models/categories.schema.js";
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

const categories = [
    {
        name: "Shoes",
        genre: "Man",
        products: [],
    },
    {
        name: "Tshirts",
        genre: "Man",
        products: [],
    },
    {
        name: "Shoes",
        genre: "Woman",
        products: [],
    },
    {
        name: "Tshirts",
        genre: "Woman",
        products: [],
    },
];

const shopDoc = shop.map((shop) => new Shop(shop));

const genresDoc = genres.map((genre) => new Genre(genre));

const categoriesDoc = categories.map((category) => new Category(category));

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
        await insertCategoriesOnGenre();
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

    await Category.collection.drop();
    await Category.insertMany(categoriesDoc);

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

const insertCategoriesOnGenre = async () => {
    const categories = await Category.find();
    const manCategories = categories.filter((cat) => cat.genre === "Man");
    const womanCategories = categories.filter((cat) => cat.genre === "Woman");

    manCategories.forEach(
        async (cat) =>
            await Genre.findOneAndUpdate(
                { genre: cat.genre },
                {
                    $push: {
                        categories: cat,
                    },
                }
            )
    );

    womanCategories.forEach(
        async (cat) =>
            await Genre.findOneAndUpdate(
                { genre: cat.genre },
                {
                    $push: {
                        categories: cat,
                    },
                }
            )
    );
};

const insertProductOnCategories = async () => {
    const products = await Product.find();

    products.forEach(
        async (pro) =>
            await Category.findOneAndUpdate(
                { genre: pro.genre, name: pro.category },
                {
                    $push: {
                        products: pro,
                    },
                }
            )
    );
};
