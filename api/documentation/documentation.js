/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      description: The user's email
 *                      required: true
 *                  password:
 *                      type: string
 *                      description: The user's password
 *                      required: true
 *                  username:
 *                      type: string
 *                      description: The user's username
 *                      required: true
 *                  img:
 *                      type: string
 *                      description: The user profile's image
 *                      required: false
 *                  name:
 *                      type: string
 *                      description: The user's name
 *                      required: false
 *                  surname:
 *                      type: string
 *                      description: The user's surname
 *                      required: false
 *                  age:
 *                      type: string
 *                      description: The user's age
 *                      required: false
 *                  userBuys:
 *                      type: array
 *                      description: The products list bought by the user
 *                      required: false
 *                  userFavs:
 *                      type: array
 *                      description: The products list added by the user to the fav list
 *                      required: false
 *          Shop:
 *              type: object
 *              properties:
 *                  genre:
 *                      type: array
 *                      description: The list of genres
 *                      required: false
 *                  lastBuys:
 *                      type: array
 *                      description: The list of last products bought
 *                      required: false
 *                  mostValuated:
 *                      type: array
 *                      description: The list of products most valuated
 *                      required: false
 *                  mostCommented:
 *                      type: array
 *                      description: The list of products most commented
 *                      required: false
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The price of the product
 *                      required: true
 *                  brand:
 *                      type: string
 *                      description: The brand name
 *                      required: true
 *                  genre:
 *                      type: string
 *                      description: The genre of the product
 *                      required: true
 *                  title:
 *                      type: string
 *                      description: The title of the product
 *                      required: true
 *                  price:
 *                      type: integer
 *                      description: The price of the product
 *                      required: true
 *                  img:
 *                      type: array
 *                      description: The images list of the product
 *                      required: true
 *                  description:
 *                      type: string
 *                      description: The description of the product
 *                      required: true
 *                  units:
 *                      type: integer
 *                      description: The units on stock of the product
 *                      required: true
 *                  sizes:
 *                      type: string
 *                      description: The sizes of the product
 *                      required: true
 *                  value:
 *                      type: integer
 *                      description: The value of the product
 *                      required: true
 *                  comments:
 *                      type: array
 *                      description: The commentaries list of the product
 *                      required: false
 *          Genre:
 *              type: object
 *              properties:
 *                  genre:
 *                      type: string
 *                      description: The genre name
 *                      required: true
 *                  brands:
 *                      type: array
 *                      description: The brands list
 *                      required: true
 *          Brand:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The brand name
 *                      required: true
 *                  genre:
 *                      type: string
 *                      description: The genre of the products
 *                      required: true
 *                  products:
 *                      type: array
 *                      description: The products list on the brand
 *                      required: true
 *
 */

/**
 * @swagger
 *    servers:
 *    - url: https://sneakersecommerceapi.vercel.app/
 *
 */

/**
 * @swagger
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    security:
 *       -JWT: []
 *    securityDefinitions:
 *        JWT:
 *          type: apiKey
 *          in: header
 *          name: access_token
 *
 */

/**
 * @swagger
 *  tags:
 *    - name: User
 *      description: The User routes
 *    - name: Shop
 *      description: The Shop routes
 *    - name: Product
 *      description: The Product routes
 *
 */

/**
 * @swagger
 * /user/{id}:
 *    get:
 *      summary: Get user by id and show the user detail
 *      tags: [ User ]
 *      operationId: detailUser
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id that needs to be showed
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      responses:
 *          200:
 *              description: The User finded
 *          400:
 *              description: User not found
 */

/**
 * @swagger
 * /user/register:
 *    post:
 *      summary: Register an User
 *      tags: [ User ]
 *      requestBody:
 *        description: The request body needs the email, the password and the username
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      description: The email of the user
 *                      example: emailExample@email.com
 *                      required: true
 *                  password:
 *                      type: string
 *                      description: The password of the user
 *                      example: 1234
 *                      required: true
 *                  username:
 *                      type: string
 *                      description: The username or nickname of the user
 *                      example: username
 *                      required: true
 *      responses:
 *          200:
 *              description: The User is successfully registered
 *          400:
 *              description: The User is not registered
 */

/**
 * @swagger
 * /user/login:
 *    post:
 *      summary: Login an User
 *      tags: [ User ]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        description: The request body needs the email, the password
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      description: The email of the user
 *                      example: emailExample@email.com
 *                      required: true
 *                  password:
 *                      type: string
 *                      description: The password of the user
 *                      example: 1234
 *                      required: true
 *      responses:
 *          200:
 *              description: The User is successfully logged
 *          400:
 *              description: The User is not registered
 */

