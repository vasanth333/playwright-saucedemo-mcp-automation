import * as fs from 'fs';
import * as path from 'path';

export interface User {
  username: string;
  password: string;
  userType: string;
  description: string;
  expectedError?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  imageName: string;
  category: string;
}

export interface SortOption {
  value: string;
  text: string;
  type: string;
  default?: boolean;
}

export class TestDataLoader {
  private static instance: TestDataLoader;
  private usersData: any;
  private productsData: any;

  private constructor() {
    this.loadData();
  }

  public static getInstance(): TestDataLoader {
    if (!TestDataLoader.instance) {
      TestDataLoader.instance = new TestDataLoader();
    }
    return TestDataLoader.instance;
  }

  private loadData(): void {
    try {
      const usersPath = path.join(__dirname, 'users.json');
      const productsPath = path.join(__dirname, 'products.json');
      
      this.usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      this.productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load test data: ${error}`);
    }
  }

  // User methods
  public getValidUsers(): User[] {
    return this.usersData.validUsers;
  }

  public getInvalidUsers(): User[] {
    return this.usersData.invalidUsers;
  }

  public getUserByType(userType: string): User | undefined {
    const allUsers = [...this.usersData.validUsers, ...this.usersData.invalidUsers];
    return allUsers.find(user => user.userType === userType);
  }

  public getStandardUser(): User {
    return this.getUserByType('standard')!;
  }

  // Product methods
  public getProducts(): Product[] {
    return this.productsData.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.productsData.products.find((product: Product) => product.id === id);
  }

  public getProductsByCategory(category: string): Product[] {
    return this.productsData.products.filter((product: Product) => product.category === category);
  }

  public getSortOptions(): SortOption[] {
    return this.productsData.sortOptions;
  }

  public getDefaultSortOption(): SortOption {
    return this.productsData.sortOptions.find((option: SortOption) => option.default) || this.productsData.sortOptions[0];
  }

  public getProductsSortedByPrice(ascending: boolean = true): Product[] {
    const products = [...this.getProducts()];
    return products.sort((a, b) => 
      ascending ? a.priceValue - b.priceValue : b.priceValue - a.priceValue
    );
  }

  public getProductsSortedByName(ascending: boolean = true): Product[] {
    const products = [...this.getProducts()];
    return products.sort((a, b) => 
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }
}