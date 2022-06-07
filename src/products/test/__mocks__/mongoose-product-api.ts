import { productStub, PRODUCT_STUB_ID } from './product.stub';

export class MongooseproductApi {
  products = [
    productStub(PRODUCT_STUB_ID),
    productStub('626c07c021c78dd30f4deaab')
  ];

  find(field, value) {
    return this.products.find((product) => product[field] == value);
  }

  findById(id) {
    return this.products.find((product) => product._id == id);
  }


  findAll() {
    return null;
  }

  create(product) {
   return product;
  }

  findByIdAndUpdate(id, newObj, option) {
    return newObj;
  }
}