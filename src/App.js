import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import {Container, Row, Col, Button} from 'reactstrap'

class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      searchPhrase: 'trump',
      searchCountry: '',
      searchLanguage:'',
      searchSources: '',
      searchCategories:'',
      searchResult:[]
    }
    
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.search = this.search.bind(this)
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  
  handleSubmit (event) {
    this.search(this.state.searchPhrase)
    event.preventDefault();
  }


  search (searchKey) {
    var url = 'https://newsapi.org/v2/everything?' +
              'q='+ searchKey +'&' +
              'from=2018-07-12&' +
              'sortBy=popularity&' +
              'apiKey=7ef307c1f48e47b1bd67089de81e2b63'


    axios.get(url)
      .then( response => {
        var json = response.data.articles
        var arr = []
        Object.keys(json).forEach(function(key) {
          arr.push(json[key])
        })
        this.setState({ searchResult: arr})
      })
      .catch(function (error) {
        console.log(error);
      });
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

              <div className="more text-center my-5">
                <Button color="primary" className="">Load more...</Button>
              </div>
              
            </div>

        </Container>
      </div>
    );
  }
}

export default App;
