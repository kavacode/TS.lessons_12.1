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
