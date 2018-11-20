function Square(props) {   
  return (
    <button className={`square ${props.winning ? 'winning-square' : ''}`} onClick={() => props.onClick()}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i, winning) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} winning={winning}/>;
  }
  
  render() {
    var rows = [];
    let squares = [];
    for (var row=0; row<3; row++) {
      for (var index=row*3; index<row*3+3; index++) {
        
        let winning = false;
        const winningLine = this.props.winningLine;
        if (winningLine) {
          for (var i=0; i<winningLine.length; i++) {
            if (winningLine[i] == index)
              winning = true;
          }
        }
        
        squares.push(this.renderSquare(index, winning));
      }    
      rows.push(<div key={row} className="board-row">{squares}</div>);
      squares = [];
    }
    
    return <div> {rows} </div>;
    
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }
  handleClick(i) {
    
    const history = this.state.history;
    
    const newest = history[history.length - 1];
    const newestSquares = newest.squares.slice();
    
    if (calculateWinner(newestSquares) || newestSquares[i]) {
      return;
    }
    
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const sign = this.state.xIsNext ? 'X' : '0';
    squares[i] = sign;
    
    this.setState({
      history: history.concat([{
        squares: squares,
        selected: {
          row: i % 3 + 1,
          col: Math.floor(i / 3) + 1,
          sign: sign
        },
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
    
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });  
  }
  
  render() {
    
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    let status;
    let winningLine;
    if (winner) {
      status = 'Winner: ' + winner.sign;
      winningLine = winner.line;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
    }
    
    const moves = history.map((step, move) => {            
      
      const desc = move ? 
            'Move ' + step.selected.sign + ' (' + step.selected.row + ',' + step.selected.col + ')':
            'Game start';
      
      const currentlySelected = (move == stepNumber);
                                 
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)} className={currentlySelected ? 'selectedMove' : ''}>
            {desc}
          </a>
        </li>
      );      
    });
    
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winningLine={winningLine} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
        <ol>{moves}</ol>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        sign: squares[a],
        line: lines[i]
      }
    }
  }
  return null;
}
