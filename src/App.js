import React from 'react';
import logo from './logo.svg';
import './App.css';

const MAX_SIZE = Number.MAX_SAFE_INTEGER;

class App extends React.Component {
  constructor(props) {
    super(props);
    // const n = 4;
    const squares = [[18, 52, 64, 39], [75, 55, 19, 48], [35, 57, 8, 65], [27, 25, 14, 16]];
    // const squares = [[80, 120, 125], [20, 115, 145], [40, 100, 85], [65, 35, 25], [27, 25, 14]];
    // let squares = Array(n).fill('');
    // for (let i = 0; i < n; ++i) {
    //   squares[i] = new Array(n).fill('');
    // }
    this.state = {
      // squares: squares,
      rows: '',
      columns: '',
      error: '',
      // n: n,
    }
  }

  changeValue(i, j, value) {
    if (value.length === 0 || value.match(/^[0-9]+$/) != null) {
      const squares = this.state.squares.slice();
      squares[i][j] = value;
      if (value !== "")
        this.setState({ squares, error: undefined, results: undefined });
      else
        this.setState({ squares, error: 'Vui lòng nhập đủ các input', results: undefined })
    }
  }

  changeRows(rows) {
    if (rows.length === 0 || rows.match(/^[0-9]+$/) != null) {
      if (rows !== "") {
        if (this.state.columns !== "")
          this.setState({ rows: parseInt(rows), error: undefined });
        else
          this.setState({ rows: parseInt(rows), error: 'Vui lòng nhập số công việc' });
      }
      else
        this.setState({ rows, error: 'Vui lòng nhập số nhân viên' });
    }
  }

  changeColumns(columns) {
    if (columns.length === 0 || columns.match(/^[0-9]+$/) != null) {
      if (columns !== "") {
        if (this.state.rows !== "")
          this.setState({ columns: parseInt(columns), error: undefined });
        else
          this.setState({ columns: parseInt(columns), error: 'Vui lòng nhập số nhân viên' });
      }
      else
        this.setState({ columns, error: 'Vui lòng nhập số công việc' });
    }
  }

  make_matrix(n, val) {
    let matrix = Array(n).fill(val);
    for (let i = 0; i < n; ++i) {
      matrix[i] = new Array(n).fill(val);
    }

    return matrix;
  };

  findzero(squares, n, row, col) {
    for (let i = 0; i < n; ++i)
      for (let j = 0; j < n; ++j)
        if (squares[i][j] === 0 && !row[i] && !col[j])
          return [i, j];

    return [-1, -1];
  };

