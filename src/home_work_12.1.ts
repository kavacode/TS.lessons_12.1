// Визначаємо інтерфейси для наших сутностей
interface Movie {
  title: string;
  releaseYear: number;
  rating: number;
  awards: string[];
}

interface Category {
  name: string;
  movies: Movie[];
}

// Визначаємо типи для наших фільтрів
type MatchFilter = {
  filter: string;
};

type RangeFilter = {
  filter: number;
  filterTo: number;
};

type ValueFilter = {
  values: string[];
};

// Об'єднуємо всі типи фільтрів в один
type Filter = MatchFilter | RangeFilter | ValueFilter;

// Визначаємо інтерфейси для наших списків
interface MovieList {
  movies: Movie[];
  filters: Filter[];
  applySearchValue: (value: string) => void;
  applyFiltersValue: (filters: Filter[]) => void;
}

interface CategoryList {
  categories: Category[];
  filters: Filter[];
  applySearchValue: (value: string) => void;
  applyFiltersValue: (filters: Filter[]) => void;
}
// Реалізація класу для роботи зі списком фільмів
class FilmList implements MovieList {
  movies: Movie[] = [];
  filters: Filter[] = [];

  applySearchValue(value: string): void {
    this.movies = this.movies.filter(movie => movie.title.includes(value));
  }

  applyFiltersValue(filters: Filter[]): void {
    this.filters = filters;
    this.filters.forEach(filter => {
      if ('filter' in filter && 'filterTo' in filter) {
        this.movies = this.movies.filter(movie => movie.releaseYear >= filter.filter && movie.releaseYear <= filter.filterTo);
      } else if ('filter' in filter) {
        this.movies = this.movies.filter(movie => movie.title.includes(filter.filter));
      } else if ('values' in filter) {
        this.movies = this.movies.filter(movie => filter.values.some(value => movie.awards.includes(value)));
      }
    });
  }
}

// Реалізація класу для роботи зі списком категорій фільмів
class FilmCategoryList implements CategoryList {
  categories: Category[] = [];
  filters: Filter[] = [];

  applySearchValue(value: string): void {
    this.categories = this.categories.map(category => ({
      ...category,
      movies: category.movies.filter(movie => movie.title.includes(value))
    }));
  }

  applyFiltersValue(filters: Filter[]): void {
    this.filters = filters;
    this.categories = this.categories.map(category => ({
      ...category,
      movies: category.movies.filter(movie => {
        return filters.every(filter => {
          if ('filter' in filter && 'filterTo' in filter) {
            return movie.releaseYear >= filter.filter && movie.releaseYear <= filter.filterTo;
          } else if ('filter' in filter) {
            return movie.title.includes(filter.filter);
          } else if ('values' in filter) {
            return filter.values.some(value => movie.awards.includes(value));
          }
          return true;
        });
      })
    }));
  }
}

// Використання класів
const filmList = new FilmList();
filmList.movies = [
  { title: "Movie 1", releaseYear: 2020, rating: 8, awards: ["Award 1"] },
  { title: "Movie 2", releaseYear: 2021, rating: 7, awards: ["Award 2", "Award 3"] },
  { title: "Movie 3", releaseYear: 2019, rating: 9, awards: [] },
];

const categoryList = new FilmCategoryList();
categoryList.categories = [
  { name: "Category 1", movies: filmList.movies },
  { name: "Category 2", movies: [] },
];

// Застосування фільтрації
filmList.applySearchValue("Movie 1");
console.log(filmList.movies);

filmList.applyFiltersValue([{ filter: 2020, filterTo: 2021 }]);
console.log(filmList.movies);

categoryList.applySearchValue("Movie");
console.log(categoryList.categories);

categoryList.applyFiltersValue([{ filter: 2020, filterTo: 2021 }]);
console.log(categoryList.categories);