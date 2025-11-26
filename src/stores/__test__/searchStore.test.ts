import { searchStore } from '../searchStore';

describe('searchStore', () => {
  beforeEach(() => {
    // Reset store state
    searchStore.setState({
      categoryId: null,
      categoryName: null,
      searchQuery: null,
    });
  });

  it('initializes with null values', () => {
    const state = searchStore.getState();
    expect(state.categoryId).toBeNull();
    expect(state.categoryName).toBeNull();
    expect(state.searchQuery).toBeNull();
  });

  it('sets category correctly', () => {
    searchStore.getState().setCategory('1', 'Electronics');

    const state = searchStore.getState();
    expect(state.categoryId).toBe('1');
    expect(state.categoryName).toBe('Electronics');
  });

  it('sets search query correctly', () => {
    searchStore.getState().setSearchQuery('test query');

    const state = searchStore.getState();
    expect(state.searchQuery).toBe('test query');
  });

  it('clears category correctly', () => {
    // First set a category
    searchStore.getState().setCategory('1', 'Electronics');

    // Then clear it
    searchStore.getState().clearCategory();

    const state = searchStore.getState();
    expect(state.categoryId).toBeNull();
    expect(state.categoryName).toBeNull();
  });

  it('clears search correctly', () => {
    // First set a search query
    searchStore.getState().setSearchQuery('test');

    // Then clear it
    searchStore.getState().clearSearch();

    const state = searchStore.getState();
    expect(state.searchQuery).toBeNull();
  });

  it('clears all correctly', () => {
    // First set values
    searchStore.getState().setCategory('1', 'Electronics');
    searchStore.getState().setSearchQuery('test');

    // Then clear all
    searchStore.getState().clearAll();

    const state = searchStore.getState();
    expect(state.categoryId).toBeNull();
    expect(state.categoryName).toBeNull();
    expect(state.searchQuery).toBeNull();
  });
});
