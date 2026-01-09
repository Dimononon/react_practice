/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import { useState } from 'react';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const ALL_USERS_ID = 'all';

function findCategoryById(id) {
  return categoriesFromServer.find(category => category.id === id) || null;
}

function findUserById(id) {
  return usersFromServer.find(user => user.id === id) || null;
}

function getVisibleProducts(
  products,
  selectedUserId,
  query,
  selectedCategories,
) {
  let resultP = [...products];

  if (selectedUserId !== ALL_USERS_ID) {
    resultP = resultP.filter(product => product.user.id === selectedUserId);
  }

  if (query !== '') {
    resultP = resultP.filter(product => {
      const normalizedQuery = query.trim().toLowerCase();
      const normalizedName = product.name.toLowerCase();

      return normalizedName.includes(normalizedQuery);
    });
  }

  if (selectedCategories.length) {
    resultP = resultP.filter(product => {
      return selectedCategories.includes(product.categoryId);
    });
  }

  return resultP;
}

const products = productsFromServer.map(product => {
  const category = findCategoryById(product.categoryId);
  const user = category ? findUserById(category.ownerId) : null;

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(ALL_USERS_ID);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const visibleProducts = getVisibleProducts(
    products,
    selectedUserId,
    query,
    selectedCategories,
  );

  function handleResetButton() {
    setQuery('');
    setSelectedUserId(ALL_USERS_ID);
    setSelectedCategories([]);
  }

  function handleCategorySelect(id) {
    let resultCategoties = [...selectedCategories];

    if (selectedCategories.includes(id)) {
      resultCategoties = resultCategoties.filter(
        categoryId => categoryId !== id,
      );
    } else {
      resultCategoties.push(id);
    }

    setSelectedCategories(resultCategoties);
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href={`#/${ALL_USERS_ID}`}
                className={selectedUserId === ALL_USERS_ID ? 'is-active' : ''}
                onClick={() => setSelectedUserId(ALL_USERS_ID)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href={`#/${user.id}`}
                  className={user.id === selectedUserId ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query !== '' && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': selectedCategories.length,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategories.includes(category.id),
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {`${category.icon} - ${category.title}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleResetButton()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={`${product.user.sex === 'f' ? 'has-text-danger' : 'has-text-link'}`}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
