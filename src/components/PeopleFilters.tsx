import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { useSearchParams, Link } from 'react-router-dom';
import { getSearchWith } from '../utils/searchHelper';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sexFilter = searchParams.get('sex') || '';
  const centuries = useMemo(
    () => searchParams.getAll('centuries') || [],
    [searchParams],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = getSearchWith(
        searchParams,
        { query: event.target.value || null },
      );

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const toggleCenturies = useCallback((century: string) => {
    return getSearchWith(searchParams, {
      centuries: centuries.includes(century)
        ? centuries.filter(c => c !== century)
        : [...centuries, century],
    });
  }, [searchParams, centuries]);

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <Link
          className={classNames({ 'is-active': sexFilter === '' })}
          to={{
            search: getSearchWith(searchParams, { sex: null }),
          }}
        >
          All
        </Link>
        <Link
          className={classNames({ 'is-active': sexFilter === 'm' })}
          to={{
            search: getSearchWith(searchParams, { sex: 'm' }),
          }}
        >
          Male
        </Link>
        <Link
          className={classNames({ 'is-active': sexFilter === 'f' })}
          to={{
            search: getSearchWith(searchParams, { sex: 'f' }),
          }}
        >
          Female
        </Link>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            onChange={handleQueryChange}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {['16', '17', '18', '19', '20']
              .map(century => (
                <Link
                  data-cy="century"
                  className={classNames('button', 'mr-1', {
                    'is-info': centuries.includes(century),
                  })}
                  to={{
                    search: toggleCenturies(century),
                  }}
                >
                  {century}
                </Link>
              ))}
          </div>

          <div className="level-right ml-4">
            <Link
              data-cy="centuryALL"
              className={classNames('button', 'is-success', {
                'is-outlined': !!centuries.length,
              })}
              to={{
                search: getSearchWith(searchParams, { centuries: null }),
              }}
            >
              All
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <Link
          className="button is-link is-outlined is-fullwidth"
          to={{
            search: getSearchWith(searchParams, {
              centuries: null,
              sex: null,
              query: null,
            }),
          }}
        >
          Reset all filters
        </Link>
      </div>
    </nav>
  );
};