/**
 * @swagger
 * /user/logout:
 *    post:
 *      summary: Logout an User
 *      tags: [ User ]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: The User is successfully logged out
 *          400:
 *              description: The User is not registered
 */

/**
 * @swagger
 * /user/{id}:
 *    post:
 *      summary: Edit the User profile information
 *      tags: [ User ]
 *      consumes:
 *        - multipart/form-data
 *      produces:
 *        - application/json
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id to be edited
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *          content:
 *            multipart/form-data:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    required: true
 *                    description: The username
 *                  img:
 *                    type: file
 *                    required: false
 *                    description: The image profile
 *                  name:
 *                    type: string
 *                    required: false
 *                    description: The name of the user
 *                  surname:
 *                    type: string
 *                    required: false
 *                    description: The surname of the user
 *                  age:
 *                    type: integer
 *                    required: false
 *                    description: The age of the user
 *      responses:
 *          200:
 *              description: The user is successfully edited
 *          400:
 *              description: The user is not edited
 */

/**
 * @swagger
 * /user/buy/{id}:
 *    post:
 *      summary: The user buy a product route
 *      tags: [ Product ]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *        description: The product's id and the quantity of product that the user is buying
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: The product Id that the user is buying
 *                      example: 627ea1a8ad47587d433279b2
 *                      required: true
 *                  quantity:
 *                      type: string
 *                      description: The quantity of product that the user is buying
 *                      example: 1
 *                      required: true
 *      responses:
 *          200:
 *              description: The product has been bought
 *          400:
 *              description: The product is not bought
 */

/**
 * @swagger
 * /user/fav/{id}:
 *    post:
 *      summary: The user add to fav list a product route
 *      tags: [ Product ]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *        description: The product's id added to fav list
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: The product Id that the user is adding to the fav list
 *                      example: 627ea1a8ad47587d433279b2
 *                      required: true
 *      responses:
 *          200:
 *              description: The product has been added to fav list
 *          400:
 *              description: The product is not added
 */

/**
 * @swagger
 * /user/comment/{id}:
 *    post:
 *      summary: The user add a commentary to a product
 *      tags: [ Product ]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *        description: The product's id and the content of the commentary
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: The product Id that the user adding a commentary
 *                      example: 627ea1a8ad47587d433279b2
 *                      required: true
 *                  content:
 *                      type: string
 *                      description: The content of the commentary
 *                      example: The product is so good
 *                      required: true
 *      responses:
 *          200:
 *              description: The commentary has been added correctly
 *          400:
 *              description: The commentary is not added
 */

/**
 * @swagger
 * /user/fav/{id}:
 *    delete:
 *      summary: The user delete to fav list a product route
 *      tags: [ Product ]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *        description: The product's id deleted from the fav list
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: The product Id that the user is deleting from the fav list
 *                      example: 627ea1a8ad47587d433279b2
 *                      required: true
 *      responses:
 *          200:
 *              description: The product has been deleted to fav list
 *          400:
 *              description: The product is not deleted
 */

/**
 * @swagger
 * /user/comment/{id}:
 *    delete:
 *      summary: The user delete a commentary to a product
 *      tags: [ Product ]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The user's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627fc760b2262c5f62efcbd6
 *      requestBody:
 *        description: The product's id and the content of the commentary
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: The product Id that the user is deleting a commentary
 *                      example: 627ea1a8ad47587d433279b2
 *                      required: true
 *      responses:
 *          200:
 *              description: The commentary has been deleted correctly
 *          400:
 *              description: The commentary is not deleted
 */

/**
 * @swagger
 * /home:
 *    get:
 *      summary: Return the home data
 *      tags: [ Shop ]
 *      responses:
 *          200:
 *              description: The home data is showed
 *          400:
 *              description: The home data is not showed
 */

/**
 * @swagger
 * /products:
 *    get:
 *      summary: The products list
 *      tags: [ Shop ]
 *      parameters:
 *        - in: query
 *          name: genre
 *          description: The genre about the products
 *          required: true
 *          schema:
 *              type: string
 *              enum: [Man, Woman]
 *        - in: query
 *          name: brand
 *          description: The brand name of the product
 *          required: true
 *          schema:
 *              type: string
 *              enum: [Nike, Adidas, Puma, Reebok]
 *      responses:
 *          200:
 *              description: The products list is showed
 *          400:
 *              description: The products list is not showed
 */

/**
 * @swagger
 * /product/{id}:
 *    get:
 *      summary: The products detail info
 *      tags: [ Shop ]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The product's id
 *          required: true
 *          schema:
 *              type: string
 *          example: 627ea1a8ad47587d433279b2
 *      responses:
 *          200:
 *              description: The products detail is showed
 *          400:
 *              description: The products detail is not showed
 */
