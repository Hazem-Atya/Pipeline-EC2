/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { assert } from 'console';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../interfaces/product.interface';
import { ProductsService } from '../products.service';
import { ProductClass } from '../schemas/product.schema';
import { MongooseproductApi } from './__mocks__/mongoose-product-api';
import { productStub, PRODUCT_STUB_ID } from './__mocks__/product.stub';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: Model<ProductClass>;
  beforeEach(async () => {
    const MongooseApiServiceProvider = {
      provide: getModelToken(ProductClass.name),
      useClass: MongooseproductApi,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ProductsService, MongooseApiServiceProvider],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockProductModel = module.get<Model<ProductClass>>(getModelToken(ProductClass.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be call the create method in the model', () => {
    expect(service.create).toBeDefined();
  });

  describe('createProduct', () => {
    describe('when createProduct is called', () => {
      let createProductDto: CreateProductDto;
      let createExistingProductDto: CreateProductDto;
      beforeEach(async () => {
        createProductDto =productStub(
          '626c07c021c78dd30f4deaab',
        );
        createExistingProductDto = productStub(PRODUCT_STUB_ID);
      });

      test('then it should return created Product', async () => {
        const product = await service.create(createProductDto);
        const expectedProduct = productStub(
          '626c07c021c78dd30f4deaab'
        );
        expect({ ...expectedProduct }).toEqual({
          ...product,
        });
      });
    });
  });

  describe('updateProduct', () => {
    describe('when updateProduct is called', () => {
      let updateProductDto: CreateProductDto;
      let updateUnexistingProductDto: CreateProductDto;
      let updateExistingDto: CreateProductDto;

      beforeEach(async () => {
        updateProductDto = productStub(PRODUCT_STUB_ID);
        updateUnexistingProductDto = productStub(
          '626c07c021c78dd30f4deabb',
        );
        updateExistingDto = productStub(PRODUCT_STUB_ID);
      });

      test('then it should throw an exception if product does not exists', async () => {
        try {
          await service.update(
            '626c07c021c78dd30f4deabb',
            updateUnexistingProductDto,
          );
        } catch (error) {
          expect(error.response).toEqual('Product with this ID is inexisting');
          expect(error.status).toEqual(412);
        }
      });


      test('then it should return updated product if everything ok', async () => {
        const product = await service.update(PRODUCT_STUB_ID, updateProductDto);
        expect(product).toEqual(productStub(PRODUCT_STUB_ID));
      });
    });
  });
});