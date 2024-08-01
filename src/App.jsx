/* eslint-disable-next-line jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categ => categ.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState(products);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [visibleCaategory, setVisibleCaategories] = useState('All');

  const preparedProducts = visibleProducts.filter(({ name }) =>
    name.toLowerCase().trim().includes(query.toLowerCase().trim()),
  );

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
                href="#/"
                className={classNames({
                  'is-active': currentFilter === 'All',
                })}
                onClick={() => {
                  setVisibleProducts(products);
                  setCurrentFilter('All');
                }}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => (
                <>
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={id}
                    className={classNames({
                      'is-active': name === setCurrentFilter,
                    })}
                    onClick={() => {
                      const userProducts = products.filter(
                        ({ user }) => user.name === name,
                      );

                      setVisibleProducts(userProducts);
                      setCurrentFilter(name);
                    }}
                  >
                    {name}
                  </a>
                </>
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
                  <i className="fas fa-search" aria-hidden="false" />
                </span>

                {query && (
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
                className={classNames('button is-success mr-6', {
                  'is-outlined': visibleCaategory !== 'All',
                })}
                onClick={() => setVisibleCaategories('All')}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                const { id, title } = category;

                return (
                  <a
                    data-cy="Category"
                    href="#/"
                    key={id}
                    className={classNames('button mr-2 my-1', {
                      'is-info': visibleCaategory === category.title,
                    })}
                    onClick={() => setVisibleCaategories(title)}
                  >
                    {title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setVisibleProducts(products);
                  setCurrentFilter('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {preparedProducts.length === 0 ? (
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
                {preparedProducts.map(product => {
                  const { id, name, user, category } = product;

                  return (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': user.sex === 'm',
                          'has-text-danger': user.sex === 'f',
                        })}
                      >
                        {name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
