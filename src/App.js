import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='
// const URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;

/**
 * @const {Array} list
 */
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

/**
 * This is a higher order function
 * @param {string} searchTerm - The searched term.
 * @return {function}
 */
const isSearched = (searchTerm) => (item) => {
  return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())
}

/**
 * The App entry point
 * @extends Component
 */
class App extends Component {
  state = {
    list,
    result: null,
    searchTerm: DEFAULT_QUERY,
  }

  setTopStories(result) {
    this.setState({ result })
  }

  fetchTopStories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  onDismiss = (id) => {
    const updatedResult = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: { ...this.result, hits: updatedResult }
    });
  }

  onSearchChange = (e) => {
    this.setState({searchTerm: e.target.value});
  }

  onSearchSubmit = (e) => {
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    e.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0
    console.log('searchTerm', searchTerm)
    console.log(result);

    return (
      <div  className="page">
        <div className="interactions">
          {/* <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>{helloWorld}</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p> */}
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>

        { result &&
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Pagination
            page={page}
            prevClick={() => this.fetchTopStories(searchTerm, page - 1)}
            nextClick={() => this.fetchTopStories(searchTerm, page + 1)}
          />
        </div>
      </div>
    );
  }
}

const Pagination = ({ onClick, page, prevClick, nextClick }) => (
  <div>
    { page
      ? <Button onClick={prevClick}>
          Back
        </Button>
      : null
    }

    <Button onClick={nextClick}>
      More
    </Button>
  </div>
);

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url} target="_blank">{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            className="button-inline"
            onClick={() => onDismiss(item.objectID)}>
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>
);

const Button = ({className, onClick, children}) => (
  <button
    type="button"
    className={className}
    onClick={onClick}
  >
    {children}
  </button>
);

export default App;
