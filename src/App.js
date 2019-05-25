import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(16).fill(null),
      rows: 4,
      columns: 4,
      n: 4,
    }
  }

  changeValue(i, value) {
    const squares = this.state.squares.slice();
    squares[i] = value;
    this.setState({ squares: squares });
  }

  calculate() {
    console.log('Click');
  }

  render() {
    let squares = [];
    let letter = 'A';
    for (let i = 0; i < this.state.rows; i++) {
      squares.push(<br />);
      squares.push(<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled value={letter} />)
      letter = String.fromCharCode(letter.charCodeAt() + 1);
      for (let j = 0; j < this.state.columns; j++)
        squares.push(<input style={{ fontSize: 24 }} type='text' value={this.state.squares[i * 4 + j]} onChange={(event) => this.changeValue(i * 4 + j, event.target.value)} size='7' />);
    }

    let jobs = [<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled />];
    for (let i = 0; i < this.state.columns; i++)
      jobs.push(<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled value={i + 1} />);

    return (
      <div className="App">
        {/* <header className="App-header"> */}
        <h1>Chia công việc</h1>
        {jobs.map(item => item)}

        {squares.map(item => item)}
        {/* </header> */}
        <br />
        <button className="button" onClick={() => this.calculate()}><span>Tính </span></button>

        <h2>Kết quả:</h2>
        <h4>Nhân viên A:</h4>
        <h4>Nhân viên B: </h4>

      </div>
    );
  }
}

export default App;
