import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import {Container, Row, Col} from 'reactstrap'
import md5 from 'md5'
import ReadMoreButton from './components/ReadMoreButton'

class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      searchPhrase: 'trump',
      searchCountry: '',
      searchLanguage:'',
      searchSources: '',
      searchCategories:'',
      searchResult:[],
      searchPage:1,
      searchPageSize: 100,
      searchTotalResult:null
    }
    
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.generateUIDfromJSON = this.generateUIDfromJSON.bind(this)
    this.searchResponseCallback = this.searchResponseCallback.bind(this)
    this.saveArticleInLocalstorage = this.saveArticleInLocalstorage.bind(this)
    this.loadMoreHeandler = this.loadMoreHeandler.bind(this)
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(target.type)

    this.setState({
      [name]: value
    })
  }
  
  handleSubmit (event) {
    this.getSearchResults(this.state.searchPhrase, this.state.searchPage, this.searchResponseCallback)
    event.preventDefault();
  }


  getSearchResults (searchKey, page, callback) {

    var that = this;

    var searchBy
    if (that.searchPage === 1) {
      searchBy = searchKey
      that.setState({
        searchPhrase: searchBy
      })
    }
    else {
      searchBy = that.state.searchPhrase
    }

    var url = 'https://newsapi.org/v2/everything?' +
              'q='+ searchBy +'&' +
              'page='+ page +'&' +
              'from=2018-07-12&' +
              'sortBy=popularity&' +
              'pageSize='+ this.state.searchPageSize +'&' +
              'apiKey=7ef307c1f48e47b1bd67089de81e2b63'


    axios.get(url)
      .then( function (response) {
        callback.call(that,response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  generateUIDfromJSON (json) {
     return md5(JSON.stringify(json))
  }

  searchResponseCallback (searchResult) {

    var that = this
    var json = searchResult.articles

    if (that.state.searchTotalResult === null) {
        that.state.searchTotalResult = searchResult.totalResults
        console.log(searchResult.totalResults)
    }

    var arr = that.state.searchResult;
    Object.keys(json).forEach(function(key) {

      const currentItem = json[key]
      currentItem["isSaved"] = false;

      //save in to array
      arr.push(currentItem)
    })

    var currentPage = this.state.searchPage+1
    this.setState({ 
      searchResult: arr,
      searchPage: currentPage
    })
  }

  loadMoreHeandler () {
    var nextPage = this.state.searchPage + 1
    this.getSearchResults(this.state.searchPhrase, nextPage, this.searchResponseCallback)
  }

  saveArticleInLocalstorage (articleJsonObj) {

    //generate UID
    const UID = this.generateUIDfromJSON(articleJsonObj);

    if (window.localStorage.getItem(UID) === null) {
      //We need to save item

      window.localStorage.setItem(UID, JSON.stringify(articleJsonObj))
    }
    else {
      //Check item as selected
    }

  }

  componentWillUpdate = (nextProps, nextState) => {
    this.currentPage = nextState.searchPage
  }
  


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Searchnews</h1>
        </header>
        <Container className="App-intro py-5">

            <form className="form-inline" onSubmit={this.handleSubmit}>
            
              <label className="sr-only" htmlFor="search-term">Search</label>
              <input 
                type="text" 
                className="form-control mb-2 mr-sm-2" 
                id="search-term" 
                placeholder="Search" 
                name="searchPhrase" 
                value={this.state.searchPhrase}
                onChange={this.handleInputChange} />
              <button type="submit" className="btn btn-primary mb-2" >Search</button>

            </form>

            <div className="search-result">

              {this.state.searchResult.map( (item, index) => 
                  <div className="media border p-3 mb-3" ref={index} key={index}>              
                    <Row>
                      <Col xs="12" md="3">
                        <div className="media__thumb">
                          <input type="checkbox" className="media__checkbox" />
                          <img src={item.urlToImage} alt={item.author} className="img-fluid"  />
                        </div>
                      </Col>
                      <Col xs="12" md="9">
                        <div className="media-body">
                          <div className="media__title">{item.title}</div>
                          <div className="media__description py-3">{item.description}</div>
                          <Row className="media__footer">
                            <Col xs="6">
                              <div className="text-itelic">
                                <span className="media__date">{item.publishedAt.substring(0, 10)}</span>
                                <span className="px-3">/</span>
                                <span className="media__author">{item.author}</span>
                              </div>
                            </Col>
                            <Col xs="6" className="text-right">
                              <i>source:</i> <a href={item.url} target="_blank">{item.source.name}</a>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>
              )}

              <ReadMoreButton clickHandler={this.loadMoreHeandler} currentPage={this.currentPage} totalResults={this.state.searchTotalResult} pageSize={this.state.searchPageSize} />
              
            </div>

        </Container>
      </div>
    );
  }
}

export default App;
