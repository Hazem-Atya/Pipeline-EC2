import { Model } from 'mongoose';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { ProductClass } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductClass.name)
    private productModel: Model<ProductClass>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productModel.findOne({ _id: id });
  }

  async create(product: Product): Promise<Product> {
    // const newProduct = new this.productModel(product);
    // return await newProduct.save();
    return await this.productModel.create(product)
  }

  async delete(id: string): Promise<Product> {
    return await this.productModel.findByIdAndRemove(id);
  }

  async update(id: string, product: Product): Promise<Product> {
    const newProd = await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!newProd) {
      throw new PreconditionFailedException('Product with this ID is inexisting');
    }
    return newProd;
  }
}
