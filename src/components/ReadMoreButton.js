import React, { Component } from 'react'
import {Button} from 'reactstrap'

export class ReadMoreButton extends Component {

    constructor(props) {
      super(props)

    }
    
    componentWillUpdate = (nextProps, nextState) => {
      
        this.currentPage = nextProps.currentPage
        this.totalPages = Math.round(nextProps.totalResults / nextProps.pageSize) 

        if ( this.currentPage> 1 ){
           this.isVisible = true
        }
        
    }
    

  render() {
    if (this.isVisible) {
        return (
            <div className="more text-center my-5">
                <Button color="primary" onClick={this.props.clickHandler}>({this.currentPage} out of {this.totalPages}) Load more...</Button>
            </div>
        )
    }
    else {
        return null
    }
  }
}

export default ReadMoreButton
