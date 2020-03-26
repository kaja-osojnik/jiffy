import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

const Header = ({clearSearch, hasResults}) => (
    <div className="header grid">
        {hasResults ? <button onClick={clearSearch}><img src={clearButton} onClick={clearSearch} /> </button> : <h1 className="title">Jiffy</h1> }
    </div>
)

const UserHint = ({loading, hintText}) => (
    <div className="user-hint">
        {loading ? <img className="blokc mx-auto" src={loader}/> : hintText}
    </div>
)


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: []
    }
  }

  //function that searcher feor api giphy fetch search term puts search tern into queryURL
  searchGiphy = async (searchTerm) => {
    this.setState({
      loading: true
    })

    try{
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=W4K2wJAYolMWrcIDHHYzDV9DoEsApezH&q=${searchTerm}&limit=40&offset=0&rating=PG&lang=en`);
        const {data} = await response.json();


        if(!data.length) {
          throw `Nothing found for ${searchTerm}`
        }

        // get random gify from fetched array
        const randomGif = randomChoice(data)

        console.log({randomGif})
        this.setState((prevState, props) =>({
          ...prevState,
          gif: randomGif,
          gifs: [...prevState.gifs, randomGif],
          loading: false,
          hintText: `Hit enter to see more ${searchTerm}`
        }))
    } catch(error) {
      // it there is no result for a adkfjhaldkjfh search WHAT TO DO
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
      console.log(error);

    }

  }


  handleChange = event => {
    // same as const value = event.target.value
    const {value} = event.target
    this.setState((prevState, props) => ({
        ...prevState,
        searchTerm: value,
        hintText: value.length > 2 ? `Hit Enter to search ${value}` : ""
    }))
    
  }

  handleKeyPress = event => {
    const {value} = event.target

    if(value.length>2 && event.key === 'Enter'){
        this.searchGiphy(value)
    }
  }

  // when we have 2 or more chars and pressed enter run a search

  //here we reset out state
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))

    //focus cursor back into search
    this.textInput.focus();
  }

  render(){
    const {searchTerm, gifs} = this.state
    const hasResults = gifs.length

    return(
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>

        <div className="search grid">
            {this.state.gifs.map(gif =>  
                <Gif {...gif} />
              )}
          
            <input className="input grid-item" placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
            />
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}

export default App;
