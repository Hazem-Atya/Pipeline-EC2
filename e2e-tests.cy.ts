describe('Product CRUD', () => {
  before(() => {
    cy.request('/').then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  let products = [];
  let length = 0;
  it('Getting all products', () => {
    cy.request('products').then((response) => {
      expect(response.status).to.eq(200);
      products = response.body;
      length = response.body.length;
    });
  });

  it('get product by id', () => {
    cy.request(`products/${products[length - 1]._id}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('_id', products[length - 1]._id);
    });
  });

  it('getUser by non existing id', () => {
    cy.request(`products/626c07c021c78dd30f4def87`).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(response.body);
      expect(response.body).to.eq('');
    });
  });

  it('getUser by non valid id', () => {
    cy.request({ url: `product/azers`, failOnStatusCode: false }).then(
      (response) => {
        expect(response.status).to.eq(412);
      },
    );
  });

  const productCreateDto = {
      name: 'ASUS',
      qty : 80,
      description: 'Best pcs',
  };
  let createdProductId;
  it('create a product', () => {
    cy.request('POST', 'product', productCreateDto).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      cy.request('product').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(length + 1);
      });
      createdProductId = response.body._id;
    });
  });

  it('update product by id', () => {
    cy.request('PUT', `/products/${createdProductId}`, {
      qty:30
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.qty).to.eq(30);
      expect(response.body._id).to.eq(createdProductId);
      expect(response.body.qty).to.eq(productCreateDto.qty);
    });
  });

  it('delete product by id', () => {
    cy.request('DELETE', `products/${createdProductId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('_id').to.eq(createdProductId);
      cy.request('product').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(length);
      });
    });
  });
});