import { MongooseModule } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import config  from '../../config/keys'
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsModule } from '../products.module';
import { ProductClass } from '../schemas/product.schema';

describe('ProductController', () => {
  let app: NestExpressApplication;

  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(config.mongoURI), ProductsModule],

    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.listen(3333);
  });

  afterAll(async () => {
    await app.close();
  });

  test('creates a product', async () => {
    const productCreateDto: CreateProductDto = {
      name: 'ASUS',
      qty : 80,
      description: 'Best pcs',
      }
    const createdProduct = await apiClient()
      .post('/products')
      .send(productCreateDto)
      .expect(201);
    expect(createdProduct.body.qty).toEqual(productCreateDto.qty);
    const products: ProductClass[] = (await apiClient().get('/products')).body;
    expect(products.length).toBe(3);
    expect(products[products.length - 1].qty).toEqual(productCreateDto.qty);
  });

  test('deleteProductById', async () => {
    const products: ProductClass[] = (await apiClient().get('/products')).body;
    expect(products.length).toBe(3);
    const deletedProduct = await apiClient()
      .delete(`/products/${products[products.length - 1]._id}`)
      .expect(200);
    expect(deletedProduct.body).toEqual({ deletedCount: 1 });
  });

  test('getAllProducts', async () => {
    await apiClient().get('/products').expect(200);
    const products: ProductClass[] = (await apiClient().get('/products')).body;
    expect(products.length).toEqual(2);
    expect(products[0]._id).toEqual('626c07c021c78dd30f4def89');
    expect(products[1]._id).toEqual('626c07eea92d7fcab7cff01b');
  });

  test('getProduct by id', async () => {
    await apiClient().get('/product/629fd6346dc05c5cd0e9f879').expect(200);
    const product: ProductClass = (await apiClient().get('/products/629fd6346dc05c5cd0e9f879'))
      .body;
    expect(product._id).toEqual('629fd6346dc05c5cd0e9f879');
    expect(product.qty).toEqual(15);
  });

  test('getProduct by non existing id', async () => {
    await apiClient().get('/products/626c07c021c78dd30f4def87').expect(200);
    const product: ProductClass = (await apiClient().get('/products/626c07c021c78dd30f4def65'))
      .body;
    expect(product).toEqual({});
  });

  test('getProduct by non valid id', async () => {
    await apiClient().get('/products/azers').expect(412);
  });

  test('updateProductById', async () => {
    let products: ProductClass[] = (await apiClient().get('/product')).body;
    expect(products.length).toEqual(2);
    const updatedProduct = await apiClient()
      .post(`/product/${products[products.length - 1]._id}`)
      .send({
        fullAddress: {
          address: 'Sousse',
          city: 'Sousse',
          country: 'Tunis',
          postalCode: '8957',
        },
      })
      .expect(201);
    expect(updatedProduct.body.fullAddress).toEqual({
      address: 'Sousse',
      city: 'Sousse',
      country: 'Tunis',
      postalCode: '8957',
    });
    expect(updatedProduct.body._id).toEqual(products[products.length - 1]._id);
    expect(updatedProduct.body.email).toEqual(products[products.length - 1].qty);
    products = (await apiClient().get('/product')).body;
    expect(products.length).toBe(2);
  });
});