  step3(marked, n, col_covered) {
    let count = 0;
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        if (marked[i][j] === 1 && col_covered[j] === false) {
          col_covered[j] = true;
          count++;
        }
      }
    }
    return count >= n;
  }

  step5(Z0_r, Z0_c, path, n, marked, row_covered, col_covered) {
    let count = 0;

    path[count][0] = Z0_r;
    path[count][1] = Z0_c;
    let done = false;

    while (!done) {
      let row = this.find_star_in_col(path[count][1], n, marked);
      if (row >= 0) {
        count++;
        path[count][0] = row;
        path[count][1] = path[count - 1][1];
      } else {
        done = true;
      }

      if (!done) {
        var col = this.find_prime_in_row(marked, path[count][0], n);
        count++;
        path[count][0] = path[count - 1][0];
        path[count][1] = col;
      }
    }

    this.convert_path(marked, path, count);
    this.clear_covers(n, row_covered, col_covered);
    this.erase_primes();
  }

  convert_path(marked, path, count) {
    for (let i = 0; i <= count; ++i)
      marked[path[i][0]][path[i][1]] =
        (marked[path[i][0]][path[i][1]] === 1) ? 0 : 1;
  };

  clear_covers = function (n, row_covered, col_covered) {
    for (let i = 0; i < n; ++i) {
      row_covered[i] = false;
      col_covered[i] = false;
    }
  };

  erase_primes(marked, n) {
    for (let i = 0; i < n; ++i)
      for (let j = 0; j < n; ++j)
        if (marked[i][j] === 2)
          marked[i][j] = 0;
  }

  find_prime_in_row(marked, row, n) {
    for (let j = 0; j < n; ++j)
      if (marked[row][j] === 2)
        return j;
    return -1;
  };


  find_star_in_row(row, n, marked) {
    for (let j = 0; j < n; ++j)
      if (marked[row][j] === 1)
        return j;
    return -1;
  }

  find_star_in_col(col, n, marked) {
    for (let i = 0; i < n; ++i)
      if (marked[i][col] === 1)
        return i;

    return -1;
  };

  calculate() {

    //step 1
    let squares = [];
    const n = this.state.n;
    for (let i = 0; i < this.state.rows; i++)
      squares[i] = this.state.squares[i].slice();
    if (this.state.columns < this.state.rows) {
      for (let i = this.state.columns; i < this.state.rows; i++)
        for (let j = 0; j < n; j++)
          squares[j][i] = 0;
    }
    if (this.state.columns > this.state.rows) {
      for (let i = this.state.rows; i < this.state.columns; i++)
        squares[i] = Array(n).fill(0);
    }

    let row_covered = Array(n).fill(false);
    let col_covered = Array(n).fill(false);
    let marked = this.make_matrix(n, 0);

    let path = this.make_matrix(n * 2, 0);

    let Z0_r = 0;
    let Z0_c = 0;

    for (let i = 0; i < n; ++i) {
      const minval = Math.min.apply(Math, squares[i]);
      for (let j = 0; j < n; ++j)
        squares[i][j] -= minval;
    }

    //step 2
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        if (squares[i][j] === 0 && !col_covered[j] && !row_covered[i]) {
          marked[i][j] = 1;
          col_covered[j] = true;
          row_covered[i] = true;
          break;
        }
      }
    }

    this.clear_covers(n, row_covered, col_covered);

    //step 3

    while (!this.step3(marked, n, col_covered)) {

      //step 4
      let done = false;
      let row = -1, col = -1, star_col = -1;

      while (!done) {
        let z = this.findzero(squares, n, row_covered, col_covered);

        row = z[0];
        col = z[1];

        if (row < 0) {
          let minval = MAX_SIZE;
          for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j)
              if (!row_covered[i] && !col_covered[j])
                if (minval > squares[i][j])
                  minval = squares[i][j];
          }
          for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
              if (row_covered[i])
                squares[i][j] += minval;
              if (!col_covered[j])
                squares[i][j] -= minval;
            }
          }
        }
        else {
          marked[row][col] = 2;
          star_col = this.find_star_in_row(row, n, marked);
          if (star_col >= 0) {
            col = star_col;
            row_covered[row] = true;
            col_covered[col] = false;
          } else {
            Z0_r = row;
            Z0_c = col;

            this.step5(Z0_r, Z0_c, path, n, marked, row_covered, col_covered);

            break;
          }
        }
      }
    }
    let results = [];
    for (let i = 0; i < this.state.rows; ++i)
      for (let j = 0; j < this.state.columns; ++j)
        if (marked[i][j] === 1)
          results.push([i, j]);
    this.setState({ results });
  }



  render() {
    if (!this.state.n)
      return (
        <div className="App">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Chia công việc</h1>
          Số nhân viên:
          <input style={{ margin: 20, fontSize: 24, textAlign: 'center' }} type='text' value={this.state.rows} onChange={(event) => this.changeRows(event.target.value)} size='7' /> <br />
          Số công việc:
          <input style={{ margin: 20, fontSize: 24, textAlign: 'center' }} type='text' value={this.state.columns} onChange={(event) => this.changeColumns(event.target.value)} size='7' />
          <br />
          <button disabled={this.state.error !== undefined} className="button" onClick={() => {
            const n = this.state.rows > this.state.columns ? this.state.rows : this.state.columns;
            const squares = Array(n).fill(null);
            for (let i = 0; i < n; i++)
              squares[i] = Array(n).fill('');
            this.setState({ n, squares: squares });
          }}><span>Set </span></button>
          {this.state.error ? <h2 style={{ color: 'red', fontWeight: 'bold' }}>{this.state.error}</h2> : undefined}
        </div>

      );
    let squares = [];
    let letter = 'A';
    for (let i = 0; i < this.state.rows; i++) {
      squares.push(<br />);
      squares.push(<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled value={letter} />)
      letter = String.fromCharCode(letter.charCodeAt() + 1);
      for (let j = 0; j < this.state.columns; j++) {
        if (this.state.results) {
          const found = this.state.results.find(value => i === value[0] && j === value[1]);
          if (found) {
            squares.push(<input style={{ fontSize: 24, textAlign: 'center', color: 'red', }} type='text' value={this.state.squares[i][j]} onChange={(event) => this.changeValue(i, j, event.target.value)} size='7' />);
            continue;
          }
        }
        squares.push(<input style={{ fontSize: 24, textAlign: 'center' }} type='text' value={this.state.squares[i][j]} onChange={(event) => this.changeValue(i, j, event.target.value)} size='7' />);
      }
    }

    let jobs = [<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled />];
    for (let i = 0; i < this.state.columns; i++)
      jobs.push(<input type='text' style={{ fontSize: 24, textAlign: "center" }} name='field00' size='7' disabled value={i + 1} />);
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Chia công việc</h1>
        {jobs.map(item => item)}

        {squares.map(item => item)}
        <br />
        <button disabled={this.state.error !== undefined} className="button" onClick={() => this.calculate()}><span>Tính </span></button>
        {this.state.error ? <h2 style={{ color: 'red', fontWeight: 'bold' }}>{this.state.error}</h2> : <h2>Kết quả:</h2>}
        {this.state.results ? this.state.results.map(value => {
          const letter = 'A';
          const row = value[0];
          const col = value[1];
          const name = String.fromCharCode(letter.charCodeAt() + row);
          return (<h4>Nhân viên {name}: Công việc {col + 1}</h4>);
        }) : undefined}
      </div>
    );
  }
}

export default App;
