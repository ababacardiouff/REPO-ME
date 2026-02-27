config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 50
    - duration: 120
      arrivalRate: 200
scenarios:
  - name: "Search and Add to Cart"
    flow:
      - get:
          url: "/api/search?query=pizza"
      - post:
          url: "/api/cart/add"
          json:
            productId: 1
            quantity: 1
            userId: "test-user-{{ $randomInt(1,200) }}"
