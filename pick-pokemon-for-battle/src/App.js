import React, { Component } from 'react'
import axios from 'axios'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typeInput: '',
      doubleDamageTypes: [],
    }
  }

  //using https://cors-anywhere.herokuapp.com
  //to bypass "Mixed Content" Error in Github Pages
  handleSubmit = (event) => {
    event.preventDefault();
    console.log('event: form submit', `"${this.state.typeInput}"`)
    this.setState({ doubleDamageTypes: [] })
    axios.get(`https://cors-anywhere.herokuapp.com/http://pokeapi.salestock.net/api/v2/type/${this.state.typeInput.toLocaleLowerCase().trim()}`)
      .then(response => response.data)
      .then(body => {
        return body.damage_relations.double_damage_from  //get double damage types
      })
      .then(dblDamage => {
        dblDamage.map((type) => {
          return axios.get(`https://cors-anywhere.herokuapp.com/${type.url}`)
            .then(response => response.data)
            .then(body => { //save data for all double damage types
              let doubleDamageTypes = this.state.doubleDamageTypes.slice(0)
              doubleDamageTypes.push(body)
              this.setState({
                doubleDamageTypes: doubleDamageTypes
              })
            })
        })
      }
      )
      .catch(err => {
        document.getElementById('errors').innerHTML = "Please enter a valid pokemon type"
      })
  }

  render() {
    const { doubleDamageTypes } = this.state
    return (
      <div>
        <div style={{ backgroundColor: 'red' }}>
          <br /><h1 style={{ color: 'white' }} >Double Damage Pokemon by Type</h1><br />
        </div>
        <div style={{ margin: 10 }}>
          <form onSubmit={this.handleSubmit}>
            <input type="text"
              value={this.state.typeInput}
              onChange={(event) => this.setState({ typeInput: event.target.value })}
              placeholder="Pokemon Type to Attack"
              required />
            <button type="submit">Submit</button>
            <div id="errors" style={{ backgroundColor: '#ffdddd', color: '#f70707', marginTop: 10 }}></div>
          </form>
          <div>
            {doubleDamageTypes.length > 0 && doubleDamageTypes.map((type, i) => {
              return (
                <div key={i}>
                  <h2>{type.name}</h2>
                  <div className="columns">
                    <ul>
                      {type.pokemon.map((pokemon, i) => {
                        return <li key={i}>{pokemon.pokemon.name}</li>
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    )
  }
}

export